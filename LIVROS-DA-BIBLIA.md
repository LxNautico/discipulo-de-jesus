# Livros da Bíblia

A seção “Livros da Bíblia” apresenta os 66 livros do cânon protestante, em ordem bíblica. Pesquisa por nome, autoria ou tema, com filtros por testamento e grupo. As fichas preservam os filtros ao voltar à lista.

Cada ficha apresenta autoria, época e local de escrita, destinatários, gênero, idiomas, contexto, propósito, temas, roteiro literário, uma passagem sugerida, conexão com a história da redenção e perguntas de estudo. A introdução é uma síntese: não é um comentário versículo por versículo nem reproduz uma Bíblia de estudo comercial.

## Critérios editoriais

As atribuições tradicionais são identificadas. Autores desconhecidos não foram preenchidos com suposições: Hebreus não é apresentado como carta comprovadamente paulina, os Salmos têm vários autores e a data de Jó permanece indeterminada. Uma data do acontecimento narrado não é automaticamente a data de redação. Datas de ministério são identificadas como tais. Propostas divergentes aparecem em linguagem resumida, particularmente em livros cuja autoria ou composição são debatidas.

A perspectiva cristã do projeto aparece na seção “O livro na história da redenção”. Trata-se de interpretação cristã, não de identificação de autor ou data. As fichas não tentam forçar divergências reformadas/arminianas em assuntos que não exigem essa comparação. A categorização literária é introdutória; livros podem conter vários gêneros.

Fontes consultadas em 16/10/2026: introduções públicas da **Crossway, ESV Global Study Bible**, para os 66 livros, e **Logos, Faithlife Study Bible**, como referência complementar para Isaías, Daniel e Efésios. Os textos em português são sínteses próprias, sem transcrição das introduções ou de versículos de outra tradução. Há links diretos às fontes em cada ficha; as fontes da Crossway estão em inglês e não mudam a tradução ARA usada pelo leitor do jogo.

Exemplos de referências consultadas:

- [Gênesis — Crossway](https://www.esv.org/resources/esv-global-study-bible/introduction-to-genesis/)
- [Hebreus — Crossway](https://www.esv.org/resources/esv-global-study-bible/introduction-to-hebrews/)
- [Salmos — Crossway](https://www.esv.org/resources/esv-global-study-bible/introduction-to-the-psalms/)
- [Daniel — Faithlife](https://biblia.com/books/fsb/article/SIDEBAR.INTRODUCTIONTODANIEL)
- [Isaías — Faithlife](https://biblia.com/books/fsb/article/SIDEBAR.INTRODUCTIONTOISAIAH)

## Arquivos e atualização

`books-content.txt` guarda o conteúdo editorial em campos separados por `|`. `build-books-data.py` valida a ordem contra `bible-catalog.js`, a presença das fontes e os capítulos dos roteiros, gerando `books-data.js`. `books-ui.js` implementa diretório e fichas; `books.css` ajusta o layout para computador e celular.

`fetch-book-references.py` consulta as páginas públicas e mantém referências de desenvolvimento em `.book-reference-cache`, fora do índice e da distribuição portátil. O gerador de dados usa esse índice; consultar fontes novamente é uma operação editorial explícita, não algo que o navegador do jogador faz.

Após editar conteúdo: `python build-books-data.py`, `node refresh-assets.cjs`, `node build-offline.cjs`. Testes: `node verify-books.cjs` e `node verify-books-browser.cjs`. O segundo utiliza Chrome em perfil temporário e verifica os 66 livros, filtros, retorno à busca, roteiros, capítulo selecionado e largura de celular.

## Leitor e progresso

Os botões “Ler desde o início”, “Passagem para começar” e os itens do roteiro abrem o leitor existente com livro e capítulo corretos. ARA de Gênesis funciona localmente; demais livros usam Bible.com com internet. As introduções completas, busca e filtros funcionam offline no portátil. Os links às fontes exigem internet.

Consultar fichas não altera XP, estudos concluídos, notas ou retomada. Não há novas chaves de save nem alterações no Supabase. A edição portátil inclui conteúdo, interface e estilos da seção.
