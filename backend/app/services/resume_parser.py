import fitz  # PyMuPDF
import os

def extract_text_from_pdf(pdf_path):
    """
    Extracts text from a PDF file using PyMuPDF.
    
    Args:
        pdf_path (str): The path to the PDF file.
        
    Returns:
        str: The extracted text from the PDF.
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"The file {pdf_path} does not exist.")
    
    text = ""
    with fitz.open(pdf_path) as pdf_document:
        for page in pdf_document:
            text += page.get_text()
    
    return text

text=extract_text_from_pdf("C:\\Users\\HP\\Downloads\\Saurabh Resume pfizer intern.pdf")

# print(text)