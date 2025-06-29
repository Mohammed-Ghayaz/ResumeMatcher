import fitz


def extract_text_from_pdf(pdf_file_path):
    resume_pdf = fitz.open(pdf_file_path)
    text = ""
    for page in resume_pdf:
        text += page.get_text()

    return text
