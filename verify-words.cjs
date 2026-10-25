const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const engine=require('./word-engine.js');
const sample={books:[{id:'TST',name:'Teste',chapters:[[{number:1,text:'Fé, fé! Amor e amores; FE.'},{number:2,text:'Amor: amor. Café, cafe\u0301; guarda-chuva.'}]]}]};
const exact=engine.build(sample);
assert.equal(exact.words.get('fé').count,2);
assert.equal(exact.words.get('fé').matches.length,1);
assert.equal(exact.words.get('fe').count,1);
assert.equal(exact.words.get('amor').count,3);
assert.equal(exact.words.get('amores').count,1);
assert.equal(exact.words.get('café').count,2);
assert.equal(exact.words.get('guarda').count,1);
assert.equal(engine.build(sample,true).words.get('fe').count,3);
assert(!engine.ranking(exact,true).some(e=>e.word==='e'));
assert(engine.ranking(exact,false).some(e=>e.word==='e'));
const context={window:{}};
for(const [file,key] of [['ara-data.js','BIBLE_ARA']]){
  vm.runInNewContext(fs.readFileSync(__dirname+'/'+file,'utf8'),context);
  const data=context.window[key],idx=engine.build(data);
  const expected=data.books.reduce((sum,b)=>sum+b.chapters.reduce((n,c)=>n+c.reduce((v,s)=>v+(engine.tokenize(s.text).filter(w=>engine.normalize(w)==='fé').length),0),0),0);
  assert.equal((idx.words.get('fé')?.count||0),expected);
  assert.equal([...idx.words.values()].reduce((n,e)=>n+e.count,0),idx.tokenCount);
  assert.equal((idx.words.get('fé')?.matches||[]).reduce((n,m)=>n+m.count,0),expected);
  console.log(data.translation.name+': fé = '+expected+' ocorrências em '+(idx.words.get('fé')?.matches.length||0)+' versículos; '+idx.tokenCount+' palavras no corpus.');
}
console.log('OK: contagens reais, repetição no versículo, Unicode, acentos, flexões e filtro do ranking.');
