const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Element{constructor(){this.children=[];this.hidden=false;this.dataset={};}append(...nodes){this.children.push(...nodes);}setAttribute(){}set innerHTML(v){this.html=v;this.children=[];}}
const values=new Map(),listeners={},elements=new Map();
const get=s=>{if(!elements.has(s))elements.set(s,new Element());return elements.get(s);};
const body=new Element(),state={completed:[0,1,2,3,4,4],notes:{}};
const ctx=vm.createContext({state,lessons:Array.from({length:20},()=>({})),view:'jornada',save(){return true;},render(){},intro:()=>'',app:new Element(),localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)},document:{body,querySelector:get,createElement:()=>new Element()},window:{TOPIC_TRACKS:[{id:'dinheiro-generosidade',steps:['a','b','c','d','e'].map(id=>({id}))}],addEventListener:(event,fn)=>listeners[event]=fn,scrollTo(){}}});
for(const file of ['achievement-rules.js','achievements.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+file,'utf8'),ctx);
const earned=()=>JSON.parse(values.get('discipulo-achievements-v1')).unlocked;
assert.deepEqual(Object.keys(earned()),['xp-100','xp-500']);
assert(body.children[0].children[0].textContent.includes('Explorador da Palavra'));
const previous=values.get('discipulo-achievements-v1');ctx.render();ctx.render();assert.equal(values.get('discipulo-achievements-v1'),previous);
state.notes[0]='Reflexão salva';ctx.save();assert(earned()['first-reflection']);
values.set('discipulo-topics-v1',JSON.stringify({schemaVersion:1,tracks:{'dinheiro-generosidade':{completed:['a','b','c','d','e','e'],notes:{}}}}));
listeners['discipulo-topic-progress']();assert(earned()['topic-money']);
assert.deepEqual(state.completed,[0,1,2,3,4,4]);
ctx.view='conquistas';ctx.render();assert.equal(get('#badge-grid').children.length,6);
assert(ctx.app.html.includes('500'));
console.log('OK: interface reconhece progresso antigo, acompanha reflexões e trilhas, mostra seis emblemas e não altera o XP. DOM simulado.');
