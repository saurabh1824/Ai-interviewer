from fastapi import APIRouter, UploadFile, File, Form
from app.schemas.interview import interviewRequest,InterviewResponse
from app.db.models.answers import Answer
from app.db.models.session import InterviewSessionModel
from app.services import generate_content ,extract_text_from_pdf
from app.db.crud.session import create_interview_session
from app.services.audio_answer import process_audio_answer


router=APIRouter()
@router.post("/start", response_model=InterviewResponse)
async def start_interview(
    role: str = Form(...),   # should be Form(), not File()
    resume: UploadFile = File(...)
):
    """
    Start an interview:
    1. Extract text from resume
    2. Generate interview questions
    3. Create interview session
    4. Create matching answers instance
    5. Return session_id + questions
    """

    # 1. Parse resume
    resume_text = await extract_text_from_pdf(resume)

    # 2. Generate questions
    questions = generate_content(role=role, resume_text=resume_text)

    # 3. Create session in DB
    session_data = InterviewSessionModel(
        role=role,
        questions=questions
    )
    session_id = await create_interview_session(session_data)

    # 4. Create empty answer doc for this session
    from app.db.crud.answers import create_answer_object
    await create_answer_object(session_id=session_id)

    # 5. Return response
    return InterviewResponse(
        session_id=session_id,
        questions=questions,
        role=role
    )



@router.post("/submite_answer_text/{session_id}")
async def submite_answer_text(session_id: str, answer: Answer):
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


@router.post("/submite_answer_audio/{session_id}")
async def submite_answer_audio(
    session_id: str,
    question_id: int = Form(...),
    audio_file: UploadFile = File(...)
):
    """
    Process an audio answer for a given session ID.
    Transcribe the audio and append it to the session's answers.
    """
    answer_text= await process_audio_answer(audio_file=audio_file, session_id=session_id, question_id=question_id)
    return answer_text


@router.get("/next_question/{session_id}")
async def next_question(session_id: str):
    """
    Retrieve the next question for the given session ID.
    """
    from app.db.crud.session import get_interview_session_by_id
    session = await get_interview_session_by_id(session_id=session_id)

    if session:
        if session.current_question_index < len(session.questions):
            next_question = session.questions[session.current_question_index]
            return {"next_question": next_question}
        else:
            return {"message": "No more questions available. mark session as completed."}
    return {"error": "Session not found"}


@router.post("/end_session/{session_id}")
async def complete_session(session_id: str):
    pass


@router.get("/evaluate_score/{session_id}")
async def evaluate_score(session_id: str):
    """
    Evaluate the score for the given session ID.
    This is a placeholder function and should be implemented.
    """
    pass

