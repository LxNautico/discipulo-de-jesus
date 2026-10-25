const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{execFileSync}=require('node:child_process'),{pathToFileURL}=require('node:url'),assert=require('node:assert/strict');
const root=path.join(__dirname,'piloto-pdf'),smoke=path.join(root,'review-smoke.html');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'discipulo-review-'));
const test=`<script>
try{
 const $=id=>document.getElementById(id),check=(v,m)=>{if(!v)throw Error(m)};
 check($('item').options.length===78,'fila inicial');
 const first=$('heading').textContent;
 $('confirm').click();check($('counter').textContent.startsWith('1 de 78'),'confirmação');
 $('status').value='checked';$('status').dispatchEvent(new Event('change'));check($('item').options.length===1,'filtro conferidos');check($('heading').textContent===first,'item preservado');
 $('text').value+=' teste';$('text').dispatchEvent(new Event('input'));check($('counter').textContent.startsWith('0 de 78'),'edição volta a pendente');
 $('confirm').click();$('status').value='corrected';$('status').dispatchEvent(new Event('change'));check($('item').options.length===1,'correção registrada');
 const saved=Object.keys(localStorage).filter(k=>k.startsWith('discipulo-genesis-review-v1:'));check(saved.length===1,'salvamento local');
 const state=JSON.parse(localStorage.getItem(saved[0]));check(Object.values(state.entries)[0].status==='corrected','estado persistido');
 $('pending').click();check($('work').hidden,'filtro vazio');
 $('status').value='pending';$('status').dispatchEvent(new Event('change'));check($('item').options.length===78,'retorno à fila');
 window.addEventListener('load',()=>{const pre=document.createElement('pre');pre.id='browser-result';pre.textContent=$('source').complete&&$('source').naturalWidth>0?'BROWSER_OK':'BROWSER_IMAGE_FAILED';document.body.append(pre)});
}catch(error){const pre=document.createElement('pre');pre.id='browser-result';pre.textContent='BROWSER_FAILED: '+error.message;document.body.append(pre);}
</script>`;
try{
 fs.writeFileSync(smoke,fs.readFileSync(path.join(root,'revisao-genesis.html'),'utf8').replace('</html>',test+'</html>'));
 const output=execFileSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless','--disable-gpu','--no-first-run','--no-default-browser-check','--user-data-dir='+profile,'--allow-file-access-from-files','--dump-dom',pathToFileURL(smoke).href],{encoding:'utf8',windowsHide:true,timeout:30000,maxBuffer:20*1024*1024,stdio:['ignore','pipe','pipe']});
 const result=output.match(/<pre id="browser-result">([^<]+)<\/pre>/)?.[1];assert.equal(result,'BROWSER_OK');
 console.log('OK Chrome: fila, imagem offline, filtros, confirmação, correção, rascunho e armazenamento local.');
}finally{if(fs.existsSync(smoke))fs.unlinkSync(smoke);}
