/* Retorno de e-mail: nunca enviar file:// ou tokens da página ao Supabase. */
(() => {
  function resolve(href,configured=''){
    for(const value of [configured,href]){
      if(!value)continue;
      try{const url=new URL(value);if(!['http:','https:'].includes(url.protocol)||url.username||url.password)continue;url.search='';url.hash='';return url.href;}catch{}
    }
    return null;
  }
  const api={resolve};if(typeof module!=='undefined'&&module.exports)module.exports=api;else window.GameAuthRedirect=api;
})();
