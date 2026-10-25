## Teólogos — 16/10/2026

Nova seção com 18 perfis históricos: contexto, tradições, obras comentadas, ideias, observações críticas e perguntas de estudo. Busca por nome/obra/tema, filtros de época/tradição, ordem histórica ou alfabética. Autores relacionados e passagens ARA, com atalho ao painel reformado/arminiano nos perfis pertinentes. Fontes diretas por autor; critérios em TEOLOGOS.md. Conteúdo incluído no portátil, sem alterações de saves ou XP. Validado em dados e no Chrome em largura de celular, percorrendo os 18 perfis.

## Livros da Bíblia — 16/10/2026

Nova seção com fichas dos 66 livros (39 AT e 27 NT), busca por livro/autor/tema e filtros por testamento e grupo. Cada ficha reúne autoria e incertezas, época/local de escrita, destinatários, gênero, idioma, contexto, propósito, temas, roteiro, leitura sugerida, relação com a história da redenção e perguntas. Os atalhos usam o leitor ARA existente. Fontes editoriais diretas nas fichas; conteúdo próprio em português. Ver LIVROS-DA-BIBLIA.md para critérios e reprodução.

Conteúdo e interface incluídos no portátil e disponíveis offline; fontes externas e livros ainda não convertidos exigem internet. Consulta sem alterar XP, notas ou retomada. Testes de conteúdo e Chrome verificam as 66 fichas, filtros, busca sem acentos, retorno, roteiros e tela de celular. Saves, backups e retomada continuam validados.

## Retomada da jornada — 16/10/2026

A página inicial destaca o último estudo histórico aberto e ainda não concluído, com o botão “Retomar estudo” e a indicação “Em andamento” no cartão. Ao concluir, passa a sugerir o primeiro estudo restante. Revisitar um estudo concluído não substitui uma retomada pendente nem concede XP novamente.

A reflexão é salva imediatamente ao digitar, além do botão manual existente. O armazenamento continua local; os mecanismos de backup e sincronização incluem a retomada e as notas. Falhas de armazenamento são informadas junto à anotação. A retomada abre o estudo e recupera a reflexão; não promete restaurar rolagem, resposta incorreta ou posição no leitor bíblico.

O registro opcional `resume` fica em `discipulo-v1`, sem mudar a versão 5 do save. Saves antigos continuam válidos. A união entre aparelhos escolhe a retomada válida mais recente, excluindo estudos já concluídos na união. Não há mudança no SQL do Supabase. Validação: verify-resume.cjs e verify-resume-browser.cjs, além dos testes de migração, backup, cloud e pacote portátil. No Chrome, foi testado o pacote completo em perfil isolado, incluindo recarga real.

## Escopo vigente: somente ARA como base local

Decisão do usuário em 15/10/2026: aprovar o uso da Almeida Revista e Atualizada (ARA) e encerrar o trabalho nas outras traduções locais. A revisão manual dos avisos é opcional e não bloqueia o avanço do projeto. Isso não é uma declaração de revisão editorial completa nem uma licença de redistribuição.

O jogo carrega apenas `ara-data.js`: Gênesis 1–50, 1.533 versículos. O leitor começa na ARA e abre esse conteúdo em tela inteira, sem internet. Livros ainda não convertidos e outras versões continuam no Bible.com, com internet. Estatísticas e ranking locais usam somente Gênesis/ARA, com o escopo indicado; não são totais da Bíblia inteira. BLIVRE e ONBV não são carregadas pelo índice nem incluídas no pacote portátil. Arquivos históricos de origem permanecem no diretório; notas antigas são preservadas nos saves e backups.

Gerar: `python extract-genesis-book.py`, `python build-ara-data.py`, `python build-genesis-review.py`, `node refresh-assets.cjs`, `node build-offline.cjs`. A conferência geral e a revisão opcional trabalham apenas com ARA (78 avisos). O pacote portátil tem aproximadamente 0,6 MB. As imagens e ferramentas editoriais não entram no jogo.

Origem local: PDF multiversões fornecido pelo usuário, SHA256 `60e90aa58ba40d2263191c9238d57b679b3da03f1f8458481c0df402f1a12fa9`, primeira coluna (ARA), páginas físicas 4–181. PyMuPDF 1.28.2. Estrutura de 50 capítulos validada; Gênesis 1 coincide com o piloto ajustado. A compilação do PDF não identifica de forma suficiente a edição editorial exata e respectivas permissões; isso continua registrado em ANALISE-PDF.md para uma futura distribuição pública.

As seções anteriores/abaixo são histórico e ficam substituídas por este escopo quando houver divergência.

# Discípulo de Jesus — análise e primeira versão

## Decisão final sobre pesquisa e estatísticas

O usuário autorizou manter BLIVRE e ONBV especificamente para contagens e ranking após a explicação sobre a separação técnica entre iframe e dados de API. A leitura e Pesquisa bíblica usam Bible.com; a nova área Estatísticas de palavras usa as fontes locais, claramente identificadas. Não se atribuem seus números às versões escolhidas no Bible.com. O editor de estudo por palavra e suas anotações foram preservados na ferramenta estatística. O leitor continua online, sem fallback local. Essa decisão substitui a remoção completa descrita na seção anterior.

## Substituição completa da pesquisa pelo Bible.com

Atendendo à correção do usuário, as duas traduções locais saíram também da pesquisa e do carregamento do jogo. `bible-search.js` permite escolher ARA, ARC, NAA, NVI ou NTLH e abre a pesquisa no Bible.com, em tela inteira ou nova aba. A mesma preferência é usada na leitura. Contagens e ranking locais foram retirados; uma futura integração autorizada com as versões escolhidas é necessária para reintroduzir esses recursos com números verificáveis.

`bible-catalog.js` contém somente nomes, IDs e quantidade de capítulos dos 66 livros, sem texto bíblico. Ele substitui a dependência do corpus completo para navegação. `bible-site-viewer.js` centraliza abertura/fechamento do site. O gerador portátil recusa os scripts antigos, e o teste do pacote verifica ausência dos corpora e nomes das traduções retiradas. Arquivos antigos de origem e testes permanecem no diretório de desenvolvimento, mas não são servidos pelo índice nem incluídos no pacote. Notas antigas por palavra permanecem preservadas no armazenamento e nos backups; não há nova edição dessas notas na pesquisa externa.

## Estado dos saves e últimas sincronizações

O cabeçalho passa a mostrar um indicador clicável com estado local, pendente, enviando, confirmado, sem conexão ou falha. Conta e saves também mostra último envio confirmado pelo servidor e último recebimento aplicado, com datas no fuso America/Sao_Paulo. As primeiras sincronizações anteriores à implementação não têm data reconstruída: uma nova sincronização inicia o registro neste aparelho.

`cloud-status.js` centraliza a comparação dos dados efetivamente enviados e a apresentação dos estados. Os metadados são separados por usuário, não entram no backup e não alteram os saves existentes. Uma edição feita enquanto a requisição está em trânsito permanece pendente após o retorno; falhas não registram sucesso. O envio automático não afirma que todas as alterações de outros aparelhos já foram recebidas. Testes locais cobrem estados e edição concorrente, sem necessidade de alterar o SQL do Supabase.

## Supabase preparado

Projeto e chave pública fornecidos pelo usuário foram configurados em `supabase-config.js`. A consulta somente de leitura ao endpoint público de autenticação confirmou conectividade, e-mail habilitado, cadastro permitido e confirmação de e-mail exigida. Nenhum usuário foi criado nem dado remoto alterado nessa verificação.

`supabase-setup.sql` cria a tabela de saves, políticas RLS por `auth.uid()` e uma função SECURITY INVOKER com comparação de revisão para impedir perda por gravações concorrentes. Precisa ser executado pelo usuário no SQL Editor. `cloud-sync.js` faz releitura, união via mecanismo de backup e tentativa novamente em conflito. `cloud-ui.js` oferece login/cadastro, primeira vinculação explícita, sincronização manual com aplicação e recarga, e envio automático opcional. Trocas de conta não misturam automaticamente o progresso local. Senhas não são persistidas pelo código do jogo e sessões não entram no backup.

SDK oficial supabase-js 2.118.0 incluído localmente para manter o jogo funcionando sem CDN, também na edição portátil. Ver SUPABASE.md para configuração, uso e limites: exclusões não são propagadas, receber alterações exige sincronização manual e o navegador ainda mantém um perfil de progresso local único. A integração remota completa aguarda execução do SQL e teste com duas contas/aparelhos; testes locais cobrem concorrência, preservação de dados, notas e falhas de rede.

## Backup e transferência local

Área “Meu progresso” permite exportar um JSON e importar com prévia e confirmação dentro do jogo. Exporta somente chaves conhecidas do projeto, incluindo conclusões históricas, trilhas, emblemas, notas de perfil e estudos por palavra, e preferência de versão. Não exporta textos bíblicos nem dados de outros projetos no mesmo localhost.

A importação une conclusões sem duplicar, mantém a preferência atual, conserva a data mais antiga de um emblema e preserva reflexões diferentes na mesma anotação com separador. O formato é identificado e versionado; arquivos inválidos ou maiores que 5 MB são recusados. Falhas de gravação tentam restaurar o estado anterior. Após confirmar, a página recarrega para reconstruir o estado dos módulos. Não há sincronização automática ou conta nesta etapa. O pedido seguinte do usuário considera armazenamento remoto, aguardando identificar qual serviço chama de “pbase”.

## Correção da edição portátil

A edição portátil usa o mesmo leitor Bible.com e catálogo de versões da edição principal. Foi removido o leitor BLIVRE alternativo e a substituição automática de tradução no gerador. Estudos e ferramentas locais funcionam sem PC, mas a leitura bíblica exige a conexão do celular. O arquivo gerado mantém o nome `Discipulo-de-Jesus-offline.html` para compatibilidade e informa na interface que se trata de uma edição portátil com leitura online. BLIVRE e ONBV continuam somente na ferramenta de pesquisa de palavras, com fontes identificadas. O teste `verify-portable.cjs` impede que o pacote volte a usar um leitor diferente do principal.

## Perfis de pessoas — Abraão

Primeiro perfil completo disponível em Pessoas da Bíblia → Conhecer Abraão: apresentação; quatro fichas com referências; cinco acontecimentos narrativos com leitor; interpretação teológica identificada; observação sobre incerteza cronológica; quatro estudos existentes relacionados; três temas com perguntas e leituras; reflexões pessoais. A busca aceita Abraão, Abrão e formas sem acento. A lista preserva busca e filtro ao voltar do perfil; as outras sete pessoas continuam como resumos e indicam que os perfis completos estão em preparação.

Base reutilizável em `people-data.js` (IDs, aliases, fichas, eventos, referências estruturadas, interpretação, estudos e temas), `people-ui.js` (lista e perfil) e `people-notes.js` (anotações em `discipulo-people-notes-v1`). Para disponibilizar outro perfil, adicione seus dados com nome correspondente ao cartão da lista. Os estudos relacionados são resolvidos pelo título atual e validados em teste; alterações nesses títulos devem atualizar as relações.

As passagens usam o leitor online existente, com versão preferida e abertura em tela inteira. Estudos relacionados abrem as lições existentes e usam o progresso normal, sem cópias. Notas dos perfis são independentes de notas de lições e trilhas; consultar um perfil não concede XP nem emblemas e suas notas ainda não contam para Primeira Reflexão. Nenhum dado anterior é removido.

Verificação: referências existentes no corpus, relações com estudos, persistência das notas, falhas de armazenamento e independência dos dados da jornada e das trilhas. A interface ainda precisa de conferência em navegador real.

## Emblemas e conquistas

Catálogo central em `achievement-rules.js`: 100, 500 e 1.000 XP; conclusão dos 20 estudos históricos; conclusão das cinco etapas de Dinheiro e generosidade; primeira reflexão salva na jornada ou trilha temática. Os emblemas não concedem XP adicional. O XP continua sendo 100 por estudo histórico concluído; as trilhas não concedem XP nesta versão.

`achievements.js` observa os salvamentos da jornada e os eventos de persistência das trilhas, reconhece conquistas antigas e registra IDs/datas em `discipulo-achievements-v1`. A data apresentada é a do reconhecimento do emblema, sem inventar quando o jogador concluiu uma atividade anterior. Revisar ou recarregar não duplica conquistas. A tela Minhas conquistas exibe critérios, progresso, emblemas recebidos e datas; novos reconhecimentos apresentam um aviso dispensável com animação reduzida conforme a preferência do sistema. Emblemas permanecem recebidos mesmo se uma nota for apagada posteriormente. O conteúdo das reflexões não é avaliado.

Reflexões do estudo por palavra ainda não contam para o primeiro emblema; a descrição delimita jornada e trilhas temáticas. O armazenamento é local, sem proteção contra edição manual ou sincronização de contas. O critério da trilha histórica deve ser revisto quando a sequência de estudos mudar. Falhas de gravação dos emblemas são informadas na tela de conquistas.

## Trilhas temáticas: primeira implementação

“Vida e Palavra” oferece a trilha funcional Dinheiro e generosidade: coração; trabalho; prudência; partilha; justiça. Os demais temas permanecem identificados como introduções, com suas referências e trilhas completas em preparação. A jornada histórica continua com 20 estudos.

A base temática é composta por `topic-data.js` (conteúdo com IDs estáveis, referências estruturadas, contexto, explicação, pergunta com gabarito, reflexão e prática), `topic-progress.js` (estado independente em `discipulo-topics-v1`) e `topic-ui.js` (catálogo, visão da trilha e estudo por etapa). É possível revisar etapas, retomar a última etapa, salvar reflexões automaticamente e concluir após responder corretamente à pergunta. Revisões não duplicam conclusões; esse progresso não altera XP ou notas da jornada histórica. Ao concluir a quinta etapa, a visão geral indica a trilha concluída.

Os leitores reutilizam o seletor de versões online e a tela inteira. O conteúdo editorial identifica a perspectiva reformada e preserva o contexto das passagens; a trilha não apresenta as referências como promessa de enriquecimento nem como aconselhamento financeiro personalizado. As anotações permanecem no navegador, sem conta ou sincronização. Falhas de armazenamento são informadas na interface.

Para novas trilhas, preserve os IDs de trilha e etapa e siga o formato de conteúdo e referências. A primeira publicação está ligada ao cartão Dinheiro e generosidade; as próximas devem registrar sua associação no catálogo de temas. A validação inclui estado persistido, referências bíblicas, gabaritos, retomada e independência do progresso histórico; ainda falta validação de interface em navegador real.

## Prioridade atual: bases para crescimento

A pedido do usuário, novas expansões de estudos ficam para depois. A primeira melhoria estrutural é o catálogo de versões online separado em `bible-versions.js`, consumido pelo leitor reutilizado no painel, nas lições e nos estudos por palavra. O catálogo define metadados e identificadores do provedor; a interface cuida da seleção, navegação e abertura. Há persistência da versão preferida e validação de preferência inválida. Os textos usados para estatísticas continuam em uma camada distinta e não devem ser confundidos com a versão exibida pelo provedor online.

## Estado atual: 20 estudos e pesquisa no corpus completo

Após o Sinai, foram incluídos deserto (Êxodo 16:1–30), Josué (Josué 1:1–18), Juízes (Juízes 2:6–23) e Rute (Rute 1:14–22; 2:8–12; 4:13–22, com leitura complementar do livro inteiro). A passagem sobre o deserto retoma cronologicamente Êxodo 16, anterior ao Sinai, como estudo temático da caminhada. SchemaVersion 5 migra conclusões e notas das quatro versões anteriores; os estudos sobre o Reino e a missão agora estão nas posições finais 19 e 20.

A aba Pesquisa bíblica substitui a busca em resumos por busca nos textos completos de BLIVRE e ONBV. Mostra ocorrências e quantidade de versículos em cada tradução, ranking de 30 palavras com filtro opcional de palavras comuns e resultados paginados de 20 versículos em ordem bíblica. A seleção de uma palavra no ranking inicia a pesquisa correspondente. “Ler capítulo e estudar” abre o leitor da edição pesquisada, destaca o versículo, apresenta perguntas de observação/interpretação/aplicação e permite avançar entre ocorrências e salvar notas por palavra, tradução e passagem. Essas notas ficam no navegador e não alteram XP.

Critérios: tokens Unicode de letras ou números, normalização NFC, sem distinguir maiúsculas; acentos preservados por padrão, com opção explícita de ignorá-los. Pontuação e hífen separam tokens. Flexões não são agrupadas e uma palavra não é contada como trecho de outra. Só o texto dos versículos entra na contagem, sem títulos e notas. Ranking lexical não equivale a ranking de assuntos ou relevância teológica. Apenas as duas traduções locais são contadas; SBB e Beblia permanecem links externos.

Verificação: sintaxe JavaScript, migração e recarga, leitores das 20 lições em DOM simulado e contagens do corpus confrontadas com varredura direta. Exemplo da busca exata “fé”: BLIVRE, 255 ocorrências/237 versículos; ONBV, 282/247. A interface nova de pesquisa ainda precisa de validação visual e de interação em navegador real.

Próxima expansão de conteúdo sugerida: Samuel, Saul, Davi e Salomão. A integração com IA continua pendente.

## Expansão do Êxodo

A trilha agora tem 16 estudos. Após o chamado de Moisés, foram adicionados Páscoa (Êxodo 12:1–14,21–28), saída do Egito (12:29–42; 13:17–22), travessia do mar (14:10–31) e aliança no Sinai (19:1–8; 20:1–17). Todos possuem leitura integrada, quiz com explicação e reflexão prática. São episódios selecionados; o ciclo das pragas e outros acontecimentos ainda não têm estudos próprios.

SchemaVersion 4 preserva conclusões e notas das três versões anteriores. Os estudos antigos sobre o Reino e a missão avançam quatro posições. Próxima expansão sugerida: caminhada no deserto, Josué e entrada na terra, Juízes e Rute, preparando a transição para os reis.

## Expansão dos patriarcas

A trilha agora tem 12 estudos. Entre Abraão e Moisés entraram Isaque (Gênesis 26:1–6,12–25), Jacó (28:10–22; 32:22–32) e José (45:1–15; 50:15–21). Cada estudo tem duas leituras integradas, resumo, pergunta com explicação e reflexão prática. Leituras complementares ajudam a acompanhar o contexto entre os episódios. A numeração dos cartões foi ajustada para capítulos 10 em diante.

O armazenamento usa schemaVersion 3. A migração preserva conclusões e notas tanto do protótipo de seis estudos quanto da versão de nove; os três estudos finais antigos são deslocados para depois dos novos patriarcas. Os testes verificam também que recarregar não repete a migração.

Próxima expansão sugerida: libertação do Egito, Páscoa, travessia do mar e aliança no Sinai, após o chamado de Moisés. A jornada continua introdutória e ainda não cobre todos os períodos bíblicos.

## Expansão da jornada

A trilha tem agora nove estudos: criação; queda; Caim e Abel (Gênesis 4:1–16); Noé (Gênesis 6:5–22 e 9:1–17, com sugestão de leitura complementar de 7–8); Babel (Gênesis 11:1–9); Abraão; Moisés; Sermão do Monte; missão e igreja. Os novos estudos têm resumo, quiz com explicação, reflexão e leitores internos nas duas traduções. A preferência de tradução continua funcionando.

O progresso anterior é migrado para schemaVersion 2 no mesmo armazenamento local: os índices dos antigos estudos de Abraão em diante avançam três posições, preservando conclusões e notas. A migração fica registrada para não ser repetida ao recarregar.

## Comparação com as ideias originais

O Projeto.md contempla todas as áreas principais de MinhasIdeias.md: jogo e estudo, orientação reformada com comparação arminiana, traduções, IA, pessoas em ordem alfabética, estatísticas, assuntos e aplicação cotidiana. RPG, monetização, planos para igrejas e arquitetura são acréscimos da proposta da IA, ainda sujeitos a decisão.

## Melhorias de escopo

- A experiência central é ler, compreender, responder, refletir e praticar. O conteúdo não deve ser apenas um catálogo de ferramentas.
- XP representa atividades de aprendizado. Não pontuar fé, santidade ou valor espiritual, nem usar competição espiritual como incentivo.
- Distinguir texto bíblico, interpretação confessional e aplicação. Mostrar referências e reconhecer diferenças internas das tradições.
- Oferecer formatos de leitura, quiz e reflexão desde o início; áudio, mapas e turmas ficam para etapas posteriores.
- Identificar edição e autorização de cada tradução antes de distribuir seu texto. Comparadores e estatísticas dependem dos corpora efetivamente disponíveis.
- Contagens devem informar tradução, corpus, tratamento de acentos, flexões e palavras compostas. Ranking de palavras e ranking de assuntos são recursos distintos; assuntos exigem classificação editorial.
- IA deve citar referências verificáveis, identificar sua perspectiva, admitir incerteza e evitar fabricar citações. Chaves ficam em um servidor, com limites de uso e custo. A integração ainda não existe.
- Evitar promessa de IA ilimitada antes de conhecer custos. Não é necessário começar com vários servidores, Redis e Elasticsearch.

## O que está implementado

Protótipo estático em index.html, style.css e app.js: seis estudos introdutórios, quizzes com explicação, progresso e reflexões em localStorage, oito perfis bíblicos, seis temas cotidianos, comparação teológica resumida e pesquisa exata nos resumos das lições. Os estudos podem ser feitos em qualquer ordem. Acertos repetidos não acumulam XP.

Abra index.html no navegador ou pelo Live Server. Não há instalação de dependências. As fontes Google são opcionais; o layout tem fontes de reserva. Progresso e notas pertencem a este navegador e origem; não há conta, sincronização ou backup. Trocar entre arquivo local e Live Server pode apresentar um progresso diferente.

Esta versão é uma amostra funcional, não o produto completo. A trilha salta entre períodos e não cobre ainda toda a Bíblia. Não contém leitor bíblico, comparação de traduções, IA, estatísticas bíblicas completas, áudio ou multiplayer.

## Atualização: leitor integrado (15/10/2026)

A Bíblia Livre completa já está incluída localmente, com 66 livros e navegação por capítulo. As seis lições possuem leitores internos com os trechos indicados destacados. Funciona offline com os arquivos do projeto. Veja FONTES-BIBLICAS.md para edição, atribuição, licença e origem. As menções acima ao leitor como recurso futuro descrevem o protótipo anterior. Comparador, IA e estatísticas bíblicas completas continuam pendentes.

## Próximos marcos

1. Validar a experiência e revisar editorialmente as lições e sínteses teológicas.
2. Escolher um corpus bíblico autorizado, registrar edição e permissões e implementar leitor/comparador com dados reais.
3. Acrescentar servidor para IA, segredos, limites e checagem das referências; escolher um provedor inicialmente.
4. Expandir a cronologia, os perfis, formatos de estudo e temas; adicionar pesquisa no corpus completo e estatísticas reproduzíveis.
5. Implementar contas, exportação de notas, sincronização e, depois, acompanhamento de turmas com consentimento.

A arquitetura inicial pode permanecer simples. Framework, banco e hospedagem serão escolhidos conforme as necessidades de conta e servidor, sem impor toda a arquitetura sugerida antes da validação.
