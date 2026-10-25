const fs=require('node:fs'),path=require('node:path');
const root=__dirname;let html=fs.readFileSync(path.join(root,'index.html'),'utf8');const scripts=[];
html=html.replace(/<script src="([^"?]+)(?:\?[^\"]*)?" defer><\/script>/g,(_,file)=>{
  if(file==='offline-reader.js')throw Error('O leitor deve permanecer no Bible.com.');
  if(file==='update-game.js')return '';
  const code=fs.readFileSync(path.join(root,file),'utf8');
  scripts.push('<script>\n'+code.replace(/<\/script/gi,'<\\/script')+'\n</script>');return '';
});
html=html.replace(/<link rel="stylesheet" href="([^"?]+)(?:\?[^\"]*)?">/g,(_,file)=>'<style>\n'+fs.readFileSync(path.join(root,file),'utf8').replace(/@import\s+url\([^;]+;/g,'')+'\n</style>');
html=html.replace(/<button id="update-game"[\s\S]*?<\/button>/,'');
html=html.replace('<title>Discípulo de Jesus — Jornada bíblica</title>','<title>Discípulo de Jesus — Edição portátil</title>');
html=html.replace('<div id="app">','<p class="notice"><strong>Edição portátil · computador dispensado após baixar.</strong><br>Os estudos, perfis e anotações abrem sem conexão. A leitura da ARA em Gênesis e suas contagens funcionam sem internet. Outros livros, traduções e a pesquisa no Bible.com precisam da internet do celular. O progresso depende do armazenamento disponível no navegador.</p><div id="app">');
html=html.replace('</body>',scripts.join('\n')+'\n</body>');
const output=path.join(root,'Discipulo-de-Jesus-offline.html');fs.writeFileSync(output,html);console.log('Arquivo portátil: '+output+' ('+(fs.statSync(output).size/1024/1024).toFixed(1)+' MB).');
