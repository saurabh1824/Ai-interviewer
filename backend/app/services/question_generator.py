import google.generativeai as genai
from dotenv import load_dotenv
import os

# for testing purposes we are importing the resume_parser file

from resume_parser import extract_text_from_pdf
# Load environment variables from .env file
load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=gemini_api_key)


def generate_content(resume_text=""):
    question_prompt = f"""
    You are an AI interviewer. Your task is to generate 7 or 8 interview questions based on the provided resume text.
    The questions should be related to question topics that are shown below and should be relevant to candidate's resume.
    The questions should have easy-to-medium difficulty and be open-ended to encourage detailed responses.

    related question topics:
    1. Question related to data structures and algorithms
    2. Question related to databases and SQL
    3. Question related to the programming languages mentioned in the resume
    4. Question related to the projects mentioned in the resume
    5. Question related to the skills mentioned in the resume
    6. Question related to internships or work experience mentioned in the resume

    question example:
    1.write a program to find the nth fibonacci number
    2. what is the time complexity of quicksort?
    3. what is the use case of a hash table,stack,queue?
    4. What is the difference between a primary key and a foreign key in SQL?
    5. what is the difference between a class and an object in OOP?
    6. what are joins in SQL and how do they work?

    Resume text:
    {resume_text}

    NOTE: Do not include the question numbers in the output. Just return the questions as a list of strings.and limit the questions to 7 or 8.
    give question in short and concise manner.

    """

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(question_prompt)

    # Get the text
    questions_text = response.text.strip()

    # Clean and split into list
    questions = [q.strip(" -0123456789.") for q in questions_text.split("\n") if q.strip()]
    return questions



# Example usage:
# resume_text = extract_text_from_pdf("path_to_resume.pdf")
# questions = await generate_content(resume_text)
# print(questions)

resume_text = extract_text_from_pdf("C:\\Users\\HP\\Downloads\\Saurabh Resume pfizer intern.pdf")
questions =  generate_content(resume_text)

for i, question in enumerate(questions, start=1):
    print(f"Question {i}: {question}")
