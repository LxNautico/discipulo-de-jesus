# Avaliação do PDF multiversões

## Arquivo

O PDF adicionado pelo usuário tem 57.557.452 bytes e é idêntico ao `multiversoes-original.pdf` baixado do item do Internet Archive: ambos têm SHA256 `60e90aa58ba40d2263191c9238d57b679b3da03f1f8458481c0df402f1a12fa9`.

Possui 4.019 páginas e não está criptografado. Os metadados registram Microsoft Word para Microsoft 365 como criador/produtor e criação em 27/03/2023. Foram inspecionadas amostras da capa, páginas iniciais, Gênesis, Êxodo e esclarecimento final; não foi validada a integridade de todos os livros e versículos.

## Diferença importante em relação ao EPUB

O PDF possui camada de texto digital extraível, com posições e fontes. Não precisa passar por OCR para recuperar essas amostras. O EPUB, por outro lado, foi produzido pelo Internet Archive a partir de OCR derivado das páginas e perde parte da qualidade do texto original.

Nas páginas examinadas, a disposição contém cinco colunas: ARA, ACF, NBV, A21 e TB. A extração em modo layout preserva essa organização visual. A extração simples concatena horizontalmente as versões e, portanto, não deve ser usada diretamente como texto de uma tradução.

Ainda há dificuldades de extração tipográfica, incluindo palavras divididas artificialmente, títulos e cabeçalhos repetidos e números de versículo com estilos próprios. O sumário também não deve ser tratado como fonte infalível: por exemplo, o número de página associado a Atos aparece menor que o de João na extração examinada. Um importador precisa validar a estrutura real das páginas.

## Caminho técnico recomendado

1. Fazer uma extração piloto de um capítulo nas cinco colunas, aproveitando coordenadas dos fragmentos de texto.
2. Separar cabeçalhos, títulos, texto e números de versículo, sem inventar correções de conteúdo.
3. Conferir o texto e a sequência de versículos contra uma fonte confiável da edição identificada.
4. Somente após essa validação, ampliar a conversão para livros e construir dados estruturados e relatórios de lacunas/duplicações.

O PDF é candidato tecnicamente melhor que o EPUB. Isso não significa que já exista um corpus pronto ou que suas contagens seriam confiáveis sem as etapas acima.

## Origem e condições de uso

A listagem do Internet Archive identifica o PDF como arquivo original e o EPUB, os arquivos TXT, hOCR e XML como derivados. Não havia valores nos campos públicos de licença (`licenseurl`), direitos (`rights`) ou editora (`publisher`) consultados.

O esclarecimento final do PDF explica a compilação por cópia de capítulos de sites e a finalidade de leitura paralela. Também afirma respeito a direitos autorais mediante informação das editoras. Esse texto não apresenta, por si só, uma autorização individual verificável dos titulares para redistribuir todas as traduções num aplicativo. Edições específicas e respectivas permissões ainda precisam ser identificadas antes de publicar os textos no jogo.

## Resultado

Recomendação: usar o PDF para uma prova de extração por colunas, em vez de converter o EPUB por OCR. Nenhuma tradução deste PDF foi incorporada ao jogo. O leitor e as estatísticas existentes permanecem como estavam.
