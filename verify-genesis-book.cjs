const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'piloto-pdf');
const data=JSON.parse(fs.readFileSync(path.join(root,'genesis-completo.json'),'utf8'));
const report=JSON.parse(fs.readFileSync(path.join(root,'validacao-genesis.json'),'utf8'));
assert.equal(report.checks.length,50);assert.ok(report.checks.every(c=>c.ok));assert.deepEqual(report.issues,[]);
assert.equal(report.expectedVersesPerVersion,1533);
const revision=JSON.parse(fs.readFileSync(path.join(root,'revisao-espacamento-genesis.json'),'utf8'));
assert.equal(revision.nonWhitespaceChanges,0);assert.equal(revision.pilotMatches,31);
const baseline=JSON.parse(fs.readFileSync(path.join(root,'genesis-antes-revisao.json'),'utf8'));
const pilot=JSON.parse(fs.readFileSync(path.join(root,'genesis-1.json'),'utf8'));
let changes=0;
for(const [version,chapters] of Object.entries(data.versions))for(const [chapter,verses] of Object.entries(chapters)){
 const old=baseline.versions[version][chapter];assert.equal(verses.length,old.length);
 verses.forEach((verse,i)=>{assert.equal(verse.verse,old[i].verse);assert.equal(verse.text.replace(/\s/g,''),old[i].text.replace(/\s/g,''));if(verse.text!==old[i].text)changes++});
}
assert.equal(changes,revision.changedVerses);
for(const version of Object.keys(data.versions))data.versions[version]['1'].forEach((verse,i)=>assert.equal(verse.text,pilot.versions[version][i].text));
const html=fs.readFileSync(path.join(root,'genesis-completo.html'),'utf8');
assert.ok(!html.includes('__CORPUS__'));assert.ok(!/<script[^>]+src=/.test(html));
class Element{
 constructor(){this.value='';this.children=[];this.events={};this.textContent='';}
 add(option){this.children.push(option);if(!this.value)this.value=String(option.value);}
 append(...nodes){this.children.push(...nodes);}
 replaceChildren(){this.children=[];}
 addEventListener(name,fn){this.events[name]=fn;}
 scrollIntoView(){}
}
const elements=Object.fromEntries(['corpus','validation','version','chapter','verses','heading','status','previous','next'].map(id=>[id,new Element()]));
elements.corpus.textContent=JSON.stringify(data);elements.validation.textContent=JSON.stringify(report);
const context=vm.createContext({document:{getElementById:id=>elements[id],createElement:()=>new Element(),createTextNode:text=>({textContent:text})},Option:function(text,value){this.text=text;this.value=value;}});
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
vm.runInContext(scripts.at(-1)[1],context);
assert.equal(elements.version.children.length,1);assert.equal(elements.chapter.children.length,50);
for(const version of Object.keys(data.versions))for(let chapter=1;chapter<=50;chapter++){
 elements.version.value=version;elements.chapter.value=String(chapter);elements.chapter.events.change();
 assert.equal(elements.verses.children.length,data.versions[version][chapter].length);
 assert.equal(elements.heading.textContent,`Gênesis ${chapter} · ${version}`);
 assert.equal(elements.previous.disabled,chapter===1);assert.equal(elements.next.disabled,chapter===50);
}
elements.chapter.value='2';elements.previous.events.click();assert.equal(elements.chapter.value,'1');
elements.next.events.click();assert.equal(elements.chapter.value,'2');
console.log(`OK: 50 capítulos, 1.533 registros, navegação offline, ${changes} ajustes apenas de espaços e 31 textos iguais ao piloto. Revisão editorial continua pendente.`);
