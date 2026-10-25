## Escopo vigente: somente ARA como base local

Decisão do usuário em 15/10/2026: aprovar o uso da Almeida Revista e Atualizada (ARA) e encerrar o trabalho nas outras traduções locais. A revisão manual dos avisos é opcional e não bloqueia o avanço do projeto. Isso não é uma declaração de revisão editorial completa nem uma licença de redistribuição.

O jogo carrega apenas `ara-data.js`: Gênesis 1–50, 1.533 versículos. O leitor começa na ARA e abre esse conteúdo em tela inteira, sem internet. Livros ainda não convertidos e outras versões continuam no Bible.com, com internet. Estatísticas e ranking locais usam somente Gênesis/ARA, com o escopo indicado; não são totais da Bíblia inteira. BLIVRE e ONBV não são carregadas pelo índice nem incluídas no pacote portátil. Arquivos históricos de origem permanecem no diretório; notas antigas são preservadas nos saves e backups.

Gerar: `python extract-genesis-book.py`, `python build-ara-data.py`, `python build-genesis-review.py`, `node refresh-assets.cjs`, `node build-offline.cjs`. A conferência geral e a revisão opcional trabalham apenas com ARA (78 avisos). O pacote portátil tem aproximadamente 0,6 MB. As imagens e ferramentas editoriais não entram no jogo.

Origem local: PDF multiversões fornecido pelo usuário, SHA256 `60e90aa58ba40d2263191c9238d57b679b3da03f1f8458481c0df402f1a12fa9`, primeira coluna (ARA), páginas físicas 4–181. PyMuPDF 1.28.2. Estrutura de 50 capítulos validada; Gênesis 1 coincide com o piloto ajustado. A compilação do PDF não identifica de forma suficiente a edição editorial exata e respectivas permissões; isso continua registrado em ANALISE-PDF.md para uma futura distribuição pública.

As seções anteriores/abaixo são histórico e ficam substituídas por este escopo quando houver divergência.

# Bíblia integrada

## Decisão atual do usuário: fontes locais somente para estatísticas

Após esclarecer a diferença entre exibir o Bible.com e obter contagens pelo jogo, o usuário pediu para manter as traduções anteriores para as estatísticas. A interface possui duas áreas distintas: Pesquisa bíblica, com resultados do Bible.com no iframe; e Estatísticas de palavras, com contagens/ranking de BLIVRE e ONBV explicitamente identificados. O leitor continua exclusivamente no Bible.com, usando um catálogo sem textos; não há fallback de leitura local. Os textos locais voltaram ao pacote apenas para a ferramenta estatística e suas atribuições são preservadas. Os parágrafos abaixo sobre a remoção completa registram a etapa anterior, substituída por esta decisão.

## Estado atual: Bible.com em leitura e pesquisa

BLIVRE e ONBV foram removidas também da pesquisa, do índice de scripts e do pacote portátil. A navegação depende apenas de um catálogo com nomes, IDs e número de capítulos, sem textos bíblicos. A pesquisa usa a página pública `https://www.bible.com/pt/search/bible?query={termo}&version_id={id}`, na versão escolhida. A resposta pública foi consultada e identificou o termo pesquisado no título; a experiência interativa dentro do iframe ainda precisa ser conferida no navegador.

Os resultados do próprio Bible.com são exibidos num iframe na tela de pesquisa, com opções de ampliar e abrir em outra aba. A política de mesma origem do navegador impede que o jogo leia o HTML da página remota para construir suas próprias contagens e ranking. Esses números foram retirados até existir integração autorizada que os forneça. Não extraímos os textos do site. As notas antigas por palavra foram preservadas no armazenamento/backup, mas o editor antigo não faz parte desta tela.

As seções seguintes são registros das etapas anteriores; não descrevem mais as traduções ou corpora carregados no jogo atual.

## Seletor de versões online — base atual

O painel e os leitores de lições agora apresentam Versão da Bíblia, Livro e Capítulo. O catálogo `bible-versions.js` contém ARA (1608), ARC (212), NAA (1840), NVI (129) e NTLH (211), com identificadores conferidos no catálogo Bible.com. Esse módulo centraliza os metadados, a validação de identificadores, a construção de URLs e a preferência `discipulo-online-bible-version` no localStorage. O leitor usa ARA como padrão quando a preferência está ausente ou é inválida. Se o armazenamento falhar, mantém a escolha apenas na sessão.

Ao trocar a versão, livro e capítulo são preservados; título, descrição, link externo e próxima abertura em tela inteira usam a versão escolhida. Novos leitores usam a preferência salva. A navegação feita dentro do site externo não é sincronizada de volta ao painel. A leitura em iframe foi confirmada pelo usuário para ARA; as outras edições precisam de validação visual. Catálogo online e corpus de estatísticas permanecem separados: escolher NVI, por exemplo, não produz contagens NVI sem seu corpus.

Referências dos identificadores: https://www.bible.com/pt/versions/1608 , https://www.bible.com/pt/versions/212 , https://www.bible.com/pt/versions/1840 , https://www.bible.com/pt/versions/129 e https://www.bible.com/pt/versions/211 . As seções abaixo registram etapas anteriores e suas limitações.

## Leitor atual: somente ARA, em tela inteira

A pedido do usuário, a interface de leitura foi simplificada para a ARA do Bible.com. Os seletores de traduções, os leitores locais e os atalhos da SBB/Beblia foram removidos dessa interface. O botão abre um dialog ocupando toda a área do navegador com iframe e uma barra para fechar e retornar ao estudo. Ao fechar, o iframe é descartado e a rolagem e o foco anteriores são restaurados. Funciona também por cima do dialog de uma lição ou estudo por palavra. A navegação interna do Bible.com não é sincronizada de volta ao jogo.

Os corpora BLIVRE e ONBV foram preservados apenas para a pesquisa de palavras já implementada. Essa ferramenta identifica suas fontes e avisa que os resultados não são contagens da ARA. Seu botão de leitura abre o capítulo correspondente na ARA, com aviso de que o texto e a numeração podem diferir. O texto da ARA não foi importado e sua leitura exige conexão.

## Experimento Bible.com / YouVersion — ARA

O link fornecido pelo usuário (`https://www.bible.com/pt/bible/1608/GEN.1`) retornou HTTP 200 e título “Gênesis 1 | ARA Bíblia — App da Bíblia”. Na resposta de 15/10/2026, não havia `X-Frame-Options` nem diretiva `frame-ancestors` na CSP. Isso permite tentar um iframe, mas não garante funcionamento da interface, cookies, autenticação ou futuras políticas no navegador.

Cada leitor agora apresenta “ARA · Bible.com / YouVersion”: o iframe só carrega ao clicar no botão, mantendo o site e a atribuição do provedor. Um link para a mesma passagem em nova aba permanece disponível. Ao mudar o livro ou capítulo no nosso leitor, o endereço externo acompanha a mudança; a navegação interna do iframe pertence ao Bible.com e não sincroniza de volta ao jogo. Não copiamos nem incluímos o texto ARA nas contagens ou no corpus offline. A exibição é experimental e ainda não foi validada em navegador real.

Integração oficial para evolução: https://developers.youversion.com/api-usage e https://developers.youversion.com/sdks/introduction . Requer cadastro do aplicativo em https://platform.youversion.com/ e App Key; a disponibilidade da versão ARA precisa ser confirmada para esse aplicativo. A ausência de bloqueio no iframe não equivale a uma licença de redistribuição do texto.

## SBB: acesso oficial à NTLH

Cada leitor também oferece um link para `https://www.sbb.org.br/biblia/NTLH/{LIVRO}.{CAPITULO}`, seguindo o endereço fornecido pelo usuário. O botão acompanha o livro e capítulo atuais e abre em nova aba. Nenhum texto da SBB foi importado.

A consulta HTTP de 15/10/2026 à página NTLH/GEN.1 retornou a política `frame-ancestors 'self' https://*.etracker.com`, que impede incorporar o site num iframe do jogo. A ausência de integração embutida é uma restrição do servidor da SBB. Não houve teste visual no navegador; foram conferidos a resposta HTTP e os endereços gerados.

## Acesso ao Beblia

Adicionado em cada leitor o painel “Outras versões · Beblia.com”, com links para ARC, NAA, NVI (2000 e 2023), NTLH, NVT, A21 e TB. O link acompanha livro e capítulo e abre em nova aba; a versão externa preferida é salva separadamente. Os identificadores foram conferidos no catálogo XML do projeto Beblia.

Em 15/10/2026, uma consulta HTTP ao Beblia retornou `Content-Security-Policy: frame-ancestors 'self'` e `X-Frame-Options: SAMEORIGIN`. Portanto, não usamos iframe nem tentamos contornar o bloqueio. Os links externos não importam nem redistribuem esses textos. A abertura e a seleção efetiva no site externo ainda dependem de verificação visual no navegador. Disponibilidade e parâmetros pertencem ao Beblia e podem mudar.

## Segunda versão e seletor

O leitor e as lições agora permitem escolher entre BLIVRE e Biblica® Open Nova Bíblia Viva™ (2007). A troca preserva livro e capítulo, atualiza os créditos e salva a preferência em `discipulo-bible-version`, no localStorage. Cada leitor aberto pode ser alterado individualmente; novas leituras usam a última preferência. As traduções podem ter diferenças de numeração e quantidade de versículos.

Biblica® Open Nova Bíblia Viva™. Copyright © 2007, 2010 by Biblica, Inc. “Biblica” é uma marca registrada na Oficina de Patentes e Marcas dos Estados Unidos por Biblica, Inc. Usado com permissão.

O trabalho original dos titulares está disponível gratuitamente em https://www.biblica.com/ e https://open.bible/ .

- Fonte e aviso completo: https://ebible.org/poronbv/copyright.htm
- Licença do texto e da conversão de formato ONBV: Creative Commons Attribution-ShareAlike 4.0 International, https://creativecommons.org/licenses/by-sa/4.0/ .
- Dados: https://bible.helloao.org/api/por_onbv/complete.simple.json
- Arquivo recebido: `bible-onbv-source.json`.
- Formato para leitura local: `bible-onbv-data.js`.
- Conversão: seleção de livros, capítulos, números e textos de versículos; sem alteração dos textos. Notas e elementos de apresentação não são exibidos. Não há endosso dos titulares ao jogo.
- Data da obtenção: 15/10/2026.
- SHA256 do arquivo recebido: `8b957f66086da18b26c3911f433b5597626ab397d0786bf83776bcbed6a96cc2`.
- Corpus: 66 livros, 1.189 capítulos e 31.105 entradas de versículos.

A licença acima se refere ao texto ONBV e à sua conversão, mantidos como arquivos separados no projeto. As condições completas e os créditos também estão acessíveis nos leitores. A ONBV é a edição aberta identificada acima; não a apresentamos como NVI, NAA ou outra tradução.

## Edição selecionada

Bíblia Livre (BLIVRE), copyright © 2018 Diego Santos, Mario Sérgio e Marco Teles. Português brasileiro, atualização da tradução de Almeida de 1819, edição Textus Receptus, identificador eBible `porbr2018`. Não é ARA, ARC, NVI ou NAA.

- Projeto e tradutores: https://sites.google.com/site/biblialivre/
- Aviso de direitos desta distribuição: https://ebible.org/porbr2018/copyright.htm
- Licença explicitada pelo eBible para esta distribuição: Creative Commons Attribution 4.0, https://creativecommons.org/licenses/by/4.0/
- O repositório dos tradutores também documenta CC BY 3.0 Brasil. Preservamos a indicação 4.0 da distribuição eBible escolhida, sem presumir que ela se aplique a outras edições.
- Distribuidor dos dados JSON: https://bible.helloao.org/
- Arquivo de origem: https://bible.helloao.org/api/por_blj/complete.simple.json
- Identificador HelloAO: `por_blj` (BLJ na API; BLIVRE na interface).
- Data da obtenção: 15/10/2026.
- SHA256 do arquivo baixado: `923e4ec7a98b5db478ac4635c8a19a76bc2810a3b13ce5c1902d6bdffb8cba03`.

## Processamento

`bible-source.json` conserva o arquivo recebido. `bible-data.js` adapta o JSON para carregamento como script local, inclusive via file://, sem dependência de CORS, API key ou servidor. Foram selecionados livros, capítulos, números e textos de versículos, sem editar o texto. Notas e outros metadados de apresentação não são exibidos no leitor. Os créditos e links permanecem visíveis em cada leitor.

O corpus recebido contém 66 livros, 1.189 capítulos e 31.102 entradas de versículos. Isso descreve esta edição e representação; não é uma contagem universal para toda Bíblia.

## Escolha da fonte

O Beblia foi considerado como catálogo XML. Seu README permite uso, mas não detalha individualmente os direitos das traduções. Para iniciar, usamos a Bíblia Livre com atribuição e licença identificadas no distribuidor eBible, obtida em JSON pela HelloAO. Não importamos traduções modernas do Beblia sem verificar seus direitos.

## Funcionamento

Abra `index.html` normalmente ou pelo Live Server. A aba Bíblia no jogo permite escolher livro e capítulo; as seis lições exibem as leituras com destaque nos versículos indicados. A primeira lição abrange Gênesis 1 e 2: use Próximo para continuar. A última inclui leitores separados para Mateus e Atos.

O texto funciona offline com todos os arquivos locais presentes. Fontes tipográficas externas são opcionais. Esta etapa não inclui comparação entre traduções, IA ou contagens no corpus completo.
