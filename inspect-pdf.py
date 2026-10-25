"""Inspeção local de amostras, sem alterar o PDF ou importar seu texto ao jogo."""
import hashlib
import json
from pathlib import Path
import sys

sys.stdout.reconfigure(encoding="utf-8")
root = Path(__file__).resolve().parent
sys.path.insert(0, str(root / ".pdf-analysis-tools"))
from pypdf import PdfReader

files = sorted(root.glob("*.pdf"))
print(json.dumps({"files": [{"name": p.name, "sha256": hashlib.sha256(p.read_bytes()).hexdigest()} for p in files]}, ensure_ascii=False))
source = next((p for p in files if p.name != "multiversoes-original.pdf"), files[0])
reader = PdfReader(source)
print(json.dumps({"source": source.name, "pages": len(reader.pages), "encrypted": reader.is_encrypted, "metadata": {str(k): str(v) for k, v in (reader.metadata or {}).items()}}, ensure_ascii=False))
for i in [0, 1, 2, 3, 4, 180, len(reader.pages) - 1]:
    page = reader.pages[i]
    text = page.extract_text() or ""
    print(json.dumps({"page_index": i, "text_length": len(text), "snippet": text[:2200], "fonts": list((page.get("/Resources", {}).get("/Font", {}) or {}).keys())}, ensure_ascii=False))
    if i == 3:
        layout = page.extract_text(extraction_mode="layout") or ""
        print(json.dumps({"page_index": i, "layout_sample": layout[:4200]}, ensure_ascii=False))
