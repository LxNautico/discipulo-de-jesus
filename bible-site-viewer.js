/* Visualizador compartilhado de leitura e pesquisa do Bible.com. */
(() => {
  window.openBibleWebsite=function(address,label,opener){
    const url=new URL(address);
    if(url.protocol!=='https:'||url.hostname!=='www.bible.com'||url.username||url.password)throw Error('Endereço bíblico inválido.');
    const modal=document.createElement('dialog');modal.className='bible-fullscreen';modal.setAttribute('aria-label',label);
    const toolbar=document.createElement('div');toolbar.className='bible-fullscreen-toolbar';
    const title=document.createElement('strong');title.textContent=label;
    const close=document.createElement('button');close.className='primary';close.textContent='Fechar e voltar ao estudo ×';close.onclick=()=>modal.close();toolbar.append(title,close);
    const frame=document.createElement('iframe');frame.className='youversion-reader';frame.title=label;frame.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups');frame.setAttribute('referrerpolicy','strict-origin-when-cross-origin');frame.src=url.href;
    modal.append(toolbar,frame);document.body.append(modal);
    const previous=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';
    modal.addEventListener('close',()=>{frame.src='about:blank';document.documentElement.style.overflow=previous;modal.remove();opener?.focus();},{once:true});
    modal.showModal();close.focus();
  };
})();
