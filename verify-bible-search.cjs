const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},URL,localStorage:{getItem:()=>null,setItem(){}}};
vm.runInNewContext(fs.readFileSync(__dirname+'/bible-versions.js','utf8'),ctx);
for(const version of ctx.window.BibleVersions.versions){const url=new URL(ctx.window.BibleVersions.searchUrl(version.id,'fé & amor'));assert.equal(url.hostname,'www.bible.com');assert.equal(url.searchParams.get('version_id'),version.id);assert.equal(url.searchParams.get('query'),'fé & amor');}
assert.throws(()=>ctx.window.BibleVersions.searchUrl('invalido','amor'));assert.throws(()=>ctx.window.BibleVersions.searchUrl('1608',' '));
const html=fs.readFileSync(__dirname+'/index.html','utf8');
assert(/src="word-study\.js/.test(html));
const stats=fs.readFileSync(__dirname+'/word-study.js','utf8');
assert(stats.includes("view !== 'estatisticas'"));assert(!stats.includes("view !== 'pesquisa'"));
const reader=fs.readFileSync(__dirname+'/ara-reader.js','utf8');assert(!reader.includes('BIBLE_DATA'));assert(reader.includes('BIBLE_CATALOG'));
assert(html.includes('bible-search.js'));assert(html.includes('bible-catalog.js'));
vm.runInNewContext(fs.readFileSync(__dirname+'/bible-catalog.js','utf8'),ctx);assert.equal(ctx.window.BIBLE_CATALOG.books.length,66);
assert(ctx.window.BIBLE_CATALOG.books.every(b=>typeof b.numberOfChapters==='number'&&!('chapters'in b)&&!('text'in b)));
console.log('OK: leitura/pesquisa Bible.com nas cinco versões, estatísticas separadas e catálogo do leitor sem textos locais.');
