"""Extração auditável de Gênesis; mantém incertezas em vez de adivinhar palavras."""
import hashlib
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / '.pdf-analysis-tools'))
import pymupdf

VERSIONS = ['ARA']
COUNTS = [31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26]
STARTS = [39.48,195.5,351.53,507.55,663.58]
OUT = ROOT / 'piloto-pdf'
CACHE = OUT / 'fragmentos-genesis-mupdf.json'
source = ROOT / 'multiversoes-original.pdf'
source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
if CACHE.exists():
    cache = json.loads(CACHE.read_text(encoding='utf-8'))
    assert cache['sha256'] == source_hash
    pages = cache['pages']
else:
    reader = pymupdf.open(source)
    pages = []
    for i in range(3, 182):
        fragments = []
        page = reader[i]
        # MuPDF decodes the font and character placement before assembling spans.
        # This avoids pypdf's artificial spaces at text-run boundaries.
        for block in page.get_text('dict')['blocks']:
            for line in block.get('lines', []):
                for span in line['spans']:
                    if span['text'].strip():
                        fragments.append(dict(text=span['text'], x=round(span['origin'][0],3),
                                              y=round(page.rect.height-span['origin'][1],3),
                                              size=round(span['size'],3)))
        pages.append(dict(page=i+1, fragments=fragments))
        if (i-3) % 20 == 0:
            print(f'Página {i+1}', flush=True)
        if any(re.fullmatch(r'Êxodo\s+1', f['text'].strip()) for f in fragments):
            break
    CACHE.write_text(json.dumps(dict(sha256=source_hash,pages=pages),ensure_ascii=False),encoding='utf-8')

data = {v: {} for v in VERSIONS}
current = {v: None for v in VERSIONS}
finished = set()
issues = []
for page in pages:
    for col, version in enumerate(VERSIONS):
        if version in finished:
            continue
        right = 195.0  # Escopo local aprovado: somente a primeira coluna, ARA.
        fragments = [f for f in page['fragments'] if STARTS[col]-.5 <= f['x'] < right and 50 < f['y'] < 530]
        rows = {}
        for f in fragments:
            rows.setdefault(round(f['y'],1),[]).append(f)
        for y in sorted(rows,reverse=True):
            row = sorted(rows[y],key=lambda f:f['x'])
            raw = ''.join(f['text'] for f in row).strip()
            chapter = re.fullmatch(r'Gênesis\s*(\d+)',raw)
            if chapter:
                current[version] = int(chapter[1])
                data[version].setdefault(chapter[1],[])
                continue
            if re.fullmatch(r'Êxodo\s+1',raw):
                finished.add(version)
                break
            ch = current[version]
            if ch is None:
                continue
            if all(abs(f['size']-6.48)<.12 for f in row) and raw.isdigit():
                data[version][str(ch)].append(dict(verse=int(raw),text='',pages=[page['page']],warnings=[]))
                continue
            body = [f for f in row if abs(f['size']-8.04)<.12]
            if not body:
                continue
            verses = data[version][str(ch)]
            if not verses:
                issues.append(dict(version=version,chapter=ch,page=page['page'],problem='texto-sem-versiculo',text=raw))
                continue
            # Preserve spaces decoded by MuPDF, without dictionary replacements.
            line = re.sub(r'\s+',' ',''.join(f['text'] for f in body)).strip()
            verse = verses[-1]
            verse['text'] = (verse['text']+' '+line).strip()
            if page['page'] not in verse['pages']:
                verse['pages'].append(page['page'])
            if len(body)>1:
                verse['warnings'].append(dict(page=page['page'],line=line,reason='Conferir junções entre fragmentos do PDF.'))

validation = []
for version, chapters in data.items():
    for ch, expected in enumerate(COUNTS,1):
        verses = chapters.get(str(ch),[])
        numbers = [v['verse'] for v in verses]
        errors = []
        if numbers != list(range(1,expected+1)):
            errors.append(dict(expected=expected,actual=numbers))
        for v in verses:
            if not v['text']:
                errors.append(dict(emptyVerse=v['verse']))
        validation.append(dict(version=version,chapter=ch,verses=len(verses),ok=not errors,errors=errors))
payload = dict(status='experimental-sem-revisao-editorial',engine='PyMuPDF '+pymupdf.VersionBind,book='GEN',sourceSha256=source_hash,versions=data)
if issues or any(not check['ok'] for check in validation):
    raise ValueError('Falha estrutural: a saída anterior foi preservada.')
previous = OUT/'genesis-completo.json'
baseline = OUT/'genesis-antes-revisao.json'
if previous.exists() and not baseline.exists():
    baseline.write_bytes(previous.read_bytes())
before = json.loads(baseline.read_text(encoding='utf-8'))
changes = []
for version, chapters in data.items():
    for chapter, verses in chapters.items():
        old_verses = before['versions'][version][chapter]
        if len(old_verses) != len(verses):
            raise ValueError('Quantidade de versículos mudou durante a revisão.')
        for old, new in zip(old_verses, verses):
            if old['verse'] != new['verse']:
                raise ValueError('Identificação de versículo mudou durante a revisão.')
            if re.sub(r'\s', '', old['text']) != re.sub(r'\s', '', new['text']):
                raise ValueError(f'Alteração além de espaços: {version} {chapter}:{new["verse"]}')
            if old['text'] != new['text']:
                changes.append(dict(version=version,chapter=int(chapter),verse=new['verse'],
                                    before=old['text'],after=new['text'],pages=new['pages']))
pilot = json.loads((OUT/'genesis-1.json').read_text(encoding='utf-8'))
pilot_matches = sum(old['text'] == new['text'] for version in VERSIONS
                    for old,new in zip(pilot['versions'][version],data[version]['1']))
if pilot_matches != 31:
    raise ValueError('Divergência com o piloto de Gênesis 1: conferir antes de gerar.')
(OUT/'revisao-espacamento-genesis.json').write_text(json.dumps(dict(
    changedVerses=len(changes),nonWhitespaceChanges=0,pilotMatches=pilot_matches,
    previousFlaggedVerses=sum(bool(v['warnings']) for version in VERSIONS for vv in before['versions'][version].values() for v in vv),
    changes=changes),ensure_ascii=False,indent=2),encoding='utf-8')
(OUT/'genesis-completo.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2),encoding='utf-8')
report = dict(expectedChapters=50,expectedVersesPerVersion=sum(COUNTS),checks=validation,issues=issues,
              flaggedVerses=sum(bool(v['warnings']) for chapters in data.values() for verses in chapters.values() for v in verses))
(OUT/'validacao-genesis.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
template = (OUT/'genesis-template.html').read_text(encoding='utf-8')
def embedded(value):
    return json.dumps(value,ensure_ascii=False).replace('<','\\u003c')
(OUT/'genesis-completo.html').write_text(template.replace('__CORPUS__',embedded(payload)).replace('__VALIDATION__',embedded(report)),encoding='utf-8')
print(json.dumps(dict(pages=len(pages),checks=len(validation),failures=sum(not c['ok'] for c in validation),issues=len(issues),flaggedVerses=report['flaggedVerses'])),flush=True)
