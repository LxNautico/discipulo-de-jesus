/* Núcleo testável. Nunca altera o save local durante uma operação de rede. */
(() => {
  function create(backup){
    async function sync(storage,remote,isCurrent=()=>true){
      for(let attempt=0;attempt<3;attempt++){
        const existing=await remote.read();if(!isCurrent())throw Error('A conta mudou; sincronização cancelada.');
        const local=backup.capture(storage);
        const incoming=existing?backup.parse(JSON.stringify(existing.payload)):null;
        const data=incoming?{...local.data,...backup.preview(storage,incoming)}:local.data;
        const payload=backup.parse(JSON.stringify({...local,data}));
        try{
          const saved=await remote.commit(existing?.revision||0,payload);
          if(!isCurrent())throw Error('A conta mudou durante o envio. Nenhum dado local foi alterado.');
          return {file:backup.parse(JSON.stringify(saved.payload)),localData:local.data,revision:saved.revision,updatedAt:saved.updated_at};
        }catch(error){if(error.code==='40001'&&attempt<2)continue;throw error;}
      }
    }
    return {sync};
  }
  const api={create};if(typeof module!=='undefined'&&module.exports)module.exports=api;else window.CloudSync=api;
})();
