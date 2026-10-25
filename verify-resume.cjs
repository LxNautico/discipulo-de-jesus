const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),backup=require('./backup-engine.js');
const source=fs.readFileSync(__dirname+'/app.js','utf8').split('const app=document.querySelector')[0];
function load(saved){const ctx=vm.createContext({localStorage:{getItem:()=>JSON.stringify(saved),setItem(){}}});vm.runInContext(source,ctx);return JSON.parse(vm.runInContext('JSON.stringify(state)',ctx));}
const initial={schemaVersion:5,completed:[0],notes:{3:'Anotação preservada'},resume:{lesson:3,updatedAt:'2026-10-16T12:00:00Z'}};
assert.deepEqual(load(initial).resume,initial.resume);assert.equal(load(initial).notes[3],initial.notes[3]);
assert.equal(load({...initial,completed:[0,3]}).resume,undefined);
for(const resume of [{lesson:99,updatedAt:initial.resume.updatedAt},{lesson:3,updatedAt:'inválido'},{lesson:-1,updatedAt:initial.resume.updatedAt}])assert.equal(load({...initial,resume}).resume,undefined);
const storage=record=>({getItem:()=>JSON.stringify(record)});
const file=record=>backup.parse(JSON.stringify({app:'discipulo-de-jesus',formatVersion:1,data:{'discipulo-v1':JSON.stringify(record)}}));
const newer={...initial,resume:{lesson:5,updatedAt:'2026-10-16T13:00:00Z'}};
assert.equal(JSON.parse(backup.preview(storage(initial),file(newer))['discipulo-v1']).resume.lesson,5);
assert.equal(JSON.parse(backup.preview(storage(newer),file(initial))['discipulo-v1']).resume.lesson,5);
const completed={...newer,completed:[0,3,5]};assert.equal(JSON.parse(backup.preview(storage(initial),file(completed))['discipulo-v1']).resume,undefined);
assert.throws(()=>file({...initial,resume:{lesson:50,updatedAt:initial.resume.updatedAt}}));
console.log('OK: retomada válida, saves antigos, conclusão, data mais recente e sincronização sem perda de notas.');
