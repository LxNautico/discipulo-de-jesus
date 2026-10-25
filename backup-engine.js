/* Backup exclusivo do jogo, com validação, união de progresso e reversão em falhas. */
(() => {
  const fixed=['discipulo-v1','discipulo-topics-v1','discipulo-discipleship-v1','discipulo-deep-studies-v1','discipulo-achievements-v1','discipulo-people-notes-v1','discipulo-online-bible-version'];
  const word=/^discipulo-word-note:(?:ara|por_(?:blj|onbv)):[\p{L}\p{N}]+:[A-Z0-9]{3}:\d{1,3}:\d{1,3}$/u;
  const allowed=k=>fixed.includes(k)||word.test(k);
  function object(v){return v&&typeof v==='object'&&!Array.isArray(v);}
  function safe(v){if(Array.isArray(v)){v.forEach(safe);return;}if(object(v))for(const [k,x]of Object.entries(v)){if(['__proto__','constructor','prototype'].includes(k))throw Error('Chave inválida no arquivo.');safe(x);}}
  function text(v){if(typeof v!=='string'||v.length>200000)throw Error('Anotação inválida ou muito longa.');}
  function notes(v){if(!object(v))throw Error('Formato de anotações inválido.');Object.values(v).forEach(text);}
  function validate(key,raw){
    if(!allowed(key)||typeof raw!=='string')throw Error('Dado não reconhecido no backup.');
    if(word.test(key)){text(raw);return;}
    if(key==='discipulo-online-bible-version'){if(!['1608','212','1840','129','211'].includes(raw))throw Error('Versão bíblica não reconhecida.');return;}
    let v;try{v=JSON.parse(raw);}catch{throw Error('Dados de progresso inválidos.');}safe(v);
    if(!object(v))throw Error('Registro de progresso inválido.');
    if(key==='discipulo-v1'){
      if(v.schemaVersion!==5||!Array.isArray(v.completed)||!v.completed.every(n=>Number.isInteger(n)&&n>=0&&n<20))throw Error('Versão da jornada incompatível.');notes(v.notes);
      if(!Object.keys(v.notes).every(k=>/^\d+$/.test(k)&&Number(k)<20))throw Error('Estudo desconhecido nas anotações.');
      if(v.resume!==undefined&&(!object(v.resume)||!Number.isInteger(v.resume.lesson)||v.resume.lesson<0||v.resume.lesson>=20||typeof v.resume.updatedAt!=='string'||!Number.isFinite(Date.parse(v.resume.updatedAt))))throw Error('Retomada de estudo inválida.');
    }else if(key==='discipulo-topics-v1'){
      if(v.schemaVersion!==1||!object(v.tracks))throw Error('Trilhas incompatíveis.');
      for(const [id,t]of Object.entries(v.tracks)){
        if(!/^[a-z0-9-]+$/.test(id)||!object(t)||!Array.isArray(t.completed)||!t.completed.every(x=>typeof x==='string'&&/^[a-z0-9-]+$/.test(x)))throw Error('Etapas inválidas.');notes(t.notes);if(typeof t.lastStep!=='string')throw Error('Etapa de retomada inválida.');
      }
    }else if(key==='discipulo-discipleship-v1'){
      if(v.schemaVersion!==1||!Array.isArray(v.completed)||!v.completed.every(id=>typeof id==='string'&&/^[a-z0-9-]+$/.test(id))||!object(v.notes)||typeof v.lastModule!=='string'||!/^[a-z0-9-]+$/.test(v.lastModule))throw Error('Trilha de discipulado incompatível.');notes(v.notes);
    }else if(key==='discipulo-deep-studies-v1'){
      if(v.schemaVersion!==1||!object(v.studies))throw Error('Estudos aprofundados incompatíveis.');for(const [id,study]of Object.entries(v.studies))if(!/^[a-z0-9-]+$/.test(id)||!object(study)||typeof study.completed!=='boolean'||!Array.isArray(study.answers)||!study.answers.every(Number.isInteger)||typeof study.note!=='string')throw Error('Estudo aprofundado inválido.');
    }else if(key==='discipulo-achievements-v1'){
      if(v.schemaVersion!==1||!object(v.unlocked)||!Object.entries(v.unlocked).every(([id,date])=>/^[a-z0-9-]+$/.test(id)&&typeof date==='string'&&Number.isFinite(Date.parse(date))))throw Error('Emblemas inválidos.');
    }else {if(v.schemaVersion!==1)throw Error('Perfis incompatíveis.');notes(v.notes);}
  }
  function capture(storage){const data={};for(let i=0;i<storage.length;i++){const k=storage.key(i);if(allowed(k)){const value=storage.getItem(k);validate(k,value);data[k]=value;}}return {app:'discipulo-de-jesus',formatVersion:1,exportedAt:new Date().toISOString(),data};}
  function parse(content){
    if(typeof content!=='string'||content.length>5000000)throw Error('Arquivo inválido ou maior que 5 MB.');
    let file;try{file=JSON.parse(content);}catch{throw Error('Selecione um arquivo JSON de backup do jogo.');}
    if(!object(file)||file.app!=='discipulo-de-jesus'||file.formatVersion!==1||!object(file.data))throw Error('Este arquivo não é um backup compatível do jogo.');
    safe(file);if(Object.keys(file.data).length>5000)throw Error('O arquivo contém registros demais.');
    for(const [k,v]of Object.entries(file.data))validate(k,v);
    return file;
  }
  function joinText(current,incoming){const separator='\n\n— Reflexão importada —\n';return [...new Set([current||'',incoming||''].flatMap(s=>s.split(separator)).filter(Boolean))].join(separator);}
  function joinNotes(a={},b={}){const out={...a};for(const [k,v]of Object.entries(b))out[k]=joinText(a[k],v);return out;}
  function merge(key,current,incoming){
    if(current===null||current===undefined)return incoming;validate(key,current);
    if(word.test(key))return joinText(current,incoming);
    if(key==='discipulo-online-bible-version')return current;
    const a=JSON.parse(current),b=JSON.parse(incoming);
    if(key==='discipulo-v1'){
      const completed=[...new Set([...a.completed,...b.completed])].sort((x,y)=>x-y);
      const resume=[a.resume,b.resume].filter(r=>r&&!completed.includes(r.lesson)).sort((x,y)=>Date.parse(y.updatedAt)-Date.parse(x.updatedAt))[0];
      return JSON.stringify({...a,completed,notes:joinNotes(a.notes,b.notes),resume});
    }
    if(key==='discipulo-people-notes-v1')return JSON.stringify({...a,notes:joinNotes(a.notes,b.notes)});
    if(key==='discipulo-discipleship-v1')return JSON.stringify({...a,completed:[...new Set([...a.completed,...b.completed])],notes:joinNotes(a.notes,b.notes),lastModule:a.lastModule||b.lastModule});
    if(key==='discipulo-deep-studies-v1'){const studies={...a.studies};for(const [id,study]of Object.entries(b.studies)){const old=studies[id];studies[id]=old?{completed:old.completed||study.completed,answers:[...old.answers,...study.answers],note:joinText(old.note,study.note)}:study;}return JSON.stringify({...a,studies});}
    if(key==='discipulo-achievements-v1'){const unlocked={...a.unlocked};for(const [id,date]of Object.entries(b.unlocked))if(!unlocked[id]||Date.parse(date)<Date.parse(unlocked[id]))unlocked[id]=date;return JSON.stringify({...a,unlocked});}
    const tracks={...a.tracks};for(const [id,t]of Object.entries(b.tracks)){const old=tracks[id];tracks[id]=old?{...old,completed:[...new Set([...old.completed,...t.completed])],notes:joinNotes(old.notes,t.notes),lastStep:old.lastStep||t.lastStep}:t;}return JSON.stringify({...a,tracks});
  }
  function preview(storage,file){const plan={};for(const [k,v]of Object.entries(file.data)){validate(k,v);const merged=merge(k,storage.getItem(k),v);validate(k,merged);plan[k]=merged;}return plan;}
  function summary(data){let journey=0,topics=0,discipleship=0,deepStudies=0,badges=0,noteCount=0;for(const [key,raw]of Object.entries(data)){if(word.test(key)){if(raw.trim())noteCount++;continue;}if(key==='discipulo-online-bible-version')continue;const v=JSON.parse(raw);if(key==='discipulo-v1'){journey=new Set(v.completed).size;noteCount+=Object.values(v.notes).filter(x=>x.trim()).length;}else if(key==='discipulo-topics-v1')for(const t of Object.values(v.tracks)){topics+=new Set(t.completed).size;noteCount+=Object.values(t.notes).filter(x=>x.trim()).length;}else if(key==='discipulo-discipleship-v1'){discipleship=new Set(v.completed).size;noteCount+=Object.values(v.notes).filter(x=>x.trim()).length;}else if(key==='discipulo-deep-studies-v1'){deepStudies=Object.values(v.studies).filter(s=>s.completed).length;noteCount+=Object.values(v.studies).filter(s=>s.note.trim()).length;}else if(key==='discipulo-achievements-v1')badges=Object.keys(v.unlocked).length;else noteCount+=Object.values(v.notes).filter(x=>x.trim()).length;}return {journey,topics,discipleship,deepStudies,badges,notes:noteCount};}
  function apply(storage,plan){const previous={};for(const [k,v]of Object.entries(plan)){validate(k,v);previous[k]=storage.getItem(k);}const changed=[];try{for(const [k,v]of Object.entries(plan)){changed.push(k);storage.setItem(k,v);}}catch(error){let failed=false;for(const k of changed.reverse())try{previous[k]===null?storage.removeItem(k):storage.setItem(k,previous[k]);}catch{failed=true;}throw Error(failed?'Falha ao gravar e ao restaurar parte dos dados. Guarde o backup antes de continuar.':'Não foi possível importar. Os dados anteriores foram restaurados.');}}
  const api={capture,parse,preview,summary,apply};if(typeof module!=='undefined'&&module.exports)module.exports=api;else window.GameBackup=api;
})();
