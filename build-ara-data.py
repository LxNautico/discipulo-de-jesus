"""Gera somente ARA/Gênesis para o jogo, sem imagens ou ferramentas de revisão."""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parent
source=json.loads((ROOT/'piloto-pdf/genesis-completo.json').read_text(encoding='utf-8'))
chapters=source['versions']['ARA']
assert len(chapters)==50
data=dict(translation=dict(id='ara',name='Almeida Revista e Atualizada',shortName='ARA'),
          scope='Gênesis 1–50',sourceSha256=source['sourceSha256'],
          books=[dict(id='GEN',name='Gênesis',chapters=[
              [dict(number=v['verse'],text=v['text']) for v in chapters[str(ch)]] for ch in range(1,51)])])
assert sum(map(len,data['books'][0]['chapters']))==1533
(ROOT/'ara-data.js').write_text('/* ARA · Gênesis. Origem e escopo em FONTES-BIBLICAS.md. */\nwindow.BIBLE_ARA='+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+';\n',encoding='utf-8')
print('ARA gerada: 50 capítulos, 1.533 versículos; outras traduções excluídas do recurso do jogo.')
