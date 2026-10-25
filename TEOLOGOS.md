# Teólogos e suas contribuições

Seção “Teólogos” no menu principal. Seleção introdutória de 18 autores, organizada inicialmente pela ordem de nascimento, com alternativa alfabética. Busca por nome, nome alternativo, obra, tema e ideia; filtros por tradição e época. O retorno ao catálogo preserva busca, filtros e ordenação.

Cada perfil contém datas, região, contexto histórico, temas, ideias explicadas, principais obras comentadas, uma observação de leitura crítica e uma pergunta de estudo. Passagens relacionadas abrem o leitor ARA existente, e autores com temas em comum podem ser visitados diretamente. Calvino, Armínio e Wesley têm um atalho para o painel comparativo já existente. Obras são referências bibliográficas comentadas, não arquivos integrais incluídos no jogo.

## Seleção e critérios

Atanásio, Agostinho, Anselmo, Tomás de Aquino, Lutero, Calvino, Armínio, Owen, Edwards, Wesley, Hodge, Kuyper, Bavinck, Berkhof, Barth, Bonhoeffer, Stott e Sproul. A seleção não é exaustiva nem um ranking de autoridade. Tem ênfase reformada, mas também permite conhecer a patrística, a teologia medieval, o luteranismo, o arminianismo/wesleyanismo e o evangelicalismo anglicano.

As ideias são atribuídas ao autor. Não são apresentadas como equivalentes entre si nem como prova automática do ensino bíblico. A classificação por tradição é introdutória: autores patrísticos antecedem as denominações modernas, e um pensador como Barth não equivale à ortodoxia reformada clássica. Armínio não é reduzido a pelagianismo, e os cinco pontos posteriores não são tratados como resumo completo de Calvino. As passagens sugeridas são pontos de investigação em contexto.

As sínteses em português são originais, sem reprodução integral das obras, e os títulos podem variar entre traduções. Não foram atribuídas citações literais sem comprovação. Datas aproximadas são marcadas quando necessário. A pergunta em cada perfil é um convite de estudo, sem quiz, gabarito ou XP.

## Fontes consultadas em 16/10/2026

Links diretos aparecem nas fichas:

- Christian Classics Ethereal Library (CCEL): perfis e catálogos de obras dos autores clássicos, de Atanásio a Berkhof.
- [Bavinck Institute, Calvin Theological Seminary](https://bavinckinstitute.org/) e sua [bibliografia](https://bavinckinstitute.org/resources/herman-bavinck-bibliography/).
- [Center for Barth Studies — teologia](https://kbarth.org/theology/) e [biografia](https://barth.ptsem.edu/biography/).
- [International Bonhoeffer Society — biografia](https://bonhoeffersociety.org/about/bonhoeffer/biography/).
- [John Stott — biografia oficial](https://johnstott.org/life/).
- [Ligonier Ministries — Sproul e suas obras](https://learn.ligonier.org/teachers/rc-sproul).
- [Yale — Edwards e a escravidão](https://ysrp.yale.edu/jonathan-edwards), para a contextualização histórica adicional do perfil.

## Arquivos e validação

`theologians-data.js`: conteúdo com IDs estáveis, temas, pares de título/explicação e passagens estruturadas. `theologians-ui.js`: catálogo e perfis. `theologians.css`: apresentação responsiva. Os três recursos entram no índice e no gerador portátil habitual.

Após alterações: `node refresh-assets.cjs`, `node build-offline.cjs`. Testes: `node verify-theologians.cjs` e `node verify-theologians-browser.cjs`. O teste no Chrome usa perfil temporário isolado e verifica os 18 perfis, obras, busca sem acentos, pesquisa por obra, filtros, ordenação, retorno, leitores ARA, comparação e autores relacionados em largura de celular.

Conteúdo, busca e fichas funcionam offline. Referências externas e leitura de livros ainda não incluídos na ARA local exigem internet. Consultas não mudam notas, retomada, conclusões, XP, emblemas ou saves; não há alteração no Supabase.
