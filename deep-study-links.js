/* Ponte entre o leitor bíblico e os estudos de aprofundamento. */
(() => {
  window.addEventListener('discipulo-open-deep-study',event=>{
    const id=event.detail?.id;
    if(typeof id!=='string')return;
    document.querySelector('[data-view="aprofundar"]')?.click();
    document.querySelector('#deep-back')?.click();
    document.querySelector(`[data-deep-study="${id}"]`)?.click();
  });
})();
