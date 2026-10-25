// Servidor de teste na rede local. Expõe apenas os recursos usados pelo jogo.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const root=__dirname,port=Number(process.env.DISCIPULO_PORT||4173);
function allowedFiles(){const html=fs.readFileSync(path.join(root,'index.html'),'utf8');return new Set(['index.html','Discipulo-de-Jesus-offline.html',...[...html.matchAll(/(?:src|href)="([^"?]+\.(?:js|css))(?:\?[^\"]*)?"/g)].map(m=>m[1])]);}
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const server=http.createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});return res.end();}
  let file;try{file=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html';}catch{res.writeHead(400);return res.end();}
  if(!allowedFiles().has(file)||path.basename(file)!==file){res.writeHead(404);return res.end('Não encontrado');}
  fs.readFile(path.join(root,file),(error,data)=>{if(error){res.writeHead(404);return res.end('Não encontrado');}const headers={'Content-Type':types[path.extname(file)],'Cache-Control':'no-store, max-age=0','X-Content-Type-Options':'nosniff'};if(file==='Discipulo-de-Jesus-offline.html')headers['Content-Disposition']='attachment; filename="Discipulo-de-Jesus-offline.html"';res.writeHead(200,headers);res.end(req.method==='HEAD'?undefined:data);});
});
server.on('error',error=>{console.error('Não foi possível iniciar o teste: '+error.message);process.exitCode=1;});
server.listen(port,'0.0.0.0',()=>{
  console.log('Discípulo de Jesus — teste no celular');console.log('Computador: http://localhost:'+port);
  for(const interfaces of Object.values(os.networkInterfaces()))for(const item of interfaces||[])if(item.family==='IPv4'&&!item.internal)console.log('Celular (mesma rede Wi-Fi): http://'+item.address+':'+port);
  console.log('Mantenha o computador ligado enquanto testa. Ctrl+C encerra o servidor.');
});
