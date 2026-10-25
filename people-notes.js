/* Anotações de perfis são independentes dos estudos e das conquistas. */
(() => {
  function create(profiles,storage){
    const key='discipulo-people-notes-v1',ids=new Set(profiles.map(p=>p.id));let notes={},available=true;
    try{const saved=JSON.parse(storage.getItem(key));if(saved?.schemaVersion===1)for(const [id,value] of Object.entries(saved.notes||{}))if(ids.has(id)&&typeof value==='string')notes[id]=value;}catch{available=false;}
    return {get:id=>notes[id]||'',available:()=>available,set(id,value){if(!ids.has(id)||typeof value!=='string')return false;notes[id]=value;try{storage.setItem(key,JSON.stringify({schemaVersion:1,notes}));available=true;}catch{available=false;return false;}if(typeof window!=='undefined')window.dispatchEvent(new Event('discipulo-local-progress'));return true;}};
  }
  const api={create};if(typeof module!=='undefined'&&module.exports)module.exports=api;else window.PeopleNotes=api;
})();
