/* Pesquisa exclusivamente no Bible.com, sem corpus local alternativo. */
(() => {
  const catalog=window.BibleVersions;
  let query='';
  const originalRender=render;
  render=function(){originalRender();if(view!=='pesquisa')return;show();};
  function show(){
    app.innerHTML=intro('PESQUISA BÍBLICA','Explore as palavras da Bíblia.','Pesquise no Bible.com usando a mesma versão escolhida para suas leituras.')+'<section class="card"><form id="bible-search"><label for="bible-search-query">Palavra, expressão ou referência</label><input id="bible-search-query" class="search" maxlength="150" required placeholder="Ex.: fé, amor ou João 3:16"><div class="bible-controls"><label class="reader-version-label">Versão da Bíblia<select id="bible-search-version" aria-label="Versão da pesquisa"></select></label><button class="primary" type="submit">Pesquisar em tela inteira</button><a class="secondary" id="bible-search-link" target="_blank" rel="noopener noreferrer" hidden>Abrir pesquisa em outra aba ↗</a></div></form><p id="bible-search-status" class="muted" role="status"></p></section><p class="notice">A busca é feita no Bible.com e exige internet. As contagens locais e o ranking usam somente a ARA de Gênesis; não representam a Bíblia inteira nem as outras versões online.</p><section class="card"><h2>Da pesquisa para o estudo</h2><ol><li>Escolha a versão e pesquise uma palavra ou passagem.</li><li>Abra os resultados no Bible.com e leia o capítulo para entender o contexto.</li><li>Observe quem fala, para quem e como a palavra é usada.</li><li>Relacione o texto aos estudos da jornada e às trilhas de Vida e Palavra.</li></ol><p class="muted">Se a pesquisa não carregar dentro da janela, use a opção de abrir em outra aba.</p></section>';
    const input=document.querySelector('#bible-search-query'),select=document.querySelector('#bible-search-version'),link=document.querySelector('#bible-search-link'),status=document.querySelector('#bible-search-status');
    input.value=query;
    const statistics=document.createElement('button');statistics.type='button';statistics.className='secondary';statistics.textContent='Ver contagens da ARA em Gênesis →';statistics.onclick=()=>{view='estatisticas';render();};document.querySelector('#bible-search').parentElement.append(statistics);
    const results=document.createElement('section');results.className='card search-embedded';results.hidden=true;
    const title=document.createElement('h2');title.textContent='Resultados no Bible.com';
    const enlarge=document.createElement('button');enlarge.className='secondary';enlarge.textContent='Ampliar pesquisa ⤢';
    const frame=document.createElement('iframe');frame.className='bible-search-frame';frame.title='Pesquisa bíblica no Bible.com';frame.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups');frame.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
    results.append(title,enlarge,frame);document.querySelector('#bible-search').parentElement.after(results);
    const submit=document.querySelector('#bible-search button');submit.textContent='Pesquisar no Bible.com';
    let displayed=null;
    enlarge.onclick=()=>{if(displayed)window.openBibleWebsite(displayed.url,displayed.label,enlarge);};
    function displayResults(){
      if(typeof navigator!=='undefined'&&navigator.onLine===false){status.textContent='Conecte o aparelho à internet para pesquisar no Bible.com. Seus estudos locais continuam disponíveis.';return;}
      const version=catalog.versions.find(v=>v.id===select.value);
      displayed={url:link.href,label:`Pesquisa: ${query} · ${version.short} · Bible.com`};
      title.textContent=`Resultados de “${query}” · ${version.short}`;frame.title=displayed.label;frame.src=displayed.url;results.hidden=false;
      status.textContent='A pesquisa do Bible.com está abaixo. Se os resultados não aparecerem, abra em outra aba.';
    }
    catalog.versions.forEach(v=>{const option=document.createElement('option');option.value=v.id;option.textContent=`${v.short} — ${v.name}`;select.append(option);});select.value=catalog.preferred().id;
    function update(){query=input.value.trim();link.hidden=!query;if(query)link.href=catalog.searchUrl(select.value,query);}
    input.oninput=update;
    select.onchange=()=>{catalog.select(select.value);update();status.textContent='Versão de leitura e pesquisa atualizada.';if(displayed&&query)displayResults();};
    document.querySelector('#bible-search').onsubmit=e=>{
      e.preventDefault();update();if(!query){input.focus();return;}
      displayResults();
    };
    update();
  }
})();
