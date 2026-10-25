(() => {
  const button=document.querySelector('#update-game');
  if(!button)return;
  button.addEventListener('click',()=>{
    const url=new URL(window.location.href);
    url.searchParams.set('atualizacao',String(Date.now()));
    window.location.replace(url.href);
  });
})();
