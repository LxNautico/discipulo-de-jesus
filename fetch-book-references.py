"""Consulta introduções públicas para conferência editorial; cache fora do jogo."""
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import urllib.request

ROOT=Path(__file__).resolve().parent
OUT=ROOT/'.book-reference-cache'
OUT.mkdir(exist_ok=True)
slugs='genesis exodus leviticus numbers deuteronomy joshua judges ruth 1-samuel 2-samuel 1-kings 2-kings 1-chronicles 2-chronicles ezra nehemiah esther job psalms proverbs ecclesiastes song-of-solomon isaiah jeremiah lamentations ezekiel daniel hosea joel amos obadiah jonah micah nahum habakkuk zephaniah haggai zechariah malachi matthew mark luke john acts romans 1-corinthians 2-corinthians galatians ephesians philippians colossians 1-thessalonians 2-thessalonians 1-timothy 2-timothy titus philemon hebrews james 1-peter 2-peter 1-john 2-john 3-john jude revelation'.split()
class Text(HTMLParser):
    def __init__(self):super().__init__();self.parts=[]
    def handle_data(self,s):self.parts.append(s)
def fetch(slug):
    target=OUT/(slug+'.json')
    if target.exists():return json.loads(target.read_text(encoding='utf-8'))
    alternatives=[slug]
    if slug in ['psalms','song-of-solomon']:alternatives=['the-'+slug]
    if slug in ['1-john','2-john','3-john']:alternatives=['1-3-john']
    if slug[:2] in ['1-','2-','3-']:alternatives+=['1-2-'+slug[2:],'1-2-3-'+slug[2:]]
    if slug in ['ezra','nehemiah']:alternatives+=['ezra-and-nehemiah','ezra-nehemiah']
    errors=[]
    for candidate in alternatives:
        url='https://www.esv.org/resources/esv-global-study-bible/introduction-to-'+candidate+'/'
        try:
            raw=urllib.request.urlopen(url,timeout=25).read().decode('utf-8')
            parser=Text();parser.feed(raw)
            text=re.sub(r'\s+',' ',' '.join(parser.parts))
            start=text.find('Introduction to ')
            result=dict(slug=slug,url=url,text=text[start:] if start>=0 else text)
            target.write_text(json.dumps(result,ensure_ascii=False),encoding='utf-8')
            return result
        except Exception as error:errors.append(str(error))
    return dict(slug=slug,error=errors)
with ThreadPoolExecutor(max_workers=6) as pool:
    results=list(pool.map(fetch,slugs))
(OUT/'index.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(dict(ok=sum('text'in r for r in results),failed=[r['slug'] for r in results if 'error'in r])))
