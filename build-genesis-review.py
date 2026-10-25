"""Gera a fila offline e imagens das colunas do PDF necessárias à revisão."""
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT/'.pdf-analysis-tools'))
import pymupdf

OUT = ROOT/'piloto-pdf'
corpus = json.loads((OUT/'genesis-completo.json').read_text(encoding='utf-8'))
corpus['versions'] = {'ARA':corpus['versions']['ARA']}
pdf_path = ROOT/'multiversoes-original.pdf'
assert hashlib.sha256(pdf_path.read_bytes()).hexdigest() == corpus['sourceSha256']
pdf = pymupdf.open(pdf_path)
versions = ['ARA','ACF','NBV','A21','TB']
starts = [39.48,195.5,351.53,507.55,663.58]
needed = set()
count = 0
for version, chapters in corpus['versions'].items():
    for chapter, verses in chapters.items():
        for verse in verses:
            if verse['warnings']:
                count += 1
                for number in verse['pages']:
                    needed.add((version,number))
images = OUT/'imagens-revisao'
images.mkdir(exist_ok=True)
manifest_path = OUT/'manifesto-revisao.json'
previous = json.loads(manifest_path.read_text(encoding='utf-8')) if manifest_path.exists() else {}
for version, number in sorted(needed):
    target = images/f'{version}-{number}.jpg'
    if previous.get('sourceSha256') == corpus['sourceSha256'] and target.exists() and target.stat().st_size > 1000:
        continue
    page = pdf[number-1]
    column = versions.index(version)
    left = starts[column]-1
    right = starts[column+1]-1 if column<4 else 820
    # Keep the complete body of this column so reviewers see surrounding verses.
    page.get_pixmap(matrix=pymupdf.Matrix(3,3),clip=pymupdf.Rect(left,58,right,545)).save(
        target,jpg_quality=90)

def embed(text):
    return text.replace('</script','<\\/script')
template = (OUT/'review-template.html').read_text(encoding='utf-8')
html = template.replace('__CORPUS__',json.dumps(corpus,ensure_ascii=False).replace('<','\\u003c'))
html = html.replace('__ENGINE__',embed((OUT/'review-engine.js').read_text(encoding='utf-8')))
html = html.replace('__UI__',embed((OUT/'review-ui.js').read_text(encoding='utf-8')))
html = html.replace('<style>','<style>[hidden]{display:none!important}')
(OUT/'revisao-genesis.html').write_text(html,encoding='utf-8')
(OUT/'manifesto-revisao.json').write_text(json.dumps(dict(sourceSha256=corpus['sourceSha256'],
    items=count,images=[f'{version}-{page}.jpg' for version,page in sorted(needed)]),ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(dict(items=count,images=len(needed),imageBytes=sum((images/f'{v}-{p}.jpg').stat().st_size for v,p in needed))))
