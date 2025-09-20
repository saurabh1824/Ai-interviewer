import fitz  # PyMuPDF

async def extract_text_from_pdf(uploaded_file):
    """
    Extracts text from an uploaded PDF file (UploadFile) using PyMuPDF.
    """
    file_bytes = await uploaded_file.read()
    text = ""

    # Open from bytes
    with fitz.open(stream=file_bytes, filetype="pdf") as pdf_document:
        for page in pdf_document:
            text += page.get_text()

    return text
