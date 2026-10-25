(() => {
  const backup=window.GameBackup;let pending=null;
  const button=document.createElement('button');button.dataset.view='backup';button.textContent='⇄   Meu progresso';document.querySelector('nav').append(button);
  const originalRender=render;render=function(){originalRender();if(view==='backup')show();};
  const describe=s=>`${s.journey} estudos · ${s.topics} etapas temáticas · ${s.discipleship||0} etapas de discipulado · ${s.deepStudies||0} aprofundamentos · ${s.badges} emblemas · ${s.notes} anotações`;
  function show(){
    pending=null;
    app.innerHTML=intro('GUARDE SUA JORNADA','Meu progresso','Faça uma cópia dos dados salvos ou traga seu progresso de outro aparelho.')+'<section class="card"><h2>Salvar uma cópia</h2><p id="backup-summary"></p><p>O arquivo inclui conclusões, anotações, emblemas e a versão bíblica preferida. Ele não contém os textos completos da Bíblia.</p><button class="primary" id="export-progress">Baixar meu backup</button></section><section class="card" style="margin-top:20px"><h2>Importar de outro aparelho</h2><p>Escolha um backup JSON do jogo. Você poderá conferir a prévia antes de aplicar.</p><label for="import-progress">Arquivo de backup</label><input id="import-progress" type="file" accept=".json,application/json"><div id="backup-preview" aria-live="polite"></div></section><p class="notice">A importação soma conclusões sem duplicá-las. Se duas reflexões forem diferentes, ambas são preservadas na mesma anotação. Sua versão bíblica atual é mantida. Não há sincronização automática: transfira o arquivo entre os aparelhos. O backup contém suas anotações pessoais; guarde-o em um lugar de sua confiança.</p><p id="backup-status" role="status"></p>';
    const status=document.querySelector('#backup-status');
    try{document.querySelector('#backup-summary').textContent=describe(backup.summary(backup.capture(localStorage).data));}catch{document.querySelector('#backup-summary').textContent='Não foi possível ler todos os dados salvos. Nenhum dado foi alterado.';}
    document.querySelector('#export-progress').onclick=()=>{
      try{const file=backup.capture(localStorage);download(file);status.textContent='Backup preparado para download. Confira a pasta Downloads do seu aparelho.';}catch(error){status.textContent='Não foi possível exportar: '+error.message;}
    };
    document.querySelector('#import-progress').onchange=async e=>{
      pending=null;const preview=document.querySelector('#backup-preview');preview.replaceChildren();const file=e.target.files[0];if(!file)return;
      try{
        if(file.size>5000000)throw Error('O arquivo deve ter até 5 MB.');
        const imported=backup.parse(await file.text());pending=imported;
        const title=document.createElement('h3');title.textContent='Prévia da importação';
        const incoming=document.createElement('p');incoming.textContent='No arquivo: '+describe(backup.summary(imported.data));
        const combined=document.createElement('p');combined.textContent='Após unir com os dados atuais: '+describe(backup.summary({...backup.capture(localStorage).data,...backup.preview(localStorage,imported)}));
        const apply=document.createElement('button');apply.className='primary';apply.textContent='Confirmar importação e recarregar';
        const cancel=document.createElement('button');cancel.className='secondary';cancel.textContent='Cancelar';cancel.onclick=()=>{pending=null;preview.replaceChildren();e.target.value='';};
        preview.append(title,incoming,combined,apply,cancel);
        apply.onclick=()=>{if(!pending)return;try{const plan=backup.preview(localStorage,pending);backup.apply(localStorage,plan);pending=null;window.location.reload();}catch(error){status.textContent=error.message;}};
        status.textContent='Nenhum dado foi alterado. Confira a prévia e confirme para importar.';
      }catch(error){pending=null;preview.replaceChildren();status.textContent='Não foi possível ler o backup: '+error.message;}
    };
  }
  function download(file){const blob=new Blob([JSON.stringify(file,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='discipulo-progresso-'+new Date().toLocaleDateString('en-CA',{timeZone:'America/Sao_Paulo'})+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
})();
