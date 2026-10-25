/* Leitor online. Catálogo e preferência em bible-versions.js. */
(() => {
  const catalog = window.BIBLE_CATALOG?.books || [];
  window.createBibleReader = function(host, initialBook='GEN', initialChapter=1, range=null) {
    if (!catalog.length) { host.textContent='Não foi possível carregar o catálogo de livros. Recarregue a página.'; return; }
    let book=catalog.find(b=>b.id===initialBook)||catalog[0], chapter=initialChapter;
    const versionCatalog=window.BibleVersions;
    let version=versionCatalog.versions.find(v=>v.short==='ARA');
    const localChapter=()=>version.short==='ARA'?window.BIBLE_ARA?.books.find(b=>b.id===book.id)?.chapters[chapter-1]:null;
    const controls=document.createElement('div');controls.className='bible-controls';
    const versionLabel=document.createElement('label');versionLabel.textContent='Versão da Bíblia';versionLabel.className='reader-version-label';
    const versions=document.createElement('select');versions.setAttribute('aria-label','Versão da Bíblia');
    versionCatalog.versions.forEach(v=>{const o=document.createElement('option');o.value=v.id;o.textContent=`${v.short} — ${v.name}`;versions.append(o);});versionLabel.append(versions);
    const bookLabel=document.createElement('label');bookLabel.textContent='Livro';
    const books=document.createElement('select');books.setAttribute('aria-label','Livro da Bíblia');
    catalog.forEach(b=>{const o=document.createElement('option');o.value=b.id;o.textContent=b.name;books.append(o);});bookLabel.append(books);
    const chapterLabel=document.createElement('label');chapterLabel.textContent='Capítulo';
    const chapters=document.createElement('select');chapters.setAttribute('aria-label','Capítulo da Bíblia');chapterLabel.append(chapters);
    const previous=document.createElement('button');previous.className='secondary';previous.textContent='← Anterior';
    const next=document.createElement('button');next.className='secondary';next.textContent='Próximo →';
    controls.append(versionLabel,bookLabel,chapterLabel,previous,next);
    const heading=document.createElement('h3');
    const description=document.createElement('p');description.className='muted';
    const status=document.createElement('p');status.className='muted';status.setAttribute('role','status');
    const open=document.createElement('button');open.className='primary';open.textContent='Abrir Bíblia em tela inteira';
    const link=document.createElement('a');link.className='secondary youversion-link';link.target='_blank';link.rel='noopener noreferrer';link.textContent='Abrir em outra aba ↗';
    const actions=document.createElement('div');actions.className='bible-controls';actions.append(open,link);
    const deepLink=document.createElement('section');deepLink.className='reader-deep-link';deepLink.hidden=true;
    const matchingStudies=()=> (window.DEEP_STUDIES||[]).filter(study=>study.readings?.some(reading=>reading.book===book.id&&reading.chapter===chapter));
    function paint(){
      chapter=Math.max(1,Math.min(chapter,book.numberOfChapters));books.value=book.id;
      chapters.replaceChildren();Array.from({length:book.numberOfChapters}).forEach((_,i)=>{const o=document.createElement('option');o.value=i+1;o.textContent=i+1;chapters.append(o);});chapters.value=chapter;
      versions.value=version.id;
      heading.textContent=`${book.name} ${chapter} · ${version.short}`;
      const local=localChapter();
      description.textContent=local?'ARA · Gênesis disponível no jogo, inclusive sem internet. Outros livros e traduções abrem no Bible.com.':`${version.name} · ${version.provider}. Requer internet. ${range?'Leia o trecho indicado e feche o leitor para continuar o estudo. ':''}O site externo pode usar cookies.`;
      open.textContent=local?'Ler ARA em tela inteira':'Abrir Bíblia em tela inteira';
      link.textContent='Abrir no Bible.com ↗';
      link.href=versionCatalog.passageUrl(version,book.id,chapter);
      previous.disabled=book===catalog[0]&&chapter===1;next.disabled=book===catalog[catalog.length-1]&&chapter===book.numberOfChapters;
      const studies=matchingStudies();deepLink.hidden=!studies.length;deepLink.replaceChildren();if(studies.length){const title=document.createElement('strong');title.textContent=studies.length===1?'Aprofundar este texto':'Aprofundar este texto por mais de uma perspectiva';deepLink.append(title);studies.forEach(study=>{const text=document.createElement('p'),button=document.createElement('button');text.textContent=study.title+' · '+study.subtitle;button.className='secondary';button.textContent='Abrir estudo aprofundado →';button.dataset.deepStudyId=study.id;deepLink.append(text,button);});}
    }
    versions.onchange=()=>{
      const chosen=versionCatalog.versions.find(v=>v.id===versions.value);if(!chosen)return;
      version=chosen;const saved=versionCatalog.select(version.id);paint();
      status.textContent=saved?'Versão preferida salva para as próximas leituras.':'Versão alterada para esta sessão; não foi possível salvar no navegador.';
    };
    books.onchange=()=>{book=catalog.find(b=>b.id===books.value);chapter=1;paint();};chapters.onchange=()=>{chapter=Number(chapters.value);paint();};
    function step(delta){chapter+=delta;if(chapter<1){book=catalog[catalog.indexOf(book)-1];chapter=book.numberOfChapters;}else if(chapter>book.numberOfChapters){book=catalog[catalog.indexOf(book)+1];chapter=1;}paint();}
    previous.onclick=()=>step(-1);next.onclick=()=>step(1);
    open.onclick=()=>{
      const verses=localChapter();
      if(verses){
        const dialog=document.createElement('dialog');dialog.className='word-study-dialog ara-local-dialog';
        const oldOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';
        const close=document.createElement('button');close.className='close';close.textContent='×';close.setAttribute('aria-label','Fechar Bíblia');close.onclick=()=>dialog.close();
        const title=document.createElement('h2');title.textContent=`${book.name} ${chapter} · ARA`;
        dialog.append(close,title);
        verses.forEach(verse=>{const p=document.createElement('p'),number=document.createElement('sup');number.textContent=verse.number+' ';p.append(number,document.createTextNode(verse.text));dialog.append(p);});
        dialog.addEventListener('close',()=>{document.documentElement.style.overflow=oldOverflow;dialog.remove();open.focus();});document.body.append(dialog);dialog.showModal();return;
      }
      if(typeof navigator!=='undefined'&&navigator.onLine===false){description.textContent='Você está sem conexão. Os estudos continuam disponíveis, mas é preciso conectar o celular à internet para ler a Bíblia no Bible.com. A versão escolhida será mantida.';return;}
      window.openBibleWebsite(link.href,`${book.name} ${chapter} · ${version.short} · Bible.com`,open);
    };
    deepLink.onclick=event=>{const id=event.target.closest('[data-deep-study-id]')?.dataset.deepStudyId;if(id)window.dispatchEvent(new CustomEvent('discipulo-open-deep-study',{detail:{id}}));};
    host.append(controls,heading,description,deepLink,actions,status);paint();
  };
})();
