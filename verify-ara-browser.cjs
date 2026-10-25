const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{execFileSync}=require('node:child_process'),{pathToFileURL}=require('node:url'),assert=require('node:assert/strict');
const smoke=path.join(__dirname,'ara-browser-smoke.html'),profile=fs.mkdtempSync(path.join(os.tmpdir(),'discipulo-ara-'));
const sources=['bible-catalog.js','bible-versions.js','ara-data.js','ara-reader.js'].map(f=>'<script>'+fs.readFileSync(path.join(__dirname,f),'utf8').replace(/<\/script/gi,'<\\/script')+'</script>').join('');
const test=`<script>
(async()=>{try{
 const check=(v,m)=>{if(!v)throw Error(m)},host=document.getElementById('host');
 Object.defineProperty(navigator,'onLine',{value:false,configurable:true});
 localStorage.setItem('discipulo-online-bible-version','1840');createBibleReader(host);
 const select=host.querySelectorAll('select'),open=host.querySelector('.primary');
 check(select[0].value==='1608','ARA inicial mesmo com preferência online anterior');
 open.click();let dialog=document.querySelector('dialog');check(dialog?.open,'leitura local offline');check(dialog.querySelectorAll('p').length===31,'31 versículos');check(dialog.textContent.includes('No princípio, criou Deus'),'texto ARA');
 dialog.querySelector('.close').click();await new Promise(r=>setTimeout(r,100));check(!document.querySelector('dialog'),'fechamento');
 select[2].value='50';select[2].dispatchEvent(new Event('change'));open.click();dialog=document.querySelector('dialog');check(dialog.querySelectorAll('p').length===26,'capítulo 50');dialog.close();await new Promise(r=>setTimeout(r,100));
 select[1].value='EXO';select[1].dispatchEvent(new Event('change'));open.click();check(!document.querySelector('dialog[open]'),'outro livro não usa Gênesis como substituto');check(host.textContent.includes('sem conexão'),'aviso offline');
 select[1].value='GEN';select[1].dispatchEvent(new Event('change'));select[0].value='1840';select[0].dispatchEvent(new Event('change'));check(host.querySelector('a').href.includes('/1840/GEN.1'),'outra versão online');
 check(!document.querySelector('iframe'),'nenhuma requisição de texto externo no teste');
 const pre=document.createElement('pre');pre.id='browser-result';pre.textContent='BROWSER_OK';document.body.append(pre);
}catch(e){const pre=document.createElement('pre');pre.id='browser-result';pre.textContent='FAILED '+e.message;document.body.append(pre);}})();
</script>`;
try{
 fs.writeFileSync(smoke,'<!doctype html><meta charset="utf-8"><div id="host"></div>'+sources+test);
 const output=execFileSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless','--disable-gpu','--no-first-run','--no-default-browser-check','--virtual-time-budget=3000','--user-data-dir='+profile,'--dump-dom',pathToFileURL(smoke).href],{encoding:'utf8',windowsHide:true,timeout:30000,maxBuffer:5*1024*1024,stdio:['ignore','pipe','pipe']});
 assert.equal(output.match(/<pre id="browser-result">([^<]+)<\/pre>/)?.[1],'BROWSER_OK');
 console.log('OK Chrome: ARA padrão, Gênesis offline, 31/26 versículos, fechamento, limites locais e outras versões online.');
}finally{if(fs.existsSync(smoke))fs.unlinkSync(smoke);}
