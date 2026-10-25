/* Progresso temático independente da jornada, indexado por IDs estáveis. */
(() => {
  function createStore(tracks,storage){
    const key='discipulo-topics-v1';let available=true;let saved={};
    try{const raw=JSON.parse(storage.getItem(key));if(raw?.schemaVersion===1&&raw.tracks&&typeof raw.tracks==='object')saved=raw.tracks;}catch{available=false;}
    const state={schemaVersion:1,tracks:{}};
    tracks.forEach(track=>{const old=saved[track.id]||{},ids=track.steps.map(s=>s.id);const notes={};for(const id of ids)if(typeof old.notes?.[id]==='string')notes[id]=old.notes[id];state.tracks[track.id]={completed:[...new Set(Array.isArray(old.completed)?old.completed.filter(id=>ids.includes(id)):[])],notes,lastStep:ids.includes(old.lastStep)?old.lastStep:ids[0]};});
    function persist(){try{storage.setItem(key,JSON.stringify(state));available=true;}catch{available=false;return false;}if(typeof window!=='undefined')window.dispatchEvent(new Event('discipulo-topic-progress'));return true;}
    function valid(trackId,stepId){return tracks.some(t=>t.id===trackId&&t.steps.some(s=>s.id===stepId));}
    return {get:trackId=>JSON.parse(JSON.stringify(state.tracks[trackId])),available:()=>available,
      select(trackId,stepId){if(!valid(trackId,stepId))return false;state.tracks[trackId].lastStep=stepId;return persist();},
      note(trackId,stepId,value){if(!valid(trackId,stepId)||typeof value!=='string')return false;state.tracks[trackId].notes[stepId]=value;return persist();},
      complete(trackId,stepId){if(!valid(trackId,stepId))return false;const t=state.tracks[trackId];if(!t.completed.includes(stepId))t.completed.push(stepId);return persist();}
    };
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={createStore};else window.TopicProgress={createStore};
})();
