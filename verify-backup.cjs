const assert=require('node:assert/strict'),backup=require('./backup-engine.js');
class Storage{constructor(entries=[]){this.data=new Map(entries);}get length(){return this.data.size;}key(i){return [...this.data.keys()][i];}getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,v);}removeItem(k){this.data.delete(k);}}
const journey=completed=>JSON.stringify({schemaVersion:5,completed,notes:{0:'Minha reflexão'}});
const source=new Storage([['discipulo-v1',journey([0,1])],['outro-projeto','não exportar'],['discipulo-online-bible-version','1840'],['discipulo-people-notes-v1',JSON.stringify({schemaVersion:1,notes:{abraao:'Uma descoberta'}})]]);
const file=backup.parse(JSON.stringify(backup.capture(source)));assert(!('outro-projeto'in file.data));assert.equal(backup.summary(file.data).journey,2);
const target=new Storage([['discipulo-v1',JSON.stringify({schemaVersion:5,completed:[0,2],notes:{0:'Outra reflexão',2:'Preservar'}})],['discipulo-online-bible-version','1608'],['outro-projeto','intacto']]);
const plan=backup.preview(target,file);assert.equal(backup.summary(plan).journey,3);assert.equal(target.getItem('discipulo-online-bible-version'),'1608');
backup.apply(target,plan);const merged=JSON.parse(target.getItem('discipulo-v1'));assert.deepEqual(merged.completed,[0,1,2]);assert(merged.notes[0].includes('Minha reflexão'));assert(merged.notes[0].includes('Outra reflexão'));assert.equal(merged.notes[2],'Preservar');assert.equal(target.getItem('outro-projeto'),'intacto');
const first=target.getItem('discipulo-v1');backup.apply(target,backup.preview(target,file));assert.equal(target.getItem('discipulo-v1'),first);
assert.throws(()=>backup.parse('{"app":"discipulo-de-jesus","formatVersion":1,"data":{"__proto__":"x"}}'));
assert.throws(()=>backup.parse(JSON.stringify({...file,data:{'outro-projeto':'x'}})));
assert.throws(()=>backup.parse(JSON.stringify({...file,data:{'discipulo-v1':JSON.stringify({schemaVersion:99,completed:[],notes:{}})}})));
assert.throws(()=>backup.parse('não é JSON'));assert.throws(()=>backup.parse('a'.repeat(5000001)));
const fail=new Storage([['discipulo-v1',journey([0])]]);const before=[...fail.data];const set=fail.setItem.bind(fail);let once=true;fail.setItem=(k,v)=>{if(k==='discipulo-online-bible-version'&&once){once=false;throw Error('Quota');}set(k,v);};assert.throws(()=>backup.apply(fail,plan));assert.deepEqual([...fail.data],before);
console.log('OK: exportação restrita ao jogo, validação, prévia, união sem perdas ou duplicação, preferências preservadas e reversão após falha.');
