## Escopo vigente: somente ARA como base local

Decisão do usuário em 15/10/2026: aprovar o uso da Almeida Revista e Atualizada (ARA) e encerrar o trabalho nas outras traduções locais. A revisão manual dos avisos é opcional e não bloqueia o avanço do projeto. Isso não é uma declaração de revisão editorial completa nem uma licença de redistribuição.

O jogo carrega apenas `ara-data.js`: Gênesis 1–50, 1.533 versículos. O leitor começa na ARA e abre esse conteúdo em tela inteira, sem internet. Livros ainda não convertidos e outras versões continuam no Bible.com, com internet. Estatísticas e ranking locais usam somente Gênesis/ARA, com o escopo indicado; não são totais da Bíblia inteira. BLIVRE e ONBV não são carregadas pelo índice nem incluídas no pacote portátil. Arquivos históricos de origem permanecem no diretório; notas antigas são preservadas nos saves e backups.

Gerar: `python extract-genesis-book.py`, `python build-ara-data.py`, `python build-genesis-review.py`, `node refresh-assets.cjs`, `node build-offline.cjs`. A conferência geral e a revisão opcional trabalham apenas com ARA (78 avisos). O pacote portátil tem aproximadamente 0,6 MB. As imagens e ferramentas editoriais não entram no jogo.

Origem local: PDF multiversões fornecido pelo usuário, SHA256 `60e90aa58ba40d2263191c9238d57b679b3da03f1f8458481c0df402f1a12fa9`, primeira coluna (ARA), páginas físicas 4–181. PyMuPDF 1.28.2. Estrutura de 50 capítulos validada; Gênesis 1 coincide com o piloto ajustado. A compilação do PDF não identifica de forma suficiente a edição editorial exata e respectivas permissões; isso continua registrado em ANALISE-PDF.md para uma futura distribuição pública.

As seções anteriores/abaixo são histórico e ficam substituídas por este escopo quando houver divergência.

# Gênesis completo — extração experimental

Abra `genesis-completo.html` diretamente no navegador. Os dados estão incluídos na página: funciona offline e permite escolher cinco versões, 50 capítulos e avançar/voltar. O piloto anterior de Gênesis 1 continua disponível em `conferencia.html`.

## Verificação estrutural

- 178 páginas físicas examinadas, desde a página 4 até a abertura de Êxodo.
- 50 capítulos por tradução, 1.533 versículos por tradução, 7.665 registros no total.
- 250 verificações de sequência aprovadas, sem números de versículos ausentes, duplicados ou texto vazio.
- Títulos fragmentados de Gênesis 32 (ACF) e 49 (A21) foram reconhecidos sem depender de espaços entre fragmentos.

Os totais esperados são uma referência estrutural declarada no script. Não comparam o conteúdo com uma edição editorial independente nem demonstram fidelidade palavra por palavra.

## Qualidade do texto

O extrator passou de pypdf para PyMuPDF 1.28.2, que recompõe os caracteres e seus espaços com mais precisão neste PDF. Houve mudanças apenas de espaçamento em 3.815 versículos: a sequência de letras, números e pontuação é idêntica à extração anterior em todos os 7.665 registros. Não foram usadas substituições por dicionário nem modernização de grafia.

Os 155 textos de Gênesis 1 coincidem exatamente com o piloto que recebeu ajustes pontuais. Isso é um teste de regressão, não uma revisão independente da edição. Uma inspeção visual da página física 4 confirmou exemplos de palavras recompostas como “firmamento”, “águas”, “sobre”, “fez” e “Faça-se”. A imagem está em `amostra-pagina-4.png`.

Os avisos conservadores caíram de 6.088 para 604 registros com múltiplos fragmentos. Eles não representam erros confirmados nem garantem que os demais estejam perfeitos. A página permite expandir essas linhas e mostra a página física de origem. Ainda falta revisão editorial contra uma fonte independente. A extração não deve alimentar contagens oficiais de palavras nem ser tratada como edição revisada.

## Arquivos e reprodução

`genesis-completo.json`: texto, capítulos, versículos, páginas de origem e avisos. `validacao-genesis.json`: relatório das verificações. `fragmentos-genesis-mupdf.json`: cache atual com coordenadas e hash do PDF. `fragmentos-genesis.json`: cache anterior do pypdf, preservado. `genesis-template.html`: interface antes da inclusão dos dados. `genesis-antes-revisao.json`: extração anterior preservada. `revisao-espacamento-genesis.json`: cada mudança com antes/depois e páginas de origem.

Dependências de análise estão em `requirements-pdf.txt` (instalação local existente em `.pdf-analysis-tools`). Execute `python extract-genesis-book.py` na pasta do projeto para reproduzir. O cache só é aceito se o hash do PDF coincidir. O script interrompe a geração caso a estrutura falhe, haja mudanças além de espaços ou o capítulo 1 deixe de coincidir com o piloto. Para testar estrutura, alterações e navegação simulada, execute `node verify-genesis-book.cjs`.

Esta conversão continua separada do jogo. Leitor, saves, estatísticas e pacote offline do jogo não foram modificados. A próxima etapa é a revisão textual contra o PDF e uma fonte confiável da edição, antes de ampliar a conversão ou integrar os dados.
