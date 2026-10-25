// Execute após alterar JS/CSS: node refresh-assets.cjs
// Cada arquivo recebe no HTML um identificador derivado do seu conteúdo.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const target=path.join(__dirname,'index.html');
let html=fs.readFileSync(target,'utf8');
html=html.replace(/\b(src|href)="([^"?#]+\.(?:js|css))(?:\?[^"#]*)?"/g,(_,attribute,file)=>{
  const resolved=path.resolve(__dirname,file);
  if(path.dirname(resolved)!==__dirname)throw Error('Recurso fora da pasta do jogo: '+file);
  const hash=crypto.createHash('sha256').update(fs.readFileSync(resolved)).digest('hex').slice(0,12);
  return `${attribute}="${file}?v=${hash}"`;
});
fs.writeFileSync(target,html);
console.log('Referências JS/CSS atualizadas pelo conteúdo; progresso do jogador preservado.');
