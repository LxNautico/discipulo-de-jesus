/* Progresso da trilha de discipulado, independente de XP e dos estudos históricos. */
(() => {
  const key='discipulo-discipleship-v1';
  function createStore(path,storage){
    const ids=path.modules.map(item=>item.id);let available=true,old={};
    try{const raw=JSON.parse(storage.getItem(key));if(raw?.schemaVersion===1&&raw&&typeof raw==='object')old=raw;}catch{available=false;}
    const state={schemaVersion:1,completed:[...new Set(Array.isArray(old.completed)?old.completed.filter(id=>ids.includes(id)):[])],notes:{},lastModule:ids.includes(old.lastModule)?old.lastModule:ids[0]};
    for(const id of ids)if(typeof old.notes?.[id]==='string')state.notes[id]=old.notes[id];
    const copy=()=>JSON.parse(JSON.stringify(state));
    function persist(){try{storage.setItem(key,JSON.stringify(state));available=true;}catch{available=false;return false;}if(typeof window!=='undefined'&&typeof window.dispatchEvent==='function')window.dispatchEvent(new Event('discipulo-local-progress'));return true;}
    return {get:copy,available:()=>available,select(id){if(!ids.includes(id))return false;state.lastModule=id;return persist();},note(id,value){if(!ids.includes(id)||typeof value!=='string')return false;state.notes[id]=value;return persist();},complete(id){if(!ids.includes(id))return false;if(!state.completed.includes(id))state.completed.push(id);return persist();}};
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={createStore};else window.DiscipleshipProgress={createStore};
})();
