const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{execFileSync}=require('node:child_process'),{pathToFileURL}=require('node:url'),assert=require('node:assert/strict');
const smoke=path.join(__dirname,'theologians-browser-smoke.html'),profile=fs.mkdtempSync(path.join(os.tmpdir(),'discipulo-theologians-'));
const test=`<script>try{
 const check=(v,m)=>{if(!v)throw Error(m)},$=id=>document.getElementById(id),change=()=>new Event('change');
 document.querySelector('[data-view="teologos"]').click();check(document.querySelectorAll('[data-theologian]').length===18,'18 cartões');
 const storageBefore=Object.keys(localStorage).sort().join();
 $('theologian-query').value='arminio';$('theologian-query').dispatchEvent(new Event('input'));check(document.querySelectorAll('[data-theologian]').length===1,'busca sem acento');
 document.querySelector('[data-theologian]').click();check($('theologian-title').textContent==='Jacó Armínio','perfil');check(document.activeElement===$('theologian-title'),'foco');$('theologians-back').click();check($('theologian-query').value==='arminio','busca preservada');
 $('theologian-clear').click();$('theologian-tradition').value='Arminiana / Wesleyana';$('theologian-tradition').dispatchEvent(change());check(document.querySelectorAll('[data-theologian]').length===2,'filtro tradição');
 $('theologian-clear').click();$('theologian-era').value='Idade Média';$('theologian-era').dispatchEvent(change());check(document.querySelectorAll('[data-theologian]').length===2,'filtro época');
 $('theologian-clear').click();$('theologian-query').value='Confissoes';$('theologian-query').dispatchEvent(new Event('input'));check(document.querySelectorAll('[data-theologian]').length===1,'busca por obra');
 $('theologian-query').value='nenhum-autor';$('theologian-query').dispatchEvent(new Event('input'));check(document.querySelectorAll('[data-theologian]').length===0,'vazio');$('theologian-clear').click();
 $('theologian-order').value='name';$('theologian-order').dispatchEvent(change());check(document.querySelector('[data-theologian]').dataset.theologian==='kuyper','ordem alfabética');$('theologian-clear').click();check(document.querySelector('[data-theologian]').dataset.theologian==='atanasio','ordem histórica');
 for(const p of THEOLOGIAN_GUIDE.profiles){
  document.querySelector('[data-theologian="'+p.id+'"]').click();check($('theologian-title').textContent===p.name,'perfil '+p.id);check(document.querySelectorAll('.theologian-works li').length===p.works.length,'obras '+p.id);
  document.querySelector('[data-theologian-reading="0"]').click();const selects=$('theologian-reader').querySelectorAll('select');check(selects[0].value==='1608','ARA '+p.id);check(selects[1].value===p.readings[0][0],'livro '+p.id);check(Number(selects[2].value)===p.readings[0][1],'capítulo '+p.id);$('theologians-back').click();
 }
 document.querySelector('[data-theologian="calvino"]').click();$('theologian-compare').click();check(app.textContent.includes('Perspectiva arminiana clássica'),'comparação');document.querySelector('[data-view="teologos"]').click();check($('theologian-title').textContent==='João Calvino','retorno');
 const related=document.querySelector('[data-related-theologian]');const next=THEOLOGIAN_GUIDE.profiles.find(p=>p.id===related.dataset.relatedTheologian);related.click();check($('theologian-title').textContent===next.name,'relacionados');
 check(Object.keys(localStorage).sort().join()===storageBefore,'sem novo progresso');check(document.querySelector('main').scrollWidth<=window.innerWidth,'layout celular');
 const pre=document.createElement('pre');pre.id='browser-result';pre.textContent='BROWSER_OK';document.body.append(pre);
}catch(error){const pre=document.createElement('pre');pre.id='browser-result';pre.textContent='FAILED '+error.message;document.body.append(pre);}</script>`;
try{
 const html=fs.readFileSync(path.join(__dirname,'Discipulo-de-Jesus-offline.html'),'utf8');fs.writeFileSync(smoke,html.replace('</body>',test+'</body>'));
 const output=execFileSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless','--disable-gpu','--no-first-run','--no-default-browser-check','--window-size=390,844','--virtual-time-budget=3000','--user-data-dir='+profile,'--dump-dom',pathToFileURL(smoke).href],{encoding:'utf8',windowsHide:true,timeout:30000,maxBuffer:10*1024*1024,stdio:['ignore','pipe','pipe']});
 assert.equal(output.match(/<pre id="browser-result">([^<]+)<\/pre>/)?.[1],'BROWSER_OK');console.log('OK Chrome: 18 perfis, obras, busca, filtros, ordenação, retorno, relacionados, comparação e leitor ARA; largura de celular.');
}finally{if(fs.existsSync(smoke))fs.unlinkSync(smoke);}
