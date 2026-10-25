const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{execFileSync}=require('node:child_process'),{pathToFileURL}=require('node:url'),assert=require('node:assert/strict');
const smoke=path.join(__dirname,'resume-browser-smoke.html'),profile=fs.mkdtempSync(path.join(os.tmpdir(),'discipulo-resume-'));
const test=`<script>(async()=>{try{
 const check=(value,label)=>{if(!value)throw Error(label)},wait=()=>new Promise(r=>setTimeout(r,100));
 if(!localStorage.getItem('resume-test-phase')){
  openLesson(3);check(state.resume.lesson===3,'estudo em andamento');check(document.getElementById('level').textContent.includes('0 XP'),'abrir não concede XP');
  const note=document.getElementById('note');note.value='Minha reflexão sem apertar salvar';note.dispatchEvent(new Event('input'));
  check(JSON.parse(localStorage.getItem('discipulo-v1')).notes[3]===note.value,'autosave');
  document.getElementById('lesson').close();await wait();
  check(document.querySelector('.hero').textContent.includes('CONTINUE DE ONDE PAROU'),'hero de retomada');
  localStorage.setItem('resume-test-phase','reload');location.reload();return;
 }
 check(state.resume.lesson===3,'retomada após recarregar');
 document.querySelector('.hero [data-lesson]').click();check(document.getElementById('note').value==='Minha reflexão sem apertar salvar','reflexão restaurada');
 document.querySelector('[data-answer="'+lessons[3].correct+'"]').click();check(state.completed.includes(3),'conclusão');check(!state.resume,'retomada limpa após conclusão');
 check(document.getElementById('level').textContent.includes('100 XP'),'XP único');
 document.getElementById('lesson').close();await wait();openLesson(5);document.getElementById('lesson').close();await wait();openLesson(3);
 check(state.resume.lesson===5,'revisão de concluído preserva estudo em andamento');
 const pre=document.createElement('pre');pre.id='browser-result';pre.textContent='BROWSER_OK';document.body.append(pre);
}catch(error){const pre=document.createElement('pre');pre.id='browser-result';pre.textContent='FAILED '+error.message;document.body.append(pre);}})();</script>`;
try{
 const html=fs.readFileSync(path.join(__dirname,'Discipulo-de-Jesus-offline.html'),'utf8');fs.writeFileSync(smoke,html.replace('</body>',test+'</body>'));
 const output=execFileSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless','--disable-gpu','--no-first-run','--no-default-browser-check','--virtual-time-budget=5000','--user-data-dir='+profile,'--dump-dom',pathToFileURL(smoke).href],{encoding:'utf8',windowsHide:true,timeout:30000,maxBuffer:10*1024*1024,stdio:['ignore','pipe','pipe']});
 assert.equal(output.match(/<pre id="browser-result">([^<]+)<\/pre>/)?.[1],'BROWSER_OK');console.log('OK Chrome: retomada após reload, reflexão automática, conclusão, XP e revisão sem substituir estudo pendente.');
}finally{if(fs.existsSync(smoke))fs.unlinkSync(smoke);}
