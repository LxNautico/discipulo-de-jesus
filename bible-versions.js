/* Catálogo de leitura online. Não equivale aos corpora locais de estatísticas. */
(() => {
  const versions = Object.freeze([
    {id:'1608',short:'ARA',name:'Almeida Revista e Atualizada'},
    {id:'212',short:'ARC',name:'Almeida Revista e Corrigida'},
    {id:'1840',short:'NAA',name:'Nova Almeida Atualizada'},
    {id:'129',short:'NVI',name:'Nova Versão Internacional'},
    {id:'211',short:'NTLH',name:'Nova Tradução na Linguagem de Hoje'}
  ].map(v=>Object.freeze({...v,provider:'Bible.com / YouVersion'})));
  const key='discipulo-online-bible-version';
  let fallback='1608';
  const find=id=>versions.find(v=>v.id===String(id));
  function preferred(){try{return find(localStorage.getItem(key))||find(fallback);}catch{return find(fallback);}}
  function select(id){const version=find(id);if(!version)return false;fallback=version.id;try{localStorage.setItem(key,version.id);}catch{return false;}if(typeof window.dispatchEvent==='function')window.dispatchEvent(new Event('discipulo-local-progress'));return true;}
  function passageUrl(version,book,chapter){
    if(!find(version.id)||!/^\w{3}$/.test(book)||!Number.isInteger(chapter)||chapter<1)throw Error('Referência bíblica inválida');
    return `https://www.bible.com/pt/bible/${version.id}/${book}.${chapter}`;
  }
  function searchUrl(id,query){if(!find(id)||typeof query!=='string'||!query.trim())throw Error('Pesquisa inválida.');const url=new URL('https://www.bible.com/pt/search/bible');url.searchParams.set('query',query.trim());url.searchParams.set('version_id',String(id));return url.href;}
  window.BibleVersions=Object.freeze({versions,preferred,select,passageUrl,searchUrl});
})();
