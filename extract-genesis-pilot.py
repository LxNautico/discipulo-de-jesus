"""Piloto restrito às páginas 4–7; não é um conversor da Bíblia inteira."""
import hashlib
import html
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / '.pdf-analysis-tools'))
from pypdf import PdfReader

source = ROOT / 'multiversoes-original.pdf'
reader = PdfReader(source)
versions = ['ARA']
starts = [39.48, 195.5, 351.53, 507.55, 663.58]
data = {v: [] for v in versions}
audit = []
for page_index in range(3, 7):
    fragments = []
    def visit(text, cm, tm, font, size):
        if text.strip():
            fragments.append(dict(text=text, x=float(tm[4]), y=float(tm[5]), size=float(size), font=font))
    reader.pages[page_index].extract_text(visitor_text=visit)
    for column, version in enumerate(versions):
        right = starts[column + 1] - 0.5 if column < 4 else 830
        items = [f for f in fragments if starts[column] - .5 <= f['x'] < right]
        stop = max((f['y'] for f in items if f['text'].strip() == 'Gênesis 2'), default=50)
        ceiling = 380 if page_index == 3 else 530
        items = [f for f in items if stop + .5 < f['y'] < ceiling and (abs(f['size'] - 8.04) < .1 or abs(f['size'] - 6.48) < .1)]
        lines = {}
        for f in items:
            lines.setdefault(round(f['y'], 1), []).append(f)
        for y in sorted(lines, reverse=True):
            row = sorted(lines[y], key=lambda f: f['x'])
            if all(abs(f['size'] - 6.48) < .1 for f in row):
                marker = ''.join(f['text'] for f in row).strip()
                if not marker.isdigit():
                    raise ValueError(f'Unexpected marker: {marker}')
                data[version].append(dict(verse=int(marker), text='', pages=[page_index + 1]))
                continue
            if not data[version]:
                raise ValueError('Text before first verse')
            line = ''
            previous_end = None
            for f in row:
                text = f['text'].strip()
                # Geometry distinguishes word spaces from arbitrary PDF text-run splits.
                if line and previous_end is not None and f['x'] - previous_end > 1.3:
                    line += ' '
                line += text
                font = f['font']
                widths = font.get('/Widths') if font else None
                widths = widths.get_object() if widths is not None else []
                first = int(font.get('/FirstChar', 0)) if font else 0
                width = 0
                for char in f['text'].rstrip():
                    try:
                        code = char.encode('cp1252')[0] - first
                        width += float(widths[code]) if 0 <= code < len(widths) else 500
                    except (UnicodeEncodeError, IndexError):
                        width += 500
                previous_end = f['x'] + width * f['size'] / 1000
            verse = data[version][-1]
            verse['text'] = re.sub(r'\s+', ' ', verse['text'] + ' ' + line).strip()
            if page_index + 1 not in verse['pages']:
                verse['pages'].append(page_index + 1)
        audit.append(dict(page=page_index + 1, version=version, fragments=len(items)))

for version, verses in data.items():
    assert [v['verse'] for v in verses] == list(range(1, 32)), version
    assert all(len(v['text']) > 15 for v in verses), version
    assert all('Gênesis 2' not in v['text'] for v in verses), version

out = ROOT / 'piloto-pdf'
out.mkdir(exist_ok=True)
# Keep the uncorrected extraction for comparison. These explicit whitespace
# repairs apply only to this chapter; never generalize them to the corpus.
(out / 'extracao-bruta.json').write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
repairs = {
    'firmament o': 'firmamento', 'se gundo': 'segundo', 'f irmamento': 'firmamento',
    'governaro': 'governar o', 'Povoem -se': 'Povoem-se', 'd izendo': 'dizendo',
    'multiplicai -vos': 'multiplicai-vos', 'sobretodo animal': 'sobre todo animal',
    'tar de': 'tarde', 'água s': 'águas', 'Ajuntem -se': 'Ajuntem-se',
    'Terra ;': 'Terra;', 'suaespécie': 'sua espécie', 'rép til': 'réptil',
    'fera s': 'feras', 'sujeitai -a': 'sujeitai-a', 'ser -vos': 'ser-vos',
    'v ivente': 'vivente', 'sob re': 'sobre', 'plan tas': 'plantas',
    'h aja': 'haja', 't ambém': 'também', 'man hã': 'manhã', 'co m': 'com',
    's uas': 'suas', 's elvagens': 'selvagens', 'disse -lhes': 'disse-lhes',
    's uperfície': 'superfície', 'ave s': 'aves', 'fe z': 'fez',
    'foram -se': 'foram-se', 'd ele': 'dele', 'fr uto': 'fruto',
    'pla ntas': 'plantas', 'celest e': 'celeste', 'Deu s': 'Deus',
    'domineele': 'domine ele', 'suj eitai': 'sujeitai', 'maso Espírito': 'mas o Espírito',
    'Faça -se': 'Faça-se', 'dividiuas': 'dividiu as', 'e stão': 'estão',
    'águ as': 'águas', 'p residir': 'presidir', 'te rra': 'terra',
    'espéc ies': 'espécies', 'espécie s': 'espécies', 'avesdo': 'aves do',
}
changes = []
for version, verses in data.items():
    for verse in verses:
        for old, new in repairs.items():
            if old in verse['text']:
                changes.append(dict(version=version, verse=verse['verse'], before=old, after=new))
                verse['text'] = verse['text'].replace(old, new)
(out / 'ajustes-de-espacamento.json').write_text(json.dumps(changes, ensure_ascii=False, indent=2), encoding='utf-8')
payload = dict(status='experimental-sem-revisao-editorial', book='GEN', chapter=1,
               sourceSha256=hashlib.sha256(source.read_bytes()).hexdigest(),
               sourcePages=[4, 5, 6, 7], versions=data)
(out / 'genesis-1.json').write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf-8')
(out / 'auditoria.json').write_text(json.dumps(audit, indent=2), encoding='utf-8')
sections = []
for version, verses in data.items():
    sections.append('<section data-version="' + version + '"><h2>Gênesis 1 · ' + version + '</h2>' + ''.join(
        '<p><b>' + str(v['verse']) + '</b> ' + html.escape(v['text']) + ' <small>PDF p. ' + ', '.join(map(str, v['pages'])) + '</small></p>' for v in verses) + '</section>')
(out / 'conferencia.html').write_text('''<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Conferência — Gênesis 1</title><style>body{max-width:850px;margin:30px auto;padding:0 20px;font:18px/1.7 system-ui;color:#234f40;background:#faf9f4}select{font:inherit;padding:8px}small{color:#666;font-size:12px}b{color:#975a10}aside{background:#fff0cd;padding:16px}p{border-bottom:1px solid #ddd;padding-bottom:12px}</style><h1>Gênesis 1 — extração piloto</h1><aside>Amostra experimental para conferir com o PDF. Sequência validada automaticamente; texto ainda sem revisão editorial independente. Não incorporada ao jogo.</aside><p><label>Tradução <select id="version">''' + ''.join('<option>' + v + '</option>' for v in versions) + '</select></label></p>' + ''.join(sections) + '''<script>const select=document.getElementById('version');function show(){document.querySelectorAll('section').forEach(s=>s.hidden=s.dataset.version!==select.value)}select.addEventListener('change',show);show();</script></html>''', encoding='utf-8')
print(json.dumps({v: len(verses) for v, verses in data.items()}))
