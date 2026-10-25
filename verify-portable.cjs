const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/Discipulo-de-Jesus-offline.html','utf8');
assert(!/<script src=/.test(html));assert(!/<link rel="stylesheet"/.test(html));assert(!/@import/.test(html));
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
scripts.forEach(code=>new vm.Script(code));
for(const file of ['ara-reader.js','bible-versions.js']){
 const source=fs.readFileSync(__dirname+'/'+file,'utf8').replace(/<\/script/gi,'<\\/script');
 assert(scripts.some(code=>code.trim()===source.trim()),file+' deve ser idêntico ao leitor principal');
}
assert(!html.includes('Leitura offline: Bíblia Livre'));assert(!html.includes('BLIVRE · Offline'));assert(!html.includes('leitor offline exibe BLIVRE'));
assert(html.includes('A leitura da ARA em Gênesis e suas contagens funcionam sem internet.'));
assert(html.includes('ARA · CONTAGEM LOCAL'));
assert(html.includes('window.BIBLE_ARA='));assert(!html.includes('window.BIBLE_DATA='));assert(!html.includes('window.BIBLE_ONBV='));
assert(html.includes("view !== 'estatisticas'"));
assert(html.includes('Pesquise no Bible.com usando a mesma versão escolhida'));
assert(html.includes("id:'1608'"));assert(html.includes("id:'1840'"));
console.log('OK: pacote autocontido, seletor e leitor Bible.com idênticos ao principal, sem leitor BLIVRE ou fallback, avisos e créditos de pesquisa corretos.');
