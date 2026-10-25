"""Atualização pontual do escopo aprovado; não modifica saves."""
from pathlib import Path
ROOT=Path(__file__).resolve().parent
def update(name,changes):
    p=ROOT/name
    text=p.read_text(encoding='utf-8')
    for old,new in changes:
        text=text.replace(old,new)
    p.write_text(text,encoding='utf-8')
update('word-study.js',[
 ("[{id:'por_blj',name:'Bíblia Livre (BLIVRE)',data:window.BIBLE_DATA},{id:'por_onbv',name:'Open Nova Bíblia Viva (ONBV)',data:window.BIBLE_ONBV}]","[{id:'ara',name:'ARA · Gênesis',data:window.BIBLE_ARA}]"),
 ('FONTES LOCAIS DE CONTAGEM','ARA · CONTAGEM LOCAL'),
 ('Contagens e ranking usam apenas BLIVRE e ONBV. Não são contagens da ARA, ARC, NAA, NVI ou NTLH. A leitura e a pesquisa visual continuam no Bible.com.','Contagens e ranking da ARA, somente em Gênesis 1–50. Outros livros ainda não estão incluídos. Outras versões podem ser consultadas online no Bible.com.'),
 ('Pesquisar na Bíblia inteira','Pesquisar em Gênesis'),
 ('” na Bíblia</h2>','” em Gênesis · ARA</h2>'),
 ('As contagens usam os textos locais de cada edição, sem títulos, notas ou referências editoriais.','As contagens abrangem apenas os 1.533 versículos de Gênesis na ARA, sem títulos, notas ou referências editoriais. Não são totais da Bíblia inteira.'),
 ('O leitor abre o capítulo correspondente na sua versão online preferida; texto e numeração podem diferir.','O leitor abre o mesmo capítulo na ARA local. Outras versões estão disponíveis online no Bible.com.')])
update('backup-engine.js',[(r':por_(?:blj|onbv):',r':(?:ara|por_(?:blj|onbv)):')])
update('bible-search.js',[
 ('As contagens locais e o ranking de palavras foram retirados: ainda não temos uma integração que forneça esses números nas versões selecionadas.','As contagens locais e o ranking usam somente a ARA de Gênesis; não representam a Bíblia inteira nem as outras versões online.'),
 ('Ver contagens e ranking em fontes locais →','Ver contagens da ARA em Gênesis →')])
p=ROOT/'index.html'
text=p.read_text(encoding='utf-8')
import re
text=re.sub(r'<script src="bible-(?:data|onbv-data)\.js[^\"]*" defer></script>','',text)
if 'src="ara-data.js' not in text:
    text=text.replace('<script src="ara-reader.js','<script src="ara-data.js" defer></script><script src="ara-reader.js',1)
text=re.sub(r'<details><summary>Fontes das estatísticas</summary>.*?</details>',
 '<details><summary>Fonte bíblica</summary><p>Almeida Revista e Atualizada (ARA): Gênesis 1–50 incluído localmente a partir do PDF multiversões fornecido pelo usuário. Conversão com espaçamento ajustado; sem revisão editorial independente completa. Leitura local e contagens limitadas a Gênesis. Demais livros e outras versões: <a href="https://www.bible.com/pt/bible/1608/GEN.1" target="_blank" rel="noopener noreferrer">Bible.com / YouVersion</a>.</p></details>',text,flags=re.S)
p.write_text(text,encoding='utf-8')
update('build-offline.cjs',[
 ('A leitura da Bíblia usa somente o Bible.com, na versão escolhida, e precisa da internet do celular. Não há tradução substituta offline. A pesquisa também usa o Bible.com e precisa de internet.','A leitura da ARA em Gênesis e suas contagens funcionam sem internet. Outros livros, traduções e a pesquisa no Bible.com precisam da internet do celular.')])
update('verify-genesis-book.cjs',[
 ('report.checks.length,250','report.checks.length,50'),('revision.pilotMatches,155','revision.pilotMatches,31'),
 ('elements.version.children.length,5','elements.version.children.length,1'),('250 capítulos/versões, 7.665 registros','50 capítulos, 1.533 registros'),('155 textos iguais','31 textos iguais')])
update('verify-genesis-review.cjs',[('604','78')])
update('verify-genesis-review-browser.cjs',[('604','78')])
update('verify-ara.cjs',[("includes('/1840/')","includes('/1608/')")])
update('verify-words.cjs',[
 ("[['bible-data.js','BIBLE_DATA'],['bible-onbv-data.js','BIBLE_ONBV']]","[['ara-data.js','BIBLE_ARA']]"),
 ("idx.words.get('fé').count","(idx.words.get('fé')?.count||0)"),
 ("idx.words.get('fé').matches.reduce((n,m)=>n+m.count,0)","(idx.words.get('fé')?.matches||[]).reduce((n,m)=>n+m.count,0)"),
 ("idx.words.get('fé').matches.length","(idx.words.get('fé')?.matches.length||0)")])
scope='''## Escopo vigente: somente ARA como base local

Decisão do usuário em 15/10/2026: aprovar o uso da Almeida Revista e Atualizada (ARA) e encerrar o trabalho nas outras traduções locais. A revisão manual dos avisos é opcional e não bloqueia o avanço do projeto. Isso não é uma declaração de revisão editorial completa nem uma licença de redistribuição.

O jogo carrega apenas `ara-data.js`: Gênesis 1–50, 1.533 versículos. O leitor começa na ARA e abre esse conteúdo em tela inteira, sem internet. Livros ainda não convertidos e outras versões continuam no Bible.com, com internet. Estatísticas e ranking locais usam somente Gênesis/ARA, com o escopo indicado; não são totais da Bíblia inteira. BLIVRE e ONBV não são carregadas pelo índice nem incluídas no pacote portátil. Arquivos históricos de origem permanecem no diretório; notas antigas são preservadas nos saves e backups.

Gerar: `python extract-genesis-book.py`, `python build-ara-data.py`, `python build-genesis-review.py`, `node refresh-assets.cjs`, `node build-offline.cjs`. A conferência geral e a revisão opcional trabalham apenas com ARA (78 avisos). O pacote portátil tem aproximadamente 0,6 MB. As imagens e ferramentas editoriais não entram no jogo.

Origem local: PDF multiversões fornecido pelo usuário, SHA256 `60e90aa58ba40d2263191c9238d57b679b3da03f1f8458481c0df402f1a12fa9`, primeira coluna (ARA), páginas físicas 4–181. PyMuPDF 1.28.2. Estrutura de 50 capítulos validada; Gênesis 1 coincide com o piloto ajustado. A compilação do PDF não identifica de forma suficiente a edição editorial exata e respectivas permissões; isso continua registrado em ANALISE-PDF.md para uma futura distribuição pública.

As seções anteriores/abaixo são histórico e ficam substituídas por este escopo quando houver divergência.

'''
for name in ['Plano.md','FONTES-BIBLICAS.md','OFFLINE.md','piloto-pdf/GENESIS-COMPLETO.md','piloto-pdf/REVISAO.md']:
    p=ROOT/name
    text=p.read_text(encoding='utf-8')
    if '## Escopo vigente: somente ARA como base local' not in text:
        p.write_text(scope+text,encoding='utf-8')
