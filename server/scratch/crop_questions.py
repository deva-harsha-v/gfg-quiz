import sys
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')
doc = pymupdf.open(r'C:\Users\User\Downloads\Set 3(diploma 1st year).pdf')

for p_idx, page in enumerate(doc):
    text_page = page.get_text("blocks")
    print(f"=== Page {p_idx+1} Blocks ===")
    for b in text_page:
        print(f"[{b[0]:.1f}, {b[1]:.1f}, {b[2]:.1f}, {b[3]:.1f}]: {b[4].strip()}")
