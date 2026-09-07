import pypdf

reader = pypdf.PdfReader('C:/Users/User/Downloads/Set 6(3rd yr).pdf')
text = '\n'.join([p.extract_text() for p in reader.pages])

with open('c:/quiz/scratch/extracted_pdf_set6_3rdyr.txt', 'w', encoding='utf-8') as f:
    f.write(text)

print(f"Extracted {len(reader.pages)} pages. Total length: {len(text)} chars.")
