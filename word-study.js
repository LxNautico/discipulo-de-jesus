(() => {
  const engine = window.WordEngine;
  const statsButton=document.createElement('button');statsButton.dataset.view='estatisticas';statsButton.textContent='▥   Estatísticas de palavras';document.querySelector('nav').append(statsButton);
  const editions = [{id:'ara',name:'ARA · Gênesis',data:window.BIBLE_ARA}].filter(e=>e.data);
  const cache = new Map();
  const escape = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let selected = editions[0].id, ignoreAccents = false, hideCommon = true, word = '', page = 0, generation = 0;
  const originalRender = render;
  function index(edition) {
    const key = edition.id + ':' + ignoreAccents;
    if (!cache.has(key)) cache.set(key, engine.build(edition.data,ignoreAccents));
    return cache.get(key);
  }
  render = function () {
    generation++;
    originalRender();
    if (view !== 'estatisticas') return;
    app.innerHTML = intro('ARA · CONTAGEM LOCAL','Estatísticas de palavras','Contagens e ranking da ARA, somente em Gênesis 1–50. Outros livros ainda não estão incluídos. Outras versões podem ser consultadas online no Bible.com.') + `<section class="card"><form id="bible-word-form"><label for="bible-word">Uma palavra</label><input id="bible-word" class="search" required maxlength="60" placeholder="Ex.: fé, amor, graça" value="${escape(word)}"><div class="bible-controls"><label>Fonte da contagem<select id="word-edition">${editions.map(e=>`<option value="${e.id}" ${e.id===selected?'selected':''}>${e.name}</option>`).join('')}</select></label><label><input type="checkbox" id="word-accents" ${ignoreAccents?'checked':''}> Ignorar acentos</label><button class="primary">Pesquisar em Gênesis</button></div></form><p class="muted">Palavra inteira, sem distinguir maiúsculas. Flexões não são agrupadas: “amar” e “amor” são buscas diferentes. Hífens e pontuação separam palavras. Ignorar acentos une, por exemplo, “fé” e “fe”.</p></section><div id="word-output" aria-live="polite"></div><section class="card" style="margin-top:24px"><h2>Palavras mais frequentes</h2><label><input type="checkbox" id="word-common" ${hideCommon?'checked':''}> Ocultar palavras comuns (lista fixa de artigos, pronomes e conectivos)</label><p class="muted">Ranking de frequência textual, não de importância teológica. A opção acima apenas filtra a lista; não altera as contagens.</p><div id="word-ranking"></div></section>`;
    document.querySelector('#bible-word-form').onsubmit=e=>{e.preventDefault();word=document.querySelector('#bible-word').value.trim();page=0;update();};
    document.querySelector('#word-edition').onchange=e=>{selected=e.target.value;page=0;update();};
    document.querySelector('#word-accents').onchange=e=>{ignoreAccents=e.target.checked;page=0;update();};
    document.querySelector('#word-common').onchange=e=>{hideCommon=e.target.checked;update();};
    update();
  };
  function update() {
    const run=++generation;
    const output=document.querySelector('#word-output'), ranks=document.querySelector('#word-ranking');
    output.textContent='Preparando as contagens…'; ranks.textContent='Carregando ranking…';
    // Libera a tela antes de indexar os arquivos locais pela primeira vez.
    setTimeout(()=>{
      if(run!==generation || view!=='estatisticas')return;
      const edition=editions.find(e=>e.id===selected), current=index(edition);
      ranks.innerHTML=`<p class="muted">${escape(edition.name)} · ${current.verseCount.toLocaleString('pt-BR')} versículos · ${current.tokenCount.toLocaleString('pt-BR')} palavras contadas · Top 30</p><div class="word-rank-list">${engine.ranking(current,hideCommon,ignoreAccents).slice(0,30).map((entry,i)=>`<button class="secondary" data-word="${escape(entry.word)}">${i+1}. ${escape(entry.word)} <strong>${entry.count.toLocaleString('pt-BR')}</strong></button>`).join('')}</div>`;
      ranks.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>{word=b.dataset.word;page=0;document.querySelector('#bible-word').value=word;update();output.scrollIntoView({behavior:'smooth',block:'start'});});
      if(!word){output.innerHTML='<p class="notice">Pesquise uma palavra ou escolha uma no ranking para começar seu estudo.</p>';return;}
      const tokens=engine.tokenize(word);
      if(tokens.length!==1 || tokens[0]!==word){output.textContent='Digite uma única palavra, sem espaços ou pontuação.';return;}
      const key=engine.normalize(word,ignoreAccents), entry=current.words.get(key), matches=entry?.matches||[];
      const comparisons=editions.map(e=>{const found=index(e).words.get(key);return `<tr><td>${escape(e.name)}</td><td>${(found?.count||0).toLocaleString('pt-BR')}</td><td>${(found?.matches.length||0).toLocaleString('pt-BR')}</td></tr>`;}).join('');
      output.innerHTML=`<h2>“${escape(word)}” em Gênesis · ARA</h2><table><thead><tr><th>Tradução</th><th>Ocorrências</th><th>Versículos</th></tr></thead><tbody>${comparisons}</tbody></table><p class="muted">A mesma palavra pode aparecer mais de uma vez em um versículo. As contagens abrangem apenas os 1.533 versículos de Gênesis na ARA, sem títulos, notas ou referências editoriais. Não são totais da Bíblia inteira.</p><h3>Continue o estudo · ${escape(edition.name)}</h3><p>${matches.length?`Mostrando ${page*20+1}–${Math.min((page+1)*20,matches.length)} de ${matches.length} versículos, em ordem bíblica.`:'Nenhuma ocorrência nesta tradução. Tente outra palavra ou altere a opção de acentos.'}</p><div id="word-passages"></div><div class="bible-controls"><button class="secondary" id="word-previous" ${page===0?'disabled':''}>← Anteriores</button><button class="secondary" id="word-next" ${(page+1)*20>=matches.length?'disabled':''}>Próximos →</button></div>`;
      const passages=document.querySelector('#word-passages');
      matches.slice(page*20,(page+1)*20).forEach((match,i)=>{const card=document.createElement('article');card.className='card';card.style.marginBottom='12px';card.innerHTML=`<span class="tag">${escape(match.name)} ${match.chapter}:${match.verse} · ${match.count} ocorrência(s)</span><p>${escape(match.text)}</p><button class="secondary">Ler capítulo e estudar →</button>`;card.querySelector('button').onclick=()=>study(edition,matches,page*20+i,key);passages.append(card);});
      document.querySelector('#word-previous').onclick=()=>{page--;update();};document.querySelector('#word-next').onclick=()=>{page++;update();};
    },20);
  }
  function study(edition,matches,position,key) {
    const modal=document.createElement('dialog');modal.className='word-study-dialog';document.body.append(modal);
    modal.addEventListener('close',()=>modal.remove());
    function paint() {
      const match=matches[position];
      modal.innerHTML=`<button class="close" aria-label="Fechar estudo">×</button><span class="eyebrow">ESTUDO POR PALAVRA · ${position+1} / ${matches.length}</span><h2>Estudando “${escape(key)}”</h2><div class="bible-controls"><button id="study-previous" class="secondary" ${position===0?'disabled':''}>← Passagem anterior</button><button id="study-next" class="secondary" ${position===matches.length-1?'disabled':''}>Próxima passagem →</button></div><div id="study-reader"></div><h3>Observe, compreenda e aplique</h3><ol><li>Quem fala e para quem? O que acontece no capítulo?</li><li>O que esta palavra significa nesta passagem? Compare com as outras ocorrências sem presumir um sentido idêntico.</li><li>O que o texto ensina sobre Deus e o próximo? Qual aplicação respeita esse contexto?</li></ol><label for="word-note">Sua reflexão sobre esta passagem</label><textarea id="word-note"></textarea><button id="word-note-save" class="primary">Salvar reflexão</button><p id="word-note-status" role="status"></p><p class="muted">Estudo livre: não altera o XP nem as conclusões da jornada. As notas ficam apenas neste navegador. Salve antes de mudar de passagem.</p>`;
      modal.querySelector('.close').onclick=()=>modal.close();
      const storageKey=`discipulo-word-note:${edition.id}:${key}:${match.book}:${match.chapter}:${match.verse}`;
      const note=modal.querySelector('#word-note');try{note.value=localStorage.getItem(storageKey)||'';}catch{}
      modal.querySelector('#word-note-save').onclick=()=>{try{localStorage.setItem(storageKey,note.value);window.dispatchEvent(new Event('discipulo-local-progress'));modal.querySelector('#word-note-status').textContent='Reflexão salva neste navegador.';}catch{modal.querySelector('#word-note-status').textContent='Não foi possível salvar a reflexão.';}};
      modal.querySelector('#study-previous').onclick=()=>{position--;paint();};modal.querySelector('#study-next').onclick=()=>{position++;paint();};
      const sourceNotice=document.createElement("p"); sourceNotice.className="notice"; sourceNotice.textContent="A ocorrência foi encontrada em "+edition.name+". O leitor abre o mesmo capítulo na ARA local. Outras versões estão disponíveis online no Bible.com."; modal.querySelector("#study-reader").append(sourceNotice);
      window.createBibleReader(modal.querySelector('#study-reader'),match.book,match.chapter,{book:match.book,fromChapter:match.chapter,toChapter:match.chapter,fromVerse:match.verse,toVerse:match.verse},edition.id);
    }
    paint();modal.showModal();
  }
})();
