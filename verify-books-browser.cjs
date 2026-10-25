const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{execFileSync}=require('node:child_process'),{pathToFileURL}=require('node:url'),assert=require('node:assert/strict');
const smoke=path.join(__dirname,'books-browser-smoke.html'),profile=fs.mkdtempSync(path.join(os.tmpdir(),'discipulo-books-'));
const test=`<script>(async()=>{try{
 const check=(v,m)=>{if(!v)throw Error(m)},$=id=>document.getElementById(id),event=()=>new Event('change');
 document.querySelector('[data-view="livros"]').click();check(document.querySelectorAll('[data-book-guide]').length===66,'66 cartões');
 $('books-testament').value='NT';$('books-testament').dispatchEvent(event());check(document.querySelectorAll('[data-book-guide]').length===27,'filtro NT');
 $('books-clear').click();$('books-query').value='genesis';$('books-query').dispatchEvent(new Event('input'));check(document.querySelectorAll('[data-book-guide]').length===1,'busca sem acento');
 document.querySelector('[data-book-guide]').click();check($('book-title').textContent==='Gênesis','ficha Gênesis');
 $('books-back').click();check($('books-query').value==='genesis','busca preservada ao voltar');
 $('books-clear').click();$('books-query').value='nenhum-livro';$('books-query').dispatchEvent(new Event('input'));check(document.querySelectorAll('[data-book-guide]').length===0,'busca vazia');$('books-clear').click();
 const keysBefore=Object.keys(localStorage).sort().join();
 for(const book of BOOK_GUIDE.books){
  document.querySelector('[data-book-guide="'+book.id+'"]').click();check($('book-title').textContent===book.name,'ficha '+book.id);
  check(document.querySelectorAll('.book-outline li').length===book.outline.length,'estrutura '+book.id);
  $('book-passage').click();const selectors=$('book-reader').querySelectorAll('select');check(selectors[0].value==='1608','ARA '+book.id);check(selectors[1].value===book.id,'livro '+book.id);check(Number(selectors[2].value)===book.reading.chapter,'capítulo '+book.id);
  const section=document.querySelector('[data-book-part="0"]');section.click();check(Number($('book-reader').querySelectorAll('select')[2].value)===book.outline[0].chapter,'atalho de estrutura '+book.id);
  $('books-back').click();
 }
 check(Object.keys(localStorage).sort().join()===keysBefore,'consulta sem criar saves ou XP');
 document.querySelector('[data-book-guide="GEN"]').click();$('book-start').click();$('book-reader').querySelector('.primary').click();check(document.querySelector('dialog.ara-local-dialog[open]'),'leitor ARA local');document.querySelector('dialog.ara-local-dialog').close();
 check(document.querySelector('main').scrollWidth<=window.innerWidth,'largura responsiva');
 const pre=document.createElement('pre');pre.id='browser-result';pre.textContent='BROWSER_OK';document.body.append(pre);
}catch(e){const pre=document.createElement('pre');pre.id='browser-result';pre.textContent='FAILED '+e.message;document.body.append(pre);}})();</script>`;
try{
 const html=fs.readFileSync(path.join(__dirname,'Discipulo-de-Jesus-offline.html'),'utf8');fs.writeFileSync(smoke,html.replace('</body>',test+'</body>'));
 const output=execFileSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless','--disable-gpu','--no-first-run','--no-default-browser-check','--window-size=390,844','--virtual-time-budget=3000','--user-data-dir='+profile,'--dump-dom',pathToFileURL(smoke).href],{encoding:'utf8',windowsHide:true,timeout:30000,maxBuffer:10*1024*1024,stdio:['ignore','pipe','pipe']});
 assert.equal(output.match(/<pre id="browser-result">([^<]+)<\/pre>/)?.[1],'BROWSER_OK');console.log('OK Chrome: 66 fichas, busca, filtros, retorno, leitura, roteiros e largura de celular; sem criar progresso.');
}finally{if(fs.existsSync(smoke))fs.unlinkSync(smoke);}
