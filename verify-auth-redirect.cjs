const assert=require('node:assert/strict'),{resolve}=require('./auth-redirect.js');
assert.equal(resolve('http://localhost:4173/?x=1#access_token=segredo'),'http://localhost:4173/');
assert.equal(resolve('http://127.0.0.1:5500/Discipulo%20de%20Jesus/index.html?atualizacao=123'),'http://127.0.0.1:5500/Discipulo%20de%20Jesus/index.html');
assert.equal(resolve('file:///C:/jogo.html'),null);
assert.equal(resolve('file:///C:/jogo.html','https://jogo.exemplo.com/?x=1#token'),'https://jogo.exemplo.com/');
assert.equal(resolve('https://jogo.exemplo.com/','javascript:alert(1)'),'https://jogo.exemplo.com/');
assert.equal(resolve('https://user:senha@jogo.exemplo.com/'),null);
console.log('OK: retorno HTTP(S), caminho preservado, file:// recusado e tokens/credenciais não enviados.');
