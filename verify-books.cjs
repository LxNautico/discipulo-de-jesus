const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={window:{}};
for(const file of ['bible-catalog.js','books-data.js'])vm.runInNewContext(fs.readFileSync(__dirname+'/'+file,'utf8'),context);
const books=context.window.BOOK_GUIDE.books,catalog=context.window.BIBLE_CATALOG.books;
assert.equal(books.length,66);assert.equal(books.filter(b=>b.testament==='AT').length,39);assert.equal(books.filter(b=>b.testament==='NT').length,27);
assert.deepEqual(Array.from(books,b=>b.id),Array.from(catalog,b=>b.id));
for(const book of books){
 for(const key of ['author','date','audience','place','genre','language','context','purpose','christ','note'])assert.ok(typeof book[key]==='string'&&book[key].trim(),book.id+' '+key);
 assert.equal(book.chapters,catalog.find(b=>b.id===book.id).numberOfChapters);
 assert.ok(book.outline.length>=2);assert.ok(book.themes.length>=3);assert.equal(book.reading.book,book.id);
 assert.ok(book.reading.chapter>=1&&book.reading.chapter<=book.chapters);assert.ok(book.reading.fromVerse>0&&book.reading.toVerse>=book.reading.fromVerse);
 for(const part of book.outline)assert.ok(part.chapter>=1&&part.chapter<=book.chapters);
 for(const source of book.sources){const url=new URL(source.url);assert.equal(url.protocol,'https:');assert.ok(['www.esv.org','biblia.com'].includes(url.hostname));}
}
assert.match(books.find(b=>b.id==='HEB').author,/desconhecido/);assert.match(books.find(b=>b.id==='PSA').author,/vários autores/);assert.match(books.find(b=>b.id==='JOB').date,/Indeterminada/);assert.match(books.find(b=>b.id==='DAN').date,/século II/);
const index=fs.readFileSync(__dirname+'/index.html','utf8'),portable=fs.readFileSync(__dirname+'/Discipulo-de-Jesus-offline.html','utf8');
for(const file of ['books-data.js','books-ui.js','books.css'])assert.ok(index.includes(file));
assert.ok(portable.includes('window.BOOK_GUIDE='));assert.ok(portable.includes('Fontes e critérios editoriais'));
console.log('OK: 66 introduções completas, ordem canônica, 39/27 livros, fontes, roteiro e leitura vinculada; incluídas no portátil.');
