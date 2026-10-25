/* Biblioteca de história da teologia; sem concessão de XP ou mudanças em saves. */
(() => {
 const profiles=window.THEOLOGIAN_GUIDE.profiles;
 const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const normalize=value=>value.normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase('pt-BR');
 const colors={'Patrística':'patristic','Medieval':'medieval','Luterana':'lutheran','Reformada':'reformed','Arminiana / Wesleyana':'wesleyan','Anglicana evangélica':'anglican'};
 const badge=value=>`<span class="tag tradition-badge tradition-${colors[value]}">${esc(value)}</span>`;
 let active=null,query='',tradition='all',era='all',order='history';
 const nav=document.querySelector('nav'),button=document.createElement('button');button.dataset.view='teologos';button.textContent='◉   Teólogos';nav.insertBefore(button,nav.querySelector('[data-view="teologia"]'));
 const previousRender=render;
 render=function(){previousRender();if(view!=='teologos')return;if(active)showProfile();else showList();};
 const $=id=>document.getElementById(id);
 function top(){window.scrollTo({top:0,behavior:'smooth'});}
 function open(id){active=profiles.find(p=>p.id===id);render();top();$('theologian-title').focus({preventScroll:true});}
 function options(field){return [...new Set(profiles.map(p=>p[field]))].map(value=>`<option value="${esc(value)}">${esc(value)}</option>`).join('');}
 function showList(){
  app.innerHTML=intro('HISTÓRIA DO PENSAMENTO CRISTÃO','Teólogos e suas contribuições','Conheça autores que marcaram a reflexão cristã, suas principais obras e as perguntas que procuraram responder.')+
   '<p class="muted">Seleção inicial de 18 autores, com atenção à tradição reformada e espaço para outras correntes. Estudar um autor não significa concordar com todas as suas posições.</p>'+
   `<section class="card theologian-filters"><label for="theologian-query">Pesquisar autor, obra ou ideia<input type="search" class="search" id="theologian-query" placeholder="Ex.: Calvino, graça, Confissões" value="${esc(query)}"></label><div class="bible-controls"><label>Tradição<select id="theologian-tradition"><option value="all">Todas</option>${options('tradition')}</select></label><label>Época<select id="theologian-era"><option value="all">Todas</option>${options('era')}</select></label><label>Ordem<select id="theologian-order"><option value="history">Histórica</option><option value="name">Nome · A–Z</option></select></label><button class="secondary" id="theologian-clear">Limpar filtros</button></div></section><div class="tradition-legend" aria-label="Cores das tradições">${Object.keys(colors).map(badge).join('')}</div><p id="theologian-count" role="status"></p><div class="grid theologian-grid" id="theologian-results"></div>`;
  $('theologian-tradition').value=tradition;$('theologian-era').value=era;$('theologian-order').value=order;
  $('theologian-query').oninput=e=>{query=e.target.value;results();};
  $('theologian-tradition').onchange=e=>{tradition=e.target.value;results();};$('theologian-era').onchange=e=>{era=e.target.value;results();};$('theologian-order').onchange=e=>{order=e.target.value;results();};
  $('theologian-clear').onclick=()=>{query='';tradition=era='all';order='history';showList();$('theologian-query').focus();};results();
 }
 function results(){
  const q=normalize(query.trim()),found=profiles.filter(p=>(tradition==='all'||p.tradition===tradition)&&(era==='all'||p.era===era)&&normalize([p.name,...p.aliases,p.tradition,...p.themes,...p.ideas.flat(),...p.works.flat()].join(' ')).includes(q));
  found.sort(order==='name'?(a,b)=>a.name.localeCompare(b.name,'pt-BR'):(a,b)=>a.born-b.born);
  $('theologian-count').textContent=`${found.length} de ${profiles.length} autores · ${order==='history'?'ordem de nascimento':'ordem alfabética'}`;
  $('theologian-results').innerHTML=found.length?found.map(p=>`<article class="card theologian-card tradition-${colors[p.tradition]}">${badge(p.tradition)}<p class="theologian-dates">${esc(p.dates)} · ${esc(p.era)}</p><h2>${esc(p.name)}</h2><p>${esc(p.context)}</p><div class="theologian-themes">${p.themes.map(t=>`<span>${esc(t)}</span>`).join('')}</div><button class="secondary" data-theologian="${p.id}">Conhecer autor e ideias →</button></article>`).join(''):'<p class="notice">Nenhum autor encontrado. Experimente outro termo ou limpe os filtros.</p>';
  $('theologian-results').querySelectorAll('[data-theologian]').forEach(b=>b.onclick=()=>open(b.dataset.theologian));
 }
 function reference(reading){const [id,chapter,from,to]=reading;const book=window.BIBLE_CATALOG.books.find(b=>b.id===id);return `${book.name} ${chapter}:${from}${from===to?'':'–'+to}`;}
 function showProfile(){
  const p=active;
  const related=profiles.filter(other=>other.id!==p.id&&other.themes.some(theme=>p.themes.includes(theme))).slice(0,3);
  const compare=['calvino','arminio','wesley'].includes(p.id);
  app.innerHTML=`<button id="theologians-back" class="secondary">← Todos os teólogos</button><section class="intro"><span class="eyebrow">${esc(p.era)}</span><div class="theologian-profile-tradition">${badge(p.tradition)}</div><h1 id="theologian-title" tabindex="-1">${esc(p.name)}</h1><p>${esc(p.dates)} · ${esc(p.region)}</p></section><section class="card"><h2>Quem foi e em que contexto escreveu</h2><p>${esc(p.context)}</p><div class="theologian-themes">${p.themes.map(t=>`<span>${esc(t)}</span>`).join('')}</div></section><section class="theologian-section"><h2>Principais ideias e contribuições</h2><div class="grid">${p.ideas.map(([title,text])=>`<article class="card"><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</div></section><section class="card theologian-section"><h2>Obras para conhecer</h2><p class="muted">Títulos em português podem variar conforme a edição. Os resumos abaixo apresentam o assunto, não o texto integral das obras.</p><ul class="theologian-works">${p.works.map(([title,text])=>`<li><h3>${esc(title)}</h3><p>${esc(text)}</p></li>`).join('')}</ul></section><section class="card theologian-section"><h2>Contexto e leitura crítica</h2><p>${esc(p.caution)}</p>${compare?'<button class="secondary" id="theologian-compare">Consultar perspectivas reformada e arminiana →</button>':''}</section><section class="card theologian-section"><h2>Do autor para as Escrituras</h2><p>Leia estas passagens em contexto e avalie os argumentos. Elas são pontos de investigação, não uma comprovação automática de todas as ideias do autor.</p><div class="bible-controls">${p.readings.map((r,i)=>`<button class="secondary" data-theologian-reading="${i}">${esc(reference(r))} · ARA →</button>`).join('')}</div><details id="theologian-reader-details" class="lesson-bible"><summary id="theologian-reader-label">Leitor bíblico</summary><div id="theologian-reader"></div></details><h3>Uma pergunta para aprofundar</h3><p>${esc(p.question)}</p></section>${related.length?`<section class="card theologian-section"><h2>Autores com temas em comum</h2><div class="bible-controls">${related.map(other=>`<button class="secondary" data-related-theologian="${other.id}">${esc(other.name)} →</button>`).join('')}</div><p class="muted">A proximidade de temas não significa que defendam a mesma posição.</p></section>`:''}<details class="card theologian-section"><summary>Fontes e critérios editoriais</summary><p>Síntese original em português, com perspectiva histórica. As tradições indicadas são aproximações e não tornam os autores equivalentes. Referências consultadas em 16/10/2026; os links externos exigem internet e podem estar em outro idioma.</p><ul><li><a href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">${esc(p.sourceName)} ↗</a></li>${p.extraSources?.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a></li>`).join('')||''}</ul></details>`;
  $('theologians-back').onclick=()=>{active=null;render();top();$('theologian-query').focus({preventScroll:true});};
  if(compare)$('theologian-compare').onclick=()=>{view='teologia';render();top();};
  app.querySelectorAll('[data-related-theologian]').forEach(b=>b.onclick=()=>open(b.dataset.relatedTheologian));
  app.querySelectorAll('[data-theologian-reading]').forEach(button=>button.onclick=()=>{
   const reading=p.readings[Number(button.dataset.theologianReading)],[book,chapter,from,to]=reading,host=$('theologian-reader');host.replaceChildren();$('theologian-reader-label').textContent=reference(reading)+' · ARA';$('theologian-reader-details').open=true;
   window.createBibleReader(host,book,chapter,{book,fromChapter:chapter,toChapter:chapter,fromVerse:from,toVerse:to});$('theologian-reader-details').scrollIntoView({behavior:'smooth',block:'center'});
  });
 }
})();
