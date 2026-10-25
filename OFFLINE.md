## Escopo vigente: somente ARA como base local

Decisão do usuário em 15/10/2026: aprovar o uso da Almeida Revista e Atualizada (ARA) e encerrar o trabalho nas outras traduções locais. A revisão manual dos avisos é opcional e não bloqueia o avanço do projeto. Isso não é uma declaração de revisão editorial completa nem uma licença de redistribuição.

O jogo carrega apenas `ara-data.js`: Gênesis 1–50, 1.533 versículos. O leitor começa na ARA e abre esse conteúdo em tela inteira, sem internet. Livros ainda não convertidos e outras versões continuam no Bible.com, com internet. Estatísticas e ranking locais usam somente Gênesis/ARA, com o escopo indicado; não são totais da Bíblia inteira. BLIVRE e ONBV não são carregadas pelo índice nem incluídas no pacote portátil. Arquivos históricos de origem permanecem no diretório; notas antigas são preservadas nos saves e backups.

Gerar: `python extract-genesis-book.py`, `python build-ara-data.py`, `python build-genesis-review.py`, `node refresh-assets.cjs`, `node build-offline.cjs`. A conferência geral e a revisão opcional trabalham apenas com ARA (78 avisos). O pacote portátil tem aproximadamente 0,6 MB. As imagens e ferramentas editoriais não entram no jogo.

Origem local: PDF multiversões fornecido pelo usuário, SHA256 `60e90aa58ba40d2263191c9238d57b679b3da03f1f8458481c0df402f1a12fa9`, primeira coluna (ARA), páginas físicas 4–181. PyMuPDF 1.28.2. Estrutura de 50 capítulos validada; Gênesis 1 coincide com o piloto ajustado. A compilação do PDF não identifica de forma suficiente a edição editorial exata e respectivas permissões; isso continua registrado em ANALISE-PDF.md para uma futura distribuição pública.

As seções anteriores/abaixo são histórico e ficam substituídas por este escopo quando houver divergência.

# Edição portátil sem computador — leitor Bible.com

`Discipulo-de-Jesus-offline.html` reúne os scripts, estilos e textos locais num único arquivo de aproximadamente 9,4 MB. Os scripts ficam depois do corpo da página para respeitar a inicialização do DOM. Não depende de servidor, CSS externo ou fontes Google. Para recriar após mudanças: `node build-offline.cjs`.

Baixe o arquivo no celular enquanto o servidor estiver ligado. Abra o arquivo baixado usando um navegador capaz de executar JavaScript em arquivos HTML locais. Antes de desligar o PC, ative o modo avião e confirme que o arquivo abre e navega entre os estudos. O endereço 192.168... sozinho não passa a funcionar offline: é necessário guardar o arquivo.

A abertura de HTML local depende do aparelho e do aplicativo escolhido. Alguns gerenciadores mostram somente uma prévia e não executam o jogo; no iPhone, a prévia de arquivos HTML não equivale a um aplicativo web instalado. Esta edição ainda não é um APK nem um PWA instalado. Para instalação confiável em todos os aparelhos, o próximo caminho é hospedagem HTTPS com modo offline ou empacotamento para a plataforma escolhida.

A leitura usa exclusivamente o Bible.com, com o mesmo seletor de versões da edição principal. Ela precisa da conexão do celular, mas não do computador. A antiga substituição por BLIVRE no leitor foi removida, inclusive do gerador; não há fallback de tradução. Quando o navegador informa ausência de rede, o botão explica a necessidade de conexão em vez de abrir uma tela vazia.

Pesquisa, lições, trilha temática, perfil de Abraão e conquistas estão incluídos no arquivo. Os corpora BLIVRE e ONBV continuam somente como fontes explicitamente identificadas da pesquisa de palavras. Suas contagens não se referem à versão escolhida no Bible.com. Progresso e notas ficam no armazenamento permitido pelo navegador e podem estar separados do teste por endereço IP; se o aparelho bloquear armazenamento local, a interface informa a limitação.

Para receber a correção, baixe novamente `Discipulo-de-Jesus-offline.html`. Um arquivo já baixado não se atualiza sozinho. O nome foi mantido para compatibilidade, mas a interface agora se apresenta como “Edição portátil” e informa que a leitura bíblica precisa de internet. Guarde a cópia anterior se ela contiver progresso: o acesso às notas por arquivo local depende do navegador, e mudar o caminho do arquivo pode alterar o armazenamento associado. Não há transferência automática de progresso entre cópias.

Os arquivos e corpora mantêm suas atribuições: BLIVRE, © 2018 Diego Santos, Mario Sérgio e Marco Teles, distribuição eBible porbr2018 sob CC BY 4.0; Biblica® Open Nova Bíblia Viva™, © 2007, 2010 Biblica, Inc., CC BY-SA 4.0. O trabalho original desta última está disponível em biblica.com e open.bible. Os avisos completos já incluídos nos módulos e no projeto permanecem nesta distribuição; o texto ONBV é usado nas pesquisas, sem alteração dos versículos.
