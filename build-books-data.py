"""Gera as 66 introduções com IDs do catálogo e referências editoriais verificadas."""
import json
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parent
raw=(ROOT/'bible-catalog.js').read_text(encoding='utf-8').split('window.BIBLE_CATALOG=',1)[1].strip().rstrip(';')
catalog=json.loads(raw)['books']
rows=[r.split('|') for r in (ROOT/'books-content.txt').read_text(encoding='utf-8').splitlines() if r and not r.startswith('#')]
references=json.loads((ROOT/'.book-reference-cache/index.json').read_text(encoding='utf-8'))
assert len(rows)==len(catalog)==len(references)==66
groups=[(5,'Pentateuco','Narrativa e lei'),(17,'Históricos','Narrativa histórica'),(22,'Poéticos e sapienciais','Poesia e sabedoria'),(27,'Profetas maiores','Profecia'),(39,'Profetas menores','Profecia'),(43,'Evangelhos','Narrativa evangélica'),(44,'História da igreja','Narrativa histórica'),(57,'Cartas paulinas','Carta'),(65,'Cartas gerais','Carta e exortação'),(66,'Apocalipse','Profecia apocalíptica')]
books=[]
places={'ROM':'Provavelmente Corinto.','1CO':'Éfeso.','2CO':'Macedônia.','EPH':'Tradicionalmente Roma, durante a prisão de Paulo.','PHP':'Provavelmente Roma; outras prisões são propostas.','COL':'Tradicionalmente Roma.','1TH':'Provavelmente Corinto.','2TH':'Provavelmente Corinto, na datação paulina tradicional.','2TI':'Roma, na leitura paulina tradicional.','PHM':'Provavelmente Roma; outras localizações são propostas.','1PE':'Provavelmente Roma, identificada por muitos intérpretes com “Babilônia” em 5:13.','JHN':'Tradicionalmente associado a Éfeso.','1JN':'Tradicionalmente associado a Éfeso e à Ásia Menor.','2JN':'Tradicionalmente associado à Ásia Menor.','3JN':'Tradicionalmente associado à Ásia Menor.','REV':'Patmos, local das visões; a composição é ligada à experiência de João nessa ilha.'}
for position,(row,book,reference) in enumerate(zip(rows,catalog,references),1):
    assert len(row)==11,(row[0],len(row))
    id,author,date,audience,context,purpose,outline,themes,passage,christ,note=row
    assert id==book['id'] and 'text' in reference,(id,reference)
    group,genre=next((g,t) for last,g,t in groups if position<=last)
    if id=='LAM':genre='Poesia de lamento'
    if id=='DAN':genre='Narrativa e profecia apocalíptica'
    if id=='JON':genre='Narrativa profética'
    language='Grego koiné' if position>39 else 'Principalmente hebraico'
    if id in ['EZR','DAN']:language='Hebraico e aramaico'
    parts=[]
    for item in outline.split(';'):
        reference_range,title=item.split(': ',1)
        start=int(re.match(r'\d+',reference_range)[0])
        assert 1<=start<=book['numberOfChapters'],(id,item)
        parts.append(dict(range=reference_range,title=title,chapter=start))
    match=re.fullmatch(r'(\d+):(\d+)[–-](\d+)',passage)
    if not match:
        match=re.fullmatch(r'(\d+):(\d+)',passage)
    chapter,first=int(match[1]),int(match[2])
    last=int(match[3]) if len(match.groups())==3 else first
    assert 1<=chapter<=book['numberOfChapters'] and 1<=first<=last
    sources=[dict(title='Crossway · ESV Global Study Bible (inglês)',url=reference['url'])]
    if id in ['ISA','DAN','EPH']:
        slug={'ISA':'ISAIAH','DAN':'DANIEL','EPH':'EPHESIANS'}[id]
        sources.append(dict(title='Logos · Faithlife Study Bible (inglês)',url='https://biblia.com/books/fsb/article/SIDEBAR.INTRODUCTIONTO'+slug))
    books.append(dict(id=id,name=book['name'],order=position,chapters=book['numberOfChapters'],
        testament='AT' if position<=39 else 'NT',group=group,genre=genre,language=language,
        author=author,date=date,audience=audience,place=places.get(id,'Não identificado com segurança.'),context=context,purpose=purpose,outline=parts,
        themes=themes.split(', '),reading=dict(book=id,chapter=chapter,fromVerse=first,toVerse=last,label=book['name']+' '+passage),
        christ=christ,note=note,sources=sources))
assert len({b['id'] for b in books})==66
data=dict(schemaVersion=1,reviewedAt='2026-10-16',canon='Protestante · 39 livros do Antigo Testamento e 27 do Novo',books=books)
(ROOT/'books-data.js').write_text('/* Introduções próprias; fontes em LIVROS-DA-BIBLIA.md e nas fichas. */\nwindow.BOOK_GUIDE='+json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+';\n',encoding='utf-8')
print('66 introduções geradas; 39 AT, 27 NT; fontes e navegação por capítulo verificadas.')
