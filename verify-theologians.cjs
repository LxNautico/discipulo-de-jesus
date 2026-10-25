const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{}};
for(const file of ['bible-catalog.js','theologians-data.js'])vm.runInNewContext(fs.readFileSync(__dirname+'/'+file,'utf8'),ctx);
const profiles=ctx.window.THEOLOGIAN_GUIDE.profiles,books=ctx.window.BIBLE_CATALOG.books;
assert.equal(profiles.length,18);assert.equal(new Set(profiles.map(p=>p.id)).size,18);
for(const p of profiles){
 for(const field of ['name','dates','region','tradition','era','context','caution','question','source','sourceName'])assert.ok(typeof p[field]==='string'&&p[field].trim(),p.id+' '+field);
 assert.ok(p.born<p.died);assert.ok(p.ideas.length>=2);assert.ok(p.works.length>=2);assert.ok(p.themes.length>=2);assert.ok(p.readings.length);
 for(const pair of [...p.ideas,...p.works])assert.ok(pair.length===2&&pair.every(s=>typeof s==='string'&&s.trim()));
 for(const [book,chapter,from,to] of p.readings){const b=books.find(b=>b.id===book);assert.ok(b);assert.ok(chapter>=1&&chapter<=b.numberOfChapters);assert.ok(from>0&&to>=from);}
 assert.equal(new URL(p.source).protocol,'https:');for(const s of p.extraSources||[])assert.equal(new URL(s.url).protocol,'https:');
}
assert.match(profiles.find(p=>p.id==='arminio').ideas[0][1],/ação divina/);assert.match(profiles.find(p=>p.id==='calvino').caution,/posteriormente/);assert.match(profiles.find(p=>p.id==='wesley').caution,/impecabilidade/);
const index=fs.readFileSync(__dirname+'/index.html','utf8'),portable=fs.readFileSync(__dirname+'/Discipulo-de-Jesus-offline.html','utf8');
for(const file of ['theologians-data.js','theologians-ui.js','theologians.css'])assert.ok(index.includes(file));assert.ok(portable.includes('window.THEOLOGIAN_GUIDE='));
console.log('OK: 18 perfis, obras, ideias, datas, fontes e passagens; conteúdo incluído no portátil.');
