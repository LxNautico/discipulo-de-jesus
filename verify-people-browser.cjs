const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{execFileSync}=require('node:child_process'),{pathToFileURL}=require('node:url'),assert=require('node:assert/strict');
const smoke=path.join(__dirname,'people-browser-smoke.html'),profile=fs.mkdtempSync(path.join(os.tmpdir(),'discipulo-pessoas-'));
const test=`<script>try{
  const check=(v,m)=>{if(!v)throw Error(m)},$=id=>document.getElementById(id);
  document.querySelector('[data-view="pessoas"]').click();
  check(document.querySelectorAll('[data-open-profile]').length===8,'oito perfis');
  const names={moises:'Moisés',davi:'Davi',paulo:'Paulo',ester:'Ester',jesus:'Jesus',maria:'Maria',priscila:'Priscila'};
  for(const id of Object.keys(names)){
    document.querySelector('[data-open-profile="'+id+'"]').click();
    check(document.querySelector('h1').textContent===names[id],'perfil '+id);
    check(document.querySelectorAll('.person-event').length>=4,'eventos '+id);
    check(document.querySelectorAll('[data-profile-study]').length>0,'estudos '+id);
    $('people-back').click();
  }
  const search=$('profile-search');search.value='Hadassa';search.dispatchEvent(new Event('input'));
  check(document.querySelectorAll('[data-open-profile]').length===1,'alias Ester');
  const pre=document.createElement('pre');pre.id='browser-result';pre.textContent='BROWSER_OK';document.body.append(pre);
}catch(error){const pre=document.createElement('pre');pre.id='browser-result';pre.textContent='FAILED '+error.message;document.body.append(pre);}</script>`;
try{
  const html=fs.readFileSync(path.join(__dirname,'Discipulo-de-Jesus-offline.html'),'utf8');
  fs.writeFileSync(smoke,html.replace('</body>',test+'</body>'));
  const output=execFileSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless','--disable-gpu','--no-first-run','--no-default-browser-check','--window-size=390,844','--virtual-time-budget=3000','--user-data-dir='+profile,'--dump-dom',pathToFileURL(smoke).href],{encoding:'utf8',windowsHide:true,timeout:30000,maxBuffer:10*1024*1024,stdio:['ignore','pipe','pipe']});
  assert.equal(output.match(/<pre id="browser-result">([^<]+)<\/pre>/)?.[1],'BROWSER_OK');
  console.log('OK Chrome: oito perfis, eventos, estudos relacionados, aliases e tela de celular.');
}finally{if(fs.existsSync(smoke))fs.unlinkSync(smoke);}
