(() => {
  const rules=window.AchievementRules,key='discipulo-achievements-v1';
  let known={},storageOK=true;
  try{const raw=JSON.parse(localStorage.getItem(key));if(raw?.schemaVersion===1&&raw.unlocked&&typeof raw.unlocked==='object')known=raw.unlocked;}catch{storageOK=false;}
  function snapshot(){
    const journey=[...new Set(state.completed)].filter(i=>Number.isInteger(i)&&lessons[i]);
    let topics=null;
    try{topics=JSON.parse(localStorage.getItem('discipulo-topics-v1'));}catch{}
    const money=window.TOPIC_TRACKS?.find(t=>t.id==='dinheiro-generosidade');
    const progress=topics?.tracks?.['dinheiro-generosidade'];
    const valid=new Set(money?.steps.map(s=>s.id)||[]);
    const moneyCompleted=new Set(Array.isArray(progress?.completed)?progress.completed.filter(id=>valid.has(id)):[]).size;
    const hasReflection=Object.values(state.notes).some(n=>typeof n==='string'&&n.trim().length>0)||Object.entries(progress?.notes||{}).some(([id,n])=>valid.has(id)&&typeof n==='string'&&n.trim().length>0);
    return {xp:journey.length*100,journeyCompleted:journey.length,moneyCompleted,hasReflection};
  }
  const nav=document.querySelector('nav'),button=document.createElement('button');button.dataset.view='conquistas';button.textContent='✦   Minhas conquistas';nav.append(button);
  const notice=document.createElement('aside');notice.className='achievement-toast';notice.setAttribute('aria-label','Novas conquistas');notice.hidden=true;
  const message=document.createElement('p');message.setAttribute('role','status');
  const visit=document.createElement('button');visit.className='primary';visit.textContent='Ver conquistas';
  const close=document.createElement('button');close.className='secondary';close.textContent='Fechar';
  const actions=document.createElement('div');actions.className='bible-controls';actions.append(visit,close);notice.append(message,actions);document.body.append(notice);
  close.onclick=()=>{notice.hidden=true;};visit.onclick=()=>{notice.hidden=true;view='conquistas';render();window.scrollTo({top:0,behavior:'smooth'});};
  function sync(announce=true){
    const result=rules.evaluate(snapshot(),known);known=result.unlocked;
    if(result.added.length){
      try{localStorage.setItem(key,JSON.stringify({schemaVersion:1,unlocked:known}));storageOK=true;}catch{storageOK=false;}
      if(announce){message.textContent=(result.added.length===1?'Novo emblema: ':'Novos emblemas: ')+result.added.map(id=>rules.catalog.find(b=>b.id===id).title).join(' · ');notice.hidden=false;}
    }
    return result;
  }
  function show(){
    const current=snapshot(),earned=Object.keys(known).length;
    app.innerHTML=intro('SEU APRENDIZADO, PASSO A PASSO','Minhas conquistas','Cada emblema reconhece atividades de estudo. Seu progresso anterior também conta.')+`<div class="stats"><div class="stat"><strong>${earned} / ${rules.catalog.length}</strong><span>Emblemas recebidos</span></div><div class="stat"><strong>${current.xp}</strong><span>XP na jornada</span></div><div class="stat"><strong>${current.moneyCompleted} / 5</strong><span>Etapas da trilha temática</span></div></div><p class="notice">Os emblemas não concedem XP extra. Revisar um estudo não multiplica pontos. As trilhas temáticas têm progresso próprio. Emblemas reconhecem participação e aprendizado, sem medir fé ou santidade.</p><div id="badge-grid" class="grid"></div>${!storageOK?'<p class="notice" role="status">Não foi possível salvar os emblemas no navegador. Eles poderão ser reconhecidos novamente na próxima visita.</p>':''}`;
    const grid=document.querySelector('#badge-grid');
    rules.catalog.forEach(b=>{
      const date=known[b.id],value=Math.min(b.goal,b.value(current));
      const card=document.createElement('article');card.className='card badge-card '+(date?'badge-earned':'badge-locked');
      const icon=document.createElement('div');icon.className='badge-symbol';icon.textContent=b.icon;icon.setAttribute('aria-hidden','true');
      const status=document.createElement('span');status.className='tag';status.textContent=date?'✓ RECEBIDO':'○ EM ANDAMENTO';
      const title=document.createElement('h3');title.textContent=b.title;
      const description=document.createElement('p');description.textContent=b.description;
      const progress=document.createElement('p');progress.className='muted';progress.textContent=date?'Reconhecido em '+new Date(date).toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo'}):`${value.toLocaleString('pt-BR')} / ${b.goal.toLocaleString('pt-BR')} · Faltam ${(b.goal-value).toLocaleString('pt-BR')}${b.id.startsWith('xp-')?' XP':''}`;
      card.append(icon,status,title,description,progress);grid.append(card);
    });
  }
  const originalSave=save;save=function(){const ok=originalSave();sync();return ok;};
  const originalRender=render;render=function(){sync();originalRender();if(view==='conquistas')show();};
  window.addEventListener('discipulo-topic-progress',()=>{sync();if(view==='conquistas')render();});
  window.addEventListener('storage',event=>{if(event.key==='discipulo-topics-v1'){sync();if(view==='conquistas')render();}});
  // A data registra o reconhecimento atual, não inventa a data de um estudo antigo.
  sync();
})();
