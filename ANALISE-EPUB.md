# Avaliação do EPUB multiversões

Arquivo analisado: `Bíblia Sagrada - Multi-Versões em Português [Almeida Revista e Atualizada ARA,  Almeida Corrigida Fiel ACF, Nova Bíblia Viva NBV, Almeida Século 21 A21, Tradução Brasileira TB] 2023.epub`.

## Conteúdo e origem

- Tamanho: 8.726.829 bytes, cerca de 8,3 MiB.
- Formato: EPUB 3, com 4.030 entradas no contêiner ZIP.
- O título, o índice e as amostras identificam cinco traduções: ARA, ACF, NBV, A21 e TB. Não foi verificada a integridade de todos os livros e versículos de cada tradução.
- Os metadados apontam para uma digitalização disponibilizada pelo Internet Archive; a data de modificação do EPUB é 11/08/2025, embora o título mencione 2023.
- `EPUB/notice.html` informa conversão automática de páginas escaneadas por OCR, com possibilidade de caracteres, palavras, ordem de leitura e estruturas incorretos. O próprio OPF repete o aviso de reconhecimento automático.

## Adequação técnica

As amostras `page_3.html`, `page_180.html`, `page_332.html`, `page_444.html` e `page_597.html` apresentam trechos de várias traduções no mesmo arquivo, com nomes das versões repetidos e números de página misturados ao texto. Há exemplos de palavras coladas e números de versículos confundidos com outros caracteres.

Isso é diferente de um corpus estruturado em tradução → livro → capítulo → versículo. Uma conversão automática simples arriscaria associar texto à versão errada, incorporar cabeçalhos na pesquisa, perder numeração e produzir contagens incorretas. É possível desenvolver uma extração experimental, mas ela exigiria validação contra fontes confiáveis de cada edição antes de sustentar leitura e estatísticas do jogo.

## Recomendação

A busca nos arquivos HTML encontrou ocorrências de palavras como “licença” e “reprodução” em passagens bíblicas, sem identificar nelas uma licença de redistribuição do EPUB. Os metadados e páginas iniciais examinados também não apresentaram uma autorização explícita para integrar todas as traduções em outro aplicativo. Isso não prova ausência de autorização fora do arquivo; apenas significa que ela não foi demonstrada pelo material analisado.

Não substituir o leitor Bible.com nem as estatísticas por esse OCR sem revisão. Usar o EPUB como material de consulta enquanto se procura uma fonte digital estruturada com edição e condições de redistribuição identificadas. Os avisos e metadados da digitalização, isoladamente, não estabelecem a autorização de cada titular para distribuir todas as cinco traduções no aplicativo.

O EPUB foi apenas inspecionado; seu conteúdo não foi incorporado ao jogo e o arquivo original não foi alterado.
