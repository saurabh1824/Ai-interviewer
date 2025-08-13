from fastapi import APIRouter, UploadFile, File, Form
from app.schemas.interview import interviewRequest,interviewResponse
from app.services import generate_content ,extract_text_from_pdf


router=APIRouter()

@router.post("/start",response_model=interviewResponse)
async def start_interview(role:str=File(...),resume: UploadFile = File(...)):
    """
    Start an interview :
    extract text form resume
    generate interview questions based on the resume text and role.
    return the questions.
    """

    resume_text = await extract_text_from_pdf(resume)

    questions =  generate_content(role=role, resume_text=resume_text)

    return {"questions": questions}