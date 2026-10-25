(() => {
  const profiles=window.PEOPLE_PROFILES;
  const notes=window.PeopleNotes.create(profiles,{getItem:k=>localStorage.getItem(k),setItem:(k,v)=>localStorage.setItem(k,v)});
  const esc=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize=text=>text.normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase('pt-BR');
  let profile=null,query='',letter='Todos';
  const originalRender=render;
  render=function(){originalRender();if(view!=='pessoas')return;if(profile)showProfile();else showList();};
  function showList(){
    const letters=[...new Set(people.map(p=>p[0][0]))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
    app.innerHTML=intro('ENCICLOPÉDIA BÍBLICA','Pessoas da Bíblia','Conheça as pessoas, leia as passagens e conecte suas histórias aos estudos da jornada. Abraão, Moisés, Davi e Paulo já possuem perfis completos.')+`<label for="profile-search">Pesquisar por nome</label><input id="profile-search" class="search" placeholder="Ex.: Abraão, Moisés ou Paulo" value="${esc(query)}"><div class="letters">${['Todos',...letters].map(l=>`<button data-profile-letter="${l}" class="${letter===l?'active':''}" aria-pressed="${letter===l}">${l}</button>`).join('')}</div><div class="grid" id="profile-results" aria-live="polite"></div>`;
    document.querySelector('#profile-search').oninput=e=>{query=e.target.value;showResults();};
    app.querySelectorAll('[data-profile-letter]').forEach(b=>b.onclick=()=>{letter=b.dataset.profileLetter;app.querySelectorAll('[data-profile-letter]').forEach(a=>{a.classList.toggle('active',a===b);a.setAttribute('aria-pressed',String(a===b));});showResults();});
    showResults();
  }
  function showResults(){
    const found=people.filter(person=>{const full=profiles.find(p=>p.name===person[0]);return [person[0],...(full?.aliases||[])].some(name=>normalize(name).includes(normalize(query.trim())))&&(letter==='Todos'||person[0].startsWith(letter));});
    const results=document.querySelector('#profile-results');
    results.innerHTML=found.map(person=>{const full=profiles.find(p=>p.name===person[0]);return `<article class="card ${full?'person-ready':''}"><span class="symbol" aria-hidden="true">♙</span><h3>${esc(person[0])}</h3><p>${esc(person[1])}</p><span class="tag">${esc(person[2])}</span>${full?`<p class="muted">Biografia · passagens · estudos relacionados</p><button class="primary" data-open-profile="${full.id}">Conhecer ${esc(full.name)} →</button>`:'<p class="muted">Perfil completo em preparação.</p>'}</article>`;}).join('')||'<p>Nenhuma pessoa encontrada nesta amostra.</p>';
    results.querySelectorAll('[data-open-profile]').forEach(b=>b.onclick=()=>{profile=profiles.find(p=>p.id===b.dataset.openProfile);render();window.scrollTo({top:0,behavior:'smooth'});});
  }
  function addReading(host,r){
    const details=document.createElement('details');details.className='lesson-bible';
    const summary=document.createElement('summary');summary.textContent=r.label+' · Ler no jogo';
    const reader=document.createElement('div');details.append(summary,reader);host.append(details);
    window.createBibleReader(reader,r.book,r.chapter,{book:r.book,fromChapter:r.chapter,toChapter:r.chapter,fromVerse:r.from,toVerse:r.to});
  }
  function showProfile(){
    const p=profile;
    const related=p.relatedStudies.map(title=>({title,index:lessons.findIndex(l=>l.title===title)})).filter(l=>l.index>=0);
    app.innerHTML=`<button class="secondary" id="people-back">← Voltar às pessoas</button>`+intro('PERFIL BÍBLICO',esc(p.name),esc(p.subtitle))+`<p class="person-intro">${esc(p.introduction)}</p><h2>Quem foi</h2><div class="grid">${p.facts.map(f=>`<article class="card"><h3>${esc(f.label)}</h3><p>${esc(f.text)}</p><span class="tag">${esc(f.reference)}</span></article>`).join('')}</div><h2>Acontecimentos na narrativa</h2><p class="muted">Uma seleção de episódios para orientar a leitura; não substitui a história completa de Gênesis 11–25.</p><div id="person-events" class="person-timeline"></div><section class="card person-interpretation"><span class="tag">INTERPRETAÇÃO TEOLÓGICA</span><h2>${esc(p.interpretation.title)}</h2><p>${esc(p.interpretation.text)}</p><div id="person-interpretation-readings"></div></section><p class="notice"><strong>Texto, história e interpretação</strong><br>${esc(p.historicalNote)}</p><h2>Continue na jornada</h2><div class="grid">${related.map(l=>`<article class="card"><span class="tag">${state.completed.includes(l.index)?'✓ CONCLUÍDO':'ESTUDO RELACIONADO'}</span><h3>${esc(l.title)}</h3><p>${esc(lessons[l.index].ref)}</p><button class="secondary" data-profile-study="${l.index}">${state.completed.includes(l.index)?'Revisar estudo':'Abrir estudo'} →</button></article>`).join('')}</div><h2>Temas para aprofundar</h2><div id="person-themes"></div><section class="card"><h2>Sua reflexão</h2><ul>${p.reflection.map(q=>`<li>${esc(q)}</li>`).join('')}</ul><label for="person-note">Anotações sobre ${esc(p.name)}</label><textarea id="person-note" placeholder="Registre suas perguntas e descobertas…"></textarea><p id="person-note-status" class="muted" role="status"></p><p class="muted">Salvo automaticamente apenas neste navegador. Consultar perfis e escrever aqui não altera XP, conclusões ou emblemas da jornada.</p></section>`;
    document.querySelector('#people-back').onclick=()=>{profile=null;render();};
    p.events.forEach(event=>{const card=document.createElement('article');card.className='card person-event';const title=document.createElement('h3');title.textContent=event.title;const text=document.createElement('p');text.textContent=event.text;card.append(title,text);addReading(card,event.reading);document.querySelector('#person-events').append(card);});
    p.interpretation.readings.forEach(r=>addReading(document.querySelector('#person-interpretation-readings'),r));
    p.themes.forEach(theme=>{const card=document.createElement('article');card.className='card person-theme';const title=document.createElement('h3');title.textContent=theme.name;const question=document.createElement('p');question.textContent=theme.question;card.append(title,question);theme.readings.forEach(r=>addReading(card,r));document.querySelector('#person-themes').append(card);});
    app.querySelectorAll('[data-profile-study]').forEach(b=>b.onclick=()=>openLesson(Number(b.dataset.profileStudy)));
    const note=document.querySelector('#person-note'),status=document.querySelector('#person-note-status');note.value=notes.get(p.id);status.textContent=notes.available()?'Suas anotações ficam apenas neste navegador.':'Não foi possível acessar o armazenamento do navegador.';
    note.oninput=()=>{status.textContent=notes.set(p.id,note.value)?'Anotação salva.':'Não foi possível salvar. Copie sua anotação antes de sair.';};
  }
})();
