/* Indicador de envio; não presume que outros aparelhos deixaram de alterar o save. */
(() => {
  function canonical(value){if(Array.isArray(value))return value.map(canonical);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])]));return value;}
  function fingerprint(data){
    const structured=['discipulo-v1','discipulo-topics-v1','discipulo-achievements-v1','discipulo-people-notes-v1'];
    const normalized=Object.fromEntries(Object.keys(data).sort().map(k=>{let value=data[k];if(structured.includes(k))try{value=JSON.parse(value);}catch{}return [k,value];}));
    const text=JSON.stringify(canonical(normalized));let a=2166136261,b=5381;
    for(let i=0;i<text.length;i++){const n=text.charCodeAt(i);a=Math.imul(a^n,16777619);b=Math.imul(b,33)^n;}
    return text.length+':'+(a>>>0).toString(16)+':'+(b>>>0).toString(16);
  }
  function describe(s){
    if(s.localFailure)return {kind:'error',label:'Verifique o salvamento local',help:'Não foi possível conferir os dados deste navegador. Guarde um backup antes de sair.'};
    if(!s.user)return {kind:'local',label:'Modo local',help:'Entre em uma conta para enviar este progresso à nuvem.'};
    if(s.owner&&s.owner!==s.user)return {kind:'error',label:'Conta diferente do progresso local',help:'O envio está bloqueado para não misturar contas.'};
    if(s.working)return {kind:'working',label:'Sincronizando…',help:'Aguardando confirmação do servidor.'};
    if(!s.online)return {kind:'pending',label:'Sem conexão · modo local',help:'A nuvem não está disponível. Ao reconectar, envie as alterações ou use o envio automático.'};
    if(s.error)return {kind:'error',label:'Envio não confirmado',help:s.error};
    if(!s.meta?.fingerprint)return {kind:'pending',label:'Aguardando primeiro envio confirmado',help:'Use “Sincronizar agora” para confirmar e registrar o save na nuvem.'};
    if(s.current!==s.meta.fingerprint)return {kind:'pending',label:'Alterações aguardando envio',help:'Há mudanças locais desde o último envio confirmado.'};
    if(s.meta.hasRemoteChanges)return {kind:'receive',label:'Envio confirmado · há dados para receber',help:'Use “Sincronizar agora” para aplicar neste aparelho os dados encontrados na nuvem.'};
    return {kind:'saved',label:'Envio à nuvem confirmado',help:'Estas alterações locais foram enviadas. Para buscar alterações de outro aparelho, use “Sincronizar agora”.'};
  }
  const api={fingerprint,describe};if(typeof module!=='undefined'&&module.exports)module.exports=api;else window.CloudStatus=api;
})();
