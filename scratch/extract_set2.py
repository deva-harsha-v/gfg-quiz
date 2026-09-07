import sys
import pypdf
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r'C:\Users\User\Downloads\Set 2(diploma 1st year).pdf'
reader = pypdf.PdfReader(pdf_path)

print(f"Num pages: {len(reader.pages)}")
full_text = []

for i, page in enumerate(reader.pages):
    text = page.extract_text()
    print(f"=== PAGE {i+1} ===")
    print(text)
    full_text.append(text)

with open(r'c:\quiz\scratch\set2_text.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(full_text))

print("\nSaved text to c:\\quiz\\scratch\\set2_text.txt")

# Also render PNG images using PyMuPDF
doc = pymupdf.open(pdf_path)
for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=200)
    pix.save(f'c:\\quiz\\scratch\\set2_page_{i+1}.png')

print("Rendered PNG page images of Set 2 PDF.")
