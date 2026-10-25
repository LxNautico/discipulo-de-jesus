# Atualizações e cache

O progresso e as notas ficam no localStorage. Não é necessário apagar os dados do site para atualizar a interface.

Após editar JavaScript ou CSS, execute nesta pasta:

```powershell
node refresh-assets.cjs
```

Esse comando atualiza os endereços dos recursos no index.html com um hash do conteúdo. Arquivos modificados passam a ter endereços diferentes no cache, inclusive se o nome original não mudou. Preserve esses parâmetros ao publicar.

O botão “Atualizar jogo” abre o mesmo index.html com um parâmetro novo, solicitando uma nova página sem remover dados de estudo. Não remove caches de outros aplicativos nem altera preferências do leitor.

Se uma aba antiga ainda não apresentar esse botão, abra o index.html desta pasta novamente ou faça uma atualização forçada uma vez para receber a nova página. Se continuar mostrando seis estudos, confira o endereço e se o servidor aponta para esta pasta; há apenas um index.html neste projeto. O servidor de hospedagem também deve revalidar index.html nas atualizações. Parâmetros de recurso não substituem essa configuração do servidor.

A pesquisa de palavras ainda usa os corpora BLIVRE e ONBV, com fonte explicitada. Eles não são versões antigas do leitor. O leitor online é o Bible.com com seletor de versões; suas contagens não foram importadas.
