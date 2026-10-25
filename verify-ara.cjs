const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Element{
  constructor(tag='div'){this.tag=tag;this.children=[];this.dataset={};this.style={};this.events={};this.textContent='';}
  set innerHTML(v){this.html=v;this.children=[];}
  append(...items){for(const item of items){if(typeof item==='object'){if(item.parent)item.remove();item.parent=this;}this.children.push(item);}}
  insertBefore(item,target){item.parent=this;const i=this.children.indexOf(target);this.children.splice(i<0?this.children.length:i,0,item);}
  before(item){this.parent.insertBefore(item,this);}
  remove(){if(this.parent){const i=this.parent.children.indexOf(this);if(i>=0)this.parent.children.splice(i,1);}this.parent=null;}
  replaceChildren(...items){this.children=[];this.append(...items);}
  setAttribute(){}
  addEventListener(name,fn){this.events[name]=fn;}
  showModal(){this.open=true;}
  close(){this.open=false;this.events.close?.();}
  focus(){this.focused=true;}
  querySelector(s){return descendants(this).find(n=>s==='p'?n.tag==='p':n.className===s.slice(1));}
}
function descendants(e){return e.children.filter(c=>typeof c==='object').flatMap(c=>[c,...descendants(c)]);}
const app=new Element(),body=new Element('body'),lesson=new Element(),nav=new Element();nav.append(new Element('button'),new Element('button'));
const root=new Element('html');root.style.overflow='auto';
const savedPreferences=new Map();
const ctx=vm.createContext({URL,localStorage:{getItem:k=>savedPreferences.get(k),setItem:(k,v)=>savedPreferences.set(k,v)},window:{},app,view:'biblia',intro:()=>'',render(){},openLesson(){lesson.replaceChildren(new Element('p'));},document:{body,documentElement:root,createElement:tag=>new Element(tag),querySelector:s=>s==='nav'?nav:lesson}});
for(const file of ['bible-catalog.js','bible-versions.js','bible-site-viewer.js','ara-reader.js','bible.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+file,'utf8'),ctx);
let nodes=descendants(app),selects=nodes.filter(n=>n.tag==='select');
assert.equal(selects.length,3);assert.equal(selects[0].children.length,5);assert.equal(selects[1].children.length,66);
const link=nodes.find(n=>n.className==='secondary youversion-link');
const buttons=nodes.filter(n=>n.tag==='button');
assert.equal(buttons[0].disabled,true);assert.equal(link.href,'https://www.bible.com/pt/bible/1608/GEN.1');
buttons[1].onclick();assert.equal(link.href,'https://www.bible.com/pt/bible/1608/GEN.2');
const open=buttons.find(n=>n.textContent==='Abrir Bíblia em tela inteira');open.onclick();
const modal=body.children[0],frame=descendants(modal).find(n=>n.tag==='iframe');
assert.equal(modal.open,true);assert.equal(frame.src,link.href);assert.equal(root.style.overflow,'hidden');
descendants(modal).find(n=>n.tag==='button').onclick();assert.equal(body.children.length,0);assert.equal(frame.src,'about:blank');assert.equal(root.style.overflow,'auto');assert.equal(open.focused,true);
open.onclick();assert.equal(body.children.length,1);body.children[0].close();assert.equal(body.children.length,0);
ctx.navigator={onLine:false};open.onclick();assert.equal(body.children.length,0);assert.equal(link.href,'https://www.bible.com/pt/bible/1608/GEN.2');ctx.navigator.onLine=true;
selects[1].value='REV';selects[1].onchange();selects[2].value='22';selects[2].onchange();assert.equal(buttons[1].disabled,true);
selects[1].value='EXO';selects[1].onchange();buttons[0].onclick();assert.equal(link.href,'https://www.bible.com/pt/bible/1608/GEN.50');
selects[0].value='1840';selects[0].onchange();
assert.equal(link.href,'https://www.bible.com/pt/bible/1840/GEN.50');
assert.equal(savedPreferences.get('discipulo-online-bible-version'),'1840');
open.onclick();assert.equal(descendants(body).find(n=>n.tag==='iframe').src,link.href);body.children[0].close();
for(let i=0;i<20;i++){ctx.openLesson(i);nodes=descendants(lesson);const count=i===17?3:[3,6,7,8,10,11,13,14,19].includes(i)?2:1;assert.equal(nodes.filter(n=>n.className==='secondary youversion-link').length,count);assert(nodes.filter(n=>n.className==='secondary youversion-link').every(n=>n.href.includes('/1608/')));}
console.log('OK: cinco versões, preferência salva, mesma passagem ao trocar versão, navegação, 20 lições, janela inteira, fechar, reabrir, restauração de foco e rolagem. DOM simulado.');
