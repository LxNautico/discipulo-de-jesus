# Piloto de Gênesis 1

Abra `conferencia.html` diretamente no navegador e escolha ARA, ACF, NBV, A21 ou TB. Funciona sem servidor e sem internet.

Extração das páginas físicas 4–7 do PDF original, por coordenadas horizontais e estilo dos números de versículo. Cada versão contém a sequência 1–31, sem duplicações ou lacunas estruturais: 155 registros. O início de Gênesis 2 é excluído por sua posição vertical. Cabeçalhos e títulos são excluídos por tamanho/posição.

`genesis-1.json` contém o capítulo estruturado e as páginas de origem de cada versículo. `extracao-bruta.json` preserva a extração anterior aos ajustes pontuais de espaços; `ajustes-de-espacamento.json` registra cada ajuste. Não foram modernizadas grafias nem harmonizadas diferenças entre versões. A sequência foi verificada automaticamente; isso não comprova fidelidade editorial de cada palavra à edição original. Falta revisão independente e identificação exata das edições.

Reproduzir a partir da pasta do projeto: `python extract-genesis-pilot.py`. Requer a instalação local existente de pypdf em `.pdf-analysis-tools`. O script é específico para esse capítulo e esse PDF; não deve ser usado como conversor geral.

O teste está separado do jogo e não muda leitura, pesquisa, saves ou distribuição offline. Antes de integrar ou distribuir um corpus completo, ainda é necessário validar a qualidade da conversão e verificar as condições de uso de cada edição.
