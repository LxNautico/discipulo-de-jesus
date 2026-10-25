/* Standalone review page; intentionally separate from game and cloud saves. */
(function(){
 'use strict';
 const corpus=JSON.parse(document.getElementById('corpus').textContent),engine=GenesisReview,queue=engine.items(corpus),key='discipulo-genesis-review-v1:'+corpus.sourceSha256;
 const $=id=>document.getElementById(id),version=$('version'),status=$('status'),chooser=$('item');
 let state=engine.empty(corpus.sourceSha256),selected=null,visible=[],storageOK=true;
 function message(text){$('message').textContent=text;}
 try{const raw=localStorage.getItem(key);if(raw){const existing=JSON.parse(raw);existing.entries=Object.fromEntries(Object.entries(existing.entries||{}).filter(([id])=>id.startsWith('ARA:')));state=engine.validate(existing,corpus.sourceSha256,queue);}}catch(error){storageOK=false;message('Não foi possível recuperar a revisão local. Exporte seu trabalho nesta sessão. '+error.message);}
 function persist(next){state=next;try{localStorage.setItem(key,JSON.stringify(state));storageOK=true;return true;}catch{storageOK=false;message('O navegador não gravou a revisão. Exporte uma cópia antes de fechar.');return false;}}
 for(const name of Object.keys(corpus.versions))version.add(new Option(name,name));
 function getStatus(item){return state.entries[item.id]?.status||'pending';}
 function counter(){const checked=queue.filter(i=>getStatus(i)==='checked').length,corrected=queue.filter(i=>getStatus(i)==='corrected').length;$('counter').textContent=`${checked+corrected} de ${queue.length} revisados · ${checked} conferidos · ${corrected} com correção · ${queue.length-checked-corrected} pendentes`;$('progress').max=queue.length;$('progress').value=checked+corrected;}
 function label(item){return `${item.version} · Gênesis ${item.chapter}:${item.verse}`;}
 function refresh(prefer=selected?.id){
  visible=queue.filter(i=>(version.value==='all'||i.version===version.value)&&(status.value==='all'||getStatus(i)===status.value));
  chooser.replaceChildren();for(const item of visible)chooser.add(new Option(label(item),item.id));
  selected=visible.find(i=>i.id===prefer)||visible[0]||null;if(selected)chooser.value=selected.id;counter();render();
 }
 function source(){if(!selected)return;const page=$('page').value,url=`imagens-revisao/${selected.version}-${page}.jpg`;$('image-error').hidden=true;$('source').src=url;$('source').alt=`Coluna ${selected.version}, página física ${page} do PDF. Conferir Gênesis ${selected.chapter}:${selected.verse}.`;$('source-link').href=url;$('pdf-link').href='../multiversoes-original.pdf#page='+page;}
 function render(){
  $('empty').hidden=!!selected;$('work').hidden=!selected;chooser.disabled=!selected;
  const index=visible.indexOf(selected);$('previous').disabled=index<=0;$('next').disabled=index<0||index===visible.length-1;
  if(!selected)return;
  const entry=state.entries[selected.id];$('heading').textContent=label(selected);$('original').textContent=selected.original;$('text').value=entry?.text??selected.original;$('note').value=entry?.note??'';
  $('draft-label').textContent=entry?`${{pending:'Pendente / rascunho',checked:'Conferido sem alteração',corrected:'Correção registrada'}[entry.status]} · ${new Date(entry.updatedAt).toLocaleString('pt-BR')}`:'Ainda não revisado';
  $('warning-lines').replaceChildren();for(const warning of selected.warnings){const li=document.createElement('li');li.textContent=`p. ${warning.page}: ${warning.line}`;$('warning-lines').append(li);}
  $('page').replaceChildren();for(const p of selected.pages)$('page').add(new Option('Página '+p,p));source();
 }
 function draft(){
  if(!selected)return;
  try{persist(engine.save(state,selected,$('text').value,$('note').value,false));counter();$('draft-label').textContent=storageOK?'Rascunho salvo neste navegador · pendente':'Rascunho nesta sessão; exporte para guardar.';}catch(error){message(error.message);}
 }
 $('text').addEventListener('input',draft);$('note').addEventListener('input',draft);
 $('confirm').addEventListener('click',()=>{
  if(!selected)return;const index=visible.indexOf(selected),next=visible[index+1]?.id;
  try{const ok=persist(engine.save(state,selected,$('text').value,$('note').value,true));message(ok?'Revisão salva neste navegador.':'Revisão nesta sessão. Exporte antes de fechar.');refresh(status.value==='pending'?next:selected.id);}catch(error){message(error.message);}
 });
 $('pending').addEventListener('click',()=>{if(!selected)return;try{persist(engine.save(state,selected,$('text').value,$('note').value,false));refresh();}catch(error){message(error.message);}});
 version.addEventListener('change',()=>refresh());status.addEventListener('change',()=>refresh());
 chooser.addEventListener('change',()=>{selected=visible.find(i=>i.id===chooser.value);render();});
 for(const [id,delta] of [['previous',-1],['next',1]])$(id).addEventListener('click',()=>{const item=visible[visible.indexOf(selected)+delta];if(item){selected=item;chooser.value=item.id;render();}});
 $('page').addEventListener('change',source);$('source').addEventListener('error',()=>{$('image-error').hidden=false;});
 $('export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='revisao-genesis-'+new Date().toISOString().slice(0,10)+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Arquivo de revisão preparado para download.');});
 $('import-file').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;
  try{if(file.size>5*1024*1024)throw Error('O arquivo excede 5 MB.');const incoming=engine.validate(JSON.parse(await file.text()),corpus.sourceSha256,queue),merged=engine.merge(state,incoming);const ok=persist(merged.state);refresh();message(`${ok?'Importação salva.':'Importação nesta sessão; exporte para guardar.'} ${merged.conflicts.length} conflitos mantiveram a revisão deste navegador.`);}catch(error){message('Não foi possível importar: '+error.message);}finally{event.target.value='';}
 });
 refresh();
})();
