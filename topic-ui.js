(() => {
  const tracks=window.TOPIC_TRACKS;
  const storage={getItem:k=>localStorage.getItem(k),setItem:(k,v)=>localStorage.setItem(k,v)};
  const store=window.TopicProgress.createStore(tracks,storage);
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let activeTrack=null,activeStep=null;
  const originalRender=render;
  render=function(){originalRender();if(view!=='temas')return;if(!activeTrack)showTopics();else if(!activeStep)showTrack();else showStep();};
  const warning=()=>!store.available()?'<p class="notice" role="status">Não foi possível salvar no navegador. Seu progresso desta sessão pode se perder ao fechar a página.</p>':'';
  function showTopics(){
    app.innerHTML=intro('VIDA E PALAVRA','A Bíblia no cotidiano','Explore temas da vida por meio de leituras, contexto bíblico e aplicação prática.')+`<div class="grid">${themes.map(t=>{const track=tracks.find(item=>item.title===t[0]);if(!track)return `<article class="card"><span class="symbol">❧</span><h3>${esc(t[0])}</h3><span class="tag">${esc(t[1])}</span><p>${esc(t[2])}</p><p class="muted">Trilha completa em preparação.</p></article>`;const progress=store.get(track.id),done=progress.completed.length;return `<article class="card topic-featured"><span class="symbol">❧</span><h3>${esc(t[0])}</h3><span class="tag">TRILHA DISPONÍVEL · ${track.steps.length} ETAPAS</span><p>${esc(t[2])}</p><p class="muted">${done} / ${track.steps.length} etapas concluídas</p><button class="primary" data-open-topic="${track.id}">${done===track.steps.length?'Revisar trilha':done||progress.notes[progress.lastStep]?'Continuar trilha':'Conhecer a trilha'} →</button></article>`;}).join('')}</div>${warning()}`;
    app.querySelectorAll('[data-open-topic]').forEach(button=>button.onclick=()=>{activeTrack=tracks.find(track=>track.id===button.dataset.openTopic);activeStep=null;render();});
  }
  function showTrack(){
    const t=activeTrack,p=store.get(t.id),done=p.completed.length;
    const next=t.steps.find(s=>!p.completed.includes(s.id));
    const resume=t.steps.find(s=>s.id===p.lastStep)||next||t.steps[0];
    app.innerHTML=`<button class="secondary" id="topics-back">← Todos os temas</button>`+intro('TRILHA TEMÁTICA',esc(t.title),esc(t.description))+`<section class="card"><span class="tag ${done===t.steps.length?'topic-complete':''}">${done===t.steps.length?'✓ TRILHA CONCLUÍDA':`${done} / ${t.steps.length} ETAPAS CONCLUÍDAS`}</span><progress class="topic-progress" max="${t.steps.length}" value="${done}" aria-label="Progresso da trilha"></progress><p>${esc(t.perspective)}</p><button class="primary" id="resume-topic">${done===t.steps.length?'Revisitar estudo':'Retomar estudo'} →</button><p class="muted">As reflexões são pessoais. A conclusão registra atividades de aprendizado e não mede sua vida espiritual. Esta trilha não altera o XP da jornada histórica.</p></section><h2>Seu caminho neste tema</h2><div class="topic-steps">${t.steps.map((s,i)=>`<article class="card lesson-card ${p.completed.includes(s.id)?'done':next?.id===s.id?'next-study':'pending'}"><span class="tag">${p.completed.includes(s.id)?'✓ CONCLUÍDO':next?.id===s.id?'→ PRÓXIMA ETAPA':`ETAPA ${i+1}`}</span><h3>${esc(s.title)}</h3><p>${esc(s.summary)}</p><p class="muted">${s.readings.map(r=>esc(r.label)).join(' · ')}</p><button class="secondary" data-topic-step="${s.id}">${p.completed.includes(s.id)?'Revisar':'Estudar'} →</button></article>`).join('')}</div>${warning()}`;
    document.querySelector('#topics-back').onclick=()=>{activeTrack=null;activeStep=null;render();};
    document.querySelector('#resume-topic').onclick=()=>openStep(resume.id);
    app.querySelectorAll('[data-topic-step]').forEach(b=>b.onclick=()=>openStep(b.dataset.topicStep));
  }
  function openStep(id){activeStep=activeTrack.steps.find(s=>s.id===id);store.select(activeTrack.id,id);render();window.scrollTo({top:0,behavior:'smooth'});}
  function showStep(){
    const t=activeTrack,s=activeStep,p=store.get(t.id),i=t.steps.indexOf(s),completed=p.completed.includes(s.id);
    app.innerHTML=`<button class="secondary" id="track-back">← Visão da trilha</button>`+intro(`ETAPA ${i+1} DE ${t.steps.length} · ${esc(t.title)}`,esc(s.title),esc(s.summary))+`<section class="card"><h2>1. Leia no contexto</h2><div id="topic-readings"></div><h3>Contexto da passagem</h3><p>${esc(s.context)}</p><h2>2. Compreenda</h2><p>${esc(s.teaching)}</p><h3>Confira seu entendimento</h3><p>${esc(s.question)}</p><div class="answers">${s.answers.map((a,n)=>`<button data-topic-answer="${n}">${esc(a)}</button>`).join('')}</div><div id="topic-feedback" aria-live="polite"></div><h2>3. Reflita e pratique</h2><ul>${s.reflection.map(q=>`<li>${esc(q)}</li>`).join('')}</ul><p class="notice"><strong>Aplicação prática</strong><br>${esc(s.practice)}</p><label for="topic-note">Sua reflexão (salva automaticamente neste navegador)</label><textarea id="topic-note" placeholder="O que o texto ensina? Como posso aplicar isso?"></textarea><p id="topic-note-status" role="status" class="muted"></p><div class="topic-actions"><button class="secondary" id="topic-previous" ${i===0?'disabled':''}>← Etapa anterior</button><button class="primary" id="topic-finish" ${completed?'':'disabled'}>${completed?'✓ Concluído · Continuar':'Responda à pergunta para concluir'} →</button></div></section>${warning()}`;
    const host=document.querySelector('#topic-readings');
    s.readings.forEach(r=>{const details=document.createElement('details');details.className='lesson-bible';const summary=document.createElement('summary');summary.textContent=r.label+' · Ler na Bíblia';const reader=document.createElement('div');details.append(summary,reader);host.append(details);window.createBibleReader(reader,r.book,r.chapter,{book:r.book,fromChapter:r.chapter,toChapter:r.chapter,fromVerse:r.from,toVerse:r.to});});
    document.querySelector('#track-back').onclick=()=>{activeStep=null;render();};
    const note=document.querySelector('#topic-note');note.value=p.notes[s.id]||'';
    document.querySelector('#topic-note-status').textContent=store.available()?'Suas reflexões ficam apenas neste navegador.':'Armazenamento indisponível; a reflexão ficará apenas nesta sessão.';
    note.oninput=()=>{const saved=store.note(t.id,s.id,note.value);document.querySelector('#topic-note-status').textContent=saved?'Reflexão salva.':'Não foi possível salvar. Copie sua reflexão antes de sair.';};
    const finish=document.querySelector('#topic-finish');
    app.querySelectorAll('[data-topic-answer]').forEach(b=>b.onclick=()=>{const correct=Number(b.dataset.topicAnswer)===s.correct;document.querySelector('#topic-feedback').innerHTML=`<p class="feedback ${correct?'feedback-success':'feedback-retry'}">${correct?'✓ Resposta correta. '+esc(s.explanation):'↻ Releia o texto e tente novamente.'}</p>`;if(correct){finish.disabled=false;finish.textContent=completed?'✓ Concluído · Continuar →':'Concluir etapa e continuar →';app.querySelectorAll('[data-topic-answer]').forEach(a=>a.disabled=true);}});
    document.querySelector('#topic-previous').onclick=()=>openStep(t.steps[i-1].id);
    finish.onclick=()=>{if(finish.disabled)return;store.complete(t.id,s.id);if(i<t.steps.length-1)openStep(t.steps[i+1].id);else{activeStep=null;render();window.scrollTo({top:0,behavior:'smooth'});}};
  }
})();
