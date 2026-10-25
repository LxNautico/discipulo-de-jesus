## Escopo vigente: somente ARA como base local

Decisão do usuário em 15/10/2026: aprovar o uso da Almeida Revista e Atualizada (ARA) e encerrar o trabalho nas outras traduções locais. A revisão manual dos avisos é opcional e não bloqueia o avanço do projeto. Isso não é uma declaração de revisão editorial completa nem uma licença de redistribuição.

O jogo carrega apenas `ara-data.js`: Gênesis 1–50, 1.533 versículos. O leitor começa na ARA e abre esse conteúdo em tela inteira, sem internet. Livros ainda não convertidos e outras versões continuam no Bible.com, com internet. Estatísticas e ranking locais usam somente Gênesis/ARA, com o escopo indicado; não são totais da Bíblia inteira. BLIVRE e ONBV não são carregadas pelo índice nem incluídas no pacote portátil. Arquivos históricos de origem permanecem no diretório; notas antigas são preservadas nos saves e backups.

Gerar: `python extract-genesis-book.py`, `python build-ara-data.py`, `python build-genesis-review.py`, `node refresh-assets.cjs`, `node build-offline.cjs`. A conferência geral e a revisão opcional trabalham apenas com ARA (78 avisos). O pacote portátil tem aproximadamente 0,6 MB. As imagens e ferramentas editoriais não entram no jogo.

Origem local: PDF multiversões fornecido pelo usuário, SHA256 `60e90aa58ba40d2263191c9238d57b679b3da03f1f8458481c0df402f1a12fa9`, primeira coluna (ARA), páginas físicas 4–181. PyMuPDF 1.28.2. Estrutura de 50 capítulos validada; Gênesis 1 coincide com o piloto ajustado. A compilação do PDF não identifica de forma suficiente a edição editorial exata e respectivas permissões; isso continua registrado em ANALISE-PDF.md para uma futura distribuição pública.

As seções anteriores/abaixo são histórico e ficam substituídas por este escopo quando houver divergência.

# Fila de revisão

Abra `revisao-genesis.html` no navegador. A leitura completa também tem um link para a fila. São 604 versículos sinalizados; não são 604 erros confirmados nem uma revisão de todos os versículos de Gênesis.

1. Escolha a tradução, se desejar. O filtro inicial mostra os pendentes.
2. Compare o texto com a coluna do PDF à direita. Use “Ampliar imagem” para ver melhor. Se o versículo atravessar páginas, escolha a outra página no seletor.
3. Se estiver correto, clique em “Confirmar revisão”. Se precisar ajustar, edite o campo, anote o motivo e confirme. A ferramenta registra “conferido” ou “com correção”.
4. No filtro de pendentes, confirmar abre o próximo trecho. Use os filtros de conferidos/corrigidos para revisitar decisões.
5. Exporte a revisão em JSON ao terminar cada sessão.

Editar o texto ou a anotação salva imediatamente um rascunho e torna a revisão pendente. Um rascunho vazio pode ser guardado, mas não confirmado. “Marcar como pendente” mantém o texto e a anotação para retrabalhar, sem excluir o histórico original.

## Onde ficam os dados

O navegador guarda as decisões em uma chave própria de localStorage, vinculada ao hash do PDF, sem contato com o Supabase. Abrir em outro navegador, endereço ou caminho de arquivo pode usar outro armazenamento. Se o navegador impedir o salvamento, aparece uma mensagem; exporte antes de fechar. A importação valida o PDF e o texto original de cada item antes de modificar o estado. Entradas novas são unidas; em conflitos, prevalece a decisão já existente neste navegador, com aviso da quantidade. Guarde o arquivo importado para comparar conflitos.

O arquivo exportado contém o texto original, a proposta de correção, a situação, a anotação e a data da última edição. A ferramenta não mantém todas as versões intermediárias da digitação. Não altera o corpus, a leitura do jogo, XP, conquistas, saves ou sincronização. Aplicar as correções será uma etapa separada.

## Uso offline e reprodução

A página inclui scripts e dados; as imagens estão em `imagens-revisao`. Mantenha essa pasta ao lado do HTML. O PDF completo fica um nível acima e tem um link opcional. A revisão não precisa de servidor nem de internet; as imagens não dependem do leitor de PDF do navegador.

Execute `python build-genesis-review.py` para gerar a página e as colunas. Imagens existentes do mesmo PDF são reaproveitadas. Dependências em `requirements-pdf.txt`.

Testes: `node verify-genesis-review.cjs` (estados, validação/importação, conflitos, cobertura das imagens) e `node verify-genesis-review-browser.cjs` (Chrome com perfil temporário, dados de teste isolados). O segundo teste requer Chrome no caminho declarado no script e pode precisar de execução fora do ambiente restrito. O jogo não é aberto nem recebe dados de teste.
