from fastapi import APIRouter, UploadFile, File, Form
from app.schemas.interview import interviewRequest,InterviewResponse
from app.db.models.answers import Answer
from app.db.models.session import InterviewSessionModel
from app.services import generate_content ,extract_text_from_pdf
from app.db.crud.session import create_interview_session


router=APIRouter()

@router.post("/start",response_model=InterviewResponse)
async def start_interview(role:str=File(...),resume: UploadFile = File(...)):
    """
    Start an interview :
    extract text form resume
    generate interview questions based on the resume text and role.
    return the questions.
    """

    resume_text = await extract_text_from_pdf(resume)
    questions =  generate_content(role=role, resume_text=resume_text)

    session_data=InterviewSessionModel(
        role=role,
        questions=questions
    )

    session_id = await create_interview_session(session_data)
    return InterviewResponse(
        session_id=session_id,
        questions=questions,
        role=role
    )

@router.post("/create_answer_instance/{session_id}")
async def create_answer_instance(session_id: str):
    """
    Create a new answer instance for the given session ID.
    """
    from app.db.crud.answers import create_answer_object
    return await create_answer_object(session_id=session_id)

@router.post("/submite_answer/{session_id}")
async def append_answer(session_id: str, answer: Answer):
    """
    Append an answer to the existing session.
    """
    from app.db.crud.answers import append_answer
    updated_session = await append_answer(session_id=session_id, answer=answer)
    
    if updated_session:
        return updated_session
    return {"error": "Session not found or update failed"}

@router.get("/get_answers/{session_id}")
async def get_answers(session_id: str):
    """
    Retrieve all answers for a given session ID.
    """
    from app.db.crud.answers import get_answers_by_session_id
    answers = await get_answers_by_session_id(session_id=session_id)

    if answers is not None:
        return {"session_id": session_id, "answers": answers}
    return {"error": "No answers found for this session ID"}