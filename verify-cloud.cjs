const assert=require('node:assert/strict'),backup=require('./backup-engine.js'),core=require('./cloud-sync.js').create(backup);
class Storage{constructor(data){this.data=new Map(Object.entries(data));}get length(){return this.data.size;}key(i){return [...this.data.keys()][i];}getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,v);}removeItem(k){this.data.delete(k);}}
const journey=(completed,note)=>JSON.stringify({schemaVersion:5,completed,notes:{0:note}});
const file=(completed,note)=>({app:'discipulo-de-jesus',formatVersion:1,exportedAt:new Date().toISOString(),data:{'discipulo-v1':journey(completed,note)}});
const clone=value=>JSON.parse(JSON.stringify(value));
(async()=>{
  const local=new Storage({'discipulo-v1':journey([0],'Local')});const before=local.getItem('discipulo-v1');
  let row={revision:1,payload:file([1],'Remota'),updated_at:new Date().toISOString()},writes=0;
  const remote={read:async()=>clone(row),commit:async(revision,payload)=>{assert.equal(revision,row.revision);writes++;if(writes===1){row={...row,revision:2,payload:file([1,2],'Remota concorrente')};throw Object.assign(Error('Conflito'),{code:'40001'});}row={revision:revision+1,payload,updated_at:new Date().toISOString()};return clone(row);}};
  const result=await core.sync(local,remote);assert.equal(writes,2);assert.equal(result.revision,3);
  const data=JSON.parse(result.file.data['discipulo-v1']);assert.deepEqual(data.completed,[0,1,2]);assert(data.notes[0].includes('Local'));assert(data.notes[0].includes('Remota concorrente'));assert.equal(local.getItem('discipulo-v1'),before);
  backup.apply(local,backup.preview(local,result.file));const once=local.getItem('discipulo-v1');
  const again=await core.sync(local,{read:async()=>clone(row),commit:async(revision,payload)=>({...row,revision:revision+1,payload})});backup.apply(local,backup.preview(local,again.file));assert.equal(local.getItem('discipulo-v1'),once);
  let commits=0;
  await assert.rejects(()=>core.sync(local,{read:async()=>null,commit:async()=>{commits++;}},()=>false),/conta mudou/);assert.equal(commits,0);
  const snapshot=local.getItem('discipulo-v1');await assert.rejects(()=>core.sync(local,{read:async()=>{throw Error('Sem rede');}}),/Sem rede/);assert.equal(local.getItem('discipulo-v1'),snapshot);
  await assert.rejects(()=>core.sync(local,{read:async()=>({revision:1,payload:{}}),commit:async()=>{commits++;}}),/compatível/);assert.equal(commits,0);
  let tries=0;await assert.rejects(()=>core.sync(local,{read:async()=>clone(row),commit:async()=>{tries++;throw Object.assign(Error('Conflito'),{code:'40001'});}}),/Conflito/);assert.equal(tries,3);
  const live=new Storage({'discipulo-v1':journey([0],'Antes do envio')});
  const inFlight=await core.sync(live,{read:async()=>null,commit:async(revision,payload)=>{live.setItem('discipulo-v1',journey([0],'Editada durante o envio'));return {revision:1,payload,updated_at:new Date().toISOString()};}});
  const status=require('./cloud-status.js');
  assert.notEqual(status.fingerprint(inFlight.localData),status.fingerprint(backup.capture(live).data));
  assert.equal(status.describe({user:'u',owner:'u',online:true,current:status.fingerprint(backup.capture(live).data),meta:{fingerprint:status.fingerprint(inFlight.localData)}}).kind,'pending');
  console.log('OK: união de saves, conflitos, notas sem duplicação, troca de conta, falhas e edição durante o envio permanece pendente.');
})().catch(error=>{console.error(error);process.exitCode=1;});
