(() => {
  const config=window.GameCloudConfig,backup=window.GameBackup;
  let client=null,user=null,busy=false,notice='Entre para guardar seu progresso na nuvem.',timer=null,pending=false,emailDraft='';
  const redirectOptions=()=>{const url=window.GameAuthRedirect.resolve(window.location.href,config.authRedirectUrl);return url?{emailRedirectTo:url}:{};};
  try{client=window.supabase.createClient(config.url,config.publishableKey,{auth:{storageKey:'discipulo-auth-v1',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});}catch{notice='Não foi possível iniciar a conexão. O jogo local continua disponível.';}
  const core=window.CloudSync.create(backup),ownerKey='discipulo-cloud-owner',autoKey='discipulo-cloud-auto';
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const get=k=>{try{return localStorage.getItem(k);}catch{return null;}};
  const statusRules=window.CloudStatus;let syncError='';
  const indicator=document.createElement('button');indicator.className='save-indicator';indicator.type='button';indicator.setAttribute('aria-label','Ver estado do save');
  const indicatorText=document.createElement('span');indicatorText.setAttribute('role','status');indicator.append(indicatorText);document.querySelector('main header').append(indicator);
  indicator.onclick=()=>{view='conta';render();window.scrollTo({top:0,behavior:'smooth'});};
  function readMeta(){try{const value=JSON.parse(get('discipulo-cloud-status:'+user?.id));return value&&typeof value.fingerprint==='string'?value:null;}catch{return null;}}
  function dateLabel(value){return value&&Number.isFinite(Date.parse(value))?new Date(value).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'}):'Ainda não registrado neste aparelho';}
  function currentStatus(){let current='',localFailure=false;try{current=statusRules.fingerprint(backup.capture(localStorage).data);}catch{localFailure=true;}const meta=readMeta();const status=statusRules.describe({user:user?.id,owner:get(ownerKey),online:typeof navigator==='undefined'||navigator.onLine,working:busy&&!!user,error:syncError,current,meta,localFailure});return {status,meta};}
  function updateStatus(){
    const {status,meta}=currentStatus();indicator.dataset.state=status.kind;if(indicatorText.textContent!==status.label)indicatorText.textContent=status.label;indicator.title=status.help;
    const panel=document.querySelector('#save-state-detail');if(panel){panel.dataset.state=status.kind;panel.replaceChildren();const title=document.createElement('strong');title.textContent=status.label;const help=document.createElement('p');help.textContent=status.help;const dates=document.createElement('p');dates.className='muted';dates.textContent='Último envio confirmado: '+dateLabel(meta?.lastUploadedAt)+' · Último recebimento aplicado: '+dateLabel(meta?.lastReceivedAt);panel.append(title,help,dates);}
  }
  function recordSuccess(result,manual){const previous=readMeta()||{},meta={fingerprint:statusRules.fingerprint(manual?result.file.data:result.localData),lastUploadedAt:result.updatedAt,lastReceivedAt:manual?result.updatedAt:previous.lastReceivedAt,hasRemoteChanges:!manual&&statusRules.fingerprint(result.localData)!==statusRules.fingerprint(result.file.data)};localStorage.setItem('discipulo-cloud-status:'+user.id,JSON.stringify(meta));}
  const nav=document.querySelector('nav'),button=document.createElement('button');button.dataset.view='conta';button.textContent='☁   Conta e saves';nav.append(button);
  function explain(error){if(['PGRST205','PGRST202','42P01','42883'].includes(error.code))return 'O banco ainda precisa ser preparado. Execute supabase-setup.sql no SQL Editor do seu projeto.';return error.message||'Não foi possível conectar. Seu progresso local foi preservado.';}
  const originalRender=render;render=function(){originalRender();if(view==='conta')show();updateStatus();};
  function repaint(){updateStatus();if(view==='conta')show();}
  function show(){
    const other=user&&get(ownerKey)&&get(ownerKey)!==user.id;
    app.innerHTML=intro('SUA JORNADA ENTRE APARELHOS','Conta e saves','Continue estudando localmente. Use sua conta para guardar e recuperar o progresso no Supabase.')+`<section class="card"><p id="cloud-status" role="status">${esc(notice)}</p>${user?`<p>Conectado como <strong>${esc(user.email||'jogador')}</strong></p>${other?'<p class="notice">O progresso local está vinculado a outra conta. O envio foi bloqueado para não misturar dados. Use a conta original ou outro perfil do navegador.</p>':'<p>Ao sincronizar, seus estudos e anotações deste aparelho serão unidos ao save desta conta. Reflexões diferentes são preservadas. A página será recarregada para aplicar o resultado.</p>'}<button class="primary" id="cloud-sync" ${busy||other?'disabled':''}>${busy?'Sincronizando…':get(ownerKey)?'Sincronizar agora':'Vincular meu progresso e sincronizar'}</button><button class="secondary" id="cloud-signout" ${busy?'disabled':''}>Sair da conta</button><p><label><input type="checkbox" id="cloud-auto" ${get(autoKey)===user.id?'checked':''} ${busy||other?'disabled':''}> Enviar saves automaticamente após alterações e ao reconectar</label></p><p class="muted">Ative após a primeira sincronização. O envio automático guarda alterações na nuvem; use “Sincronizar agora” para receber dados de outro aparelho. Sem internet, os estudos continuam locais.</p>`:`<form id="cloud-login"><label for="cloud-email">E-mail</label><input class="search" id="cloud-email" type="email" autocomplete="email" required><label for="cloud-password">Senha</label><input class="search" id="cloud-password" type="password" autocomplete="current-password" minlength="8" required><div class="bible-controls"><button class="primary" type="submit" ${busy||!client?'disabled':''}>Entrar</button><button class="secondary" id="cloud-signup" type="button" ${busy||!client?'disabled':''}>Criar conta</button></div></form>`}</section><p class="notice">O backup em “Meu progresso” continua disponível. Sair da conta não apaga os dados deste navegador. Em aparelhos compartilhados, use perfis de navegador separados.</p>`;
    const detail=document.createElement('section');detail.id='save-state-detail';detail.className='save-state-detail';detail.setAttribute('aria-live','polite');app.prepend(detail);updateStatus();
    if(user){
      document.querySelector('#cloud-sync').onclick=()=>synchronize(true);
      document.querySelector('#cloud-signout').onclick=async()=>{const {error}=await client.auth.signOut({scope:'local'});if(error){notice=explain(error);repaint();return;}user=null;syncError='';clearTimeout(timer);notice='Você saiu. Os dados locais continuam neste navegador.';repaint();};
      document.querySelector('#cloud-auto').onchange=e=>{
        if(e.target.checked&&get(ownerKey)!==user.id){e.target.checked=false;notice='Faça a primeira sincronização manual para vincular este progresso à sua conta.';repaint();return;}
        try{localStorage.setItem(autoKey,e.target.checked?user.id:'');notice=e.target.checked?'Envio automático ativado.':'Envio automático desativado.';if(e.target.checked)schedule();}catch{notice='Não foi possível salvar a preferência.';}repaint();
      };
    }else{
      const form=document.querySelector('#cloud-login');
      const help=document.createElement('p');help.className='muted';help.textContent='Esta é sua conta de jogador: use seu e-mail e crie uma senha própria para o jogo. Não use a senha do banco nem é necessário ter conta no painel Supabase.';form.prepend(help);
      const email=document.querySelector('#cloud-email');email.value=emailDraft;email.oninput=()=>{emailDraft=email.value;};
      form.onsubmit=e=>{e.preventDefault();authenticate(false);};
      document.querySelector('#cloud-signup').onclick=()=>{if(form.reportValidity())authenticate(true);};
      const resend=document.createElement('button');resend.className='secondary';resend.type='button';resend.textContent='Reenviar confirmação';resend.disabled=busy||!client;form.querySelector('.bible-controls').append(resend);
      resend.onclick=async()=>{
        if(!email.reportValidity())return;emailDraft=email.value.trim();busy=true;form.querySelectorAll('button,input').forEach(i=>i.disabled=true);
        try{const {error}=await client.auth.resend({type:'signup',email:emailDraft,options:redirectOptions()});if(error)throw error;notice='Se houver um cadastro aguardando confirmação, um novo e-mail será enviado. Use o link mais recente. Depois volte ao jogo e entre com sua senha.';}catch(error){notice=explain(error);}finally{busy=false;repaint();}
      };
    }
  }
  async function authenticate(signup){
    if(busy||!client)return;
    const email=document.querySelector('#cloud-email').value.trim(),password=document.querySelector('#cloud-password').value;
    emailDraft=email;
    busy=true;const inputs=app.querySelectorAll('button,input');inputs.forEach(i=>i.disabled=true);
    try{const result=signup?await client.auth.signUp({email,password,options:redirectOptions()}):await client.auth.signInWithPassword({email,password});if(result.error)throw result.error;user=result.data.session?.user||null;notice=user?'Conta conectada. Confirme a sincronização para enviar seus dados.':'Verifique seu e-mail para confirmar o cadastro. Depois volte e entre com sua senha.';}catch(error){notice=explain(error);}finally{busy=false;repaint();}
  }
  async function synchronize(manual){
    if(!client||!user)return;if(busy){pending=true;return;}
    const account=user.id;
    if(get(ownerKey)&&get(ownerKey)!==account){notice='Envio bloqueado: o progresso local pertence a outra conta.';repaint();return;}
    if(typeof navigator!=='undefined'&&!navigator.onLine){notice='Sem conexão. Seu progresso continua salvo neste aparelho.';repaint();return;}
    busy=true;syncError='';notice='Unindo seu progresso com o save da conta…';repaint();
    const remote={
      async read(){const {data,error}=await client.from('discipulo_saves').select('revision,payload,updated_at').eq('user_id',account).maybeSingle();if(error)throw error;return data;},
      async commit(revision,payload){const {data,error}=await client.rpc('sync_discipulo_save',{p_expected_revision:revision,p_payload:payload});if(error)throw error;if(!data?.[0])throw Error('O servidor não confirmou a gravação.');return data[0];}
    };
    try{
      const result=await core.sync(localStorage,remote,()=>user?.id===account);
      localStorage.setItem(ownerKey,account);
      if(manual){backup.apply(localStorage,backup.preview(localStorage,result.file));recordSuccess(result,true);window.location.reload();return;}
      recordSuccess(result,false);
      notice='Alterações enviadas à nuvem. Use “Sincronizar agora” para atualizar este aparelho com o save completo.';
    }catch(error){notice=explain(error);syncError=notice;}finally{busy=false;repaint();if(pending){pending=false;schedule();}}
  }
  function schedule(){updateStatus();if(!user||get(ownerKey)!==user.id||get(autoKey)!==user.id)return;clearTimeout(timer);const {status}=currentStatus();if(['saved','receive'].includes(status.kind))return;timer=setTimeout(()=>synchronize(false),2000);}
  const originalSave=save;save=function(){const result=originalSave();if(result)schedule();return result;};
  window.addEventListener('discipulo-topic-progress',schedule);window.addEventListener('discipulo-local-progress',schedule);window.addEventListener('online',()=>{syncError='';schedule();});window.addEventListener('offline',updateStatus);
  window.addEventListener('storage',event=>{if(event.key?.startsWith('discipulo-')&&!event.key.startsWith('discipulo-auth'))schedule();});
  updateStatus();
  if(client){
    client.auth.onAuthStateChange((_event,session)=>{user=session?.user||null;if(!user)clearTimeout(timer);setTimeout(()=>{repaint();schedule();},0);});
    client.auth.getSession().then(({data,error})=>{if(error)notice=explain(error);user=data?.session?.user||null;if(user)notice='Sua conta está conectada. Os estudos locais estão preservados.';repaint();schedule();}).catch(()=>{notice='Não foi possível recuperar a sessão. Entre novamente quando estiver online.';repaint();});
  }
})();
