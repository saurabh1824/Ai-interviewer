from fastapi import APIRouter, UploadFile, File, Form, Depends
from app.schemas.interview import interviewRequest,InterviewResponse
from app.db.models.answers import Answer
from app.db.models.session import InterviewSessionModel
from app.services import generate_content ,extract_text_from_pdf
from app.db.crud.session import create_interview_session ,get_interview_session_by_id 
from app.services.audio_answer import process_audio_answer
from app.core.security import get_current_user

router=APIRouter()
@router.post("/start", response_model=InterviewResponse)
async def start_interview(
    role: str = Form(...),   # should be Form(), not File()
    resume: UploadFile| None=File(None),
   current_user: dict = Depends(get_current_user)
):
    """
    Start an interview:
    1. Extract text from resume
    2. Generate interview questions
    3. Create interview session
    4. Create matching answers instance
    5. Return session_id + questions
    """
    # get user id from token then create session for that user
    

    # 1. Parse resume
    resume_text = await extract_text_from_pdf(resume)

    # 2. Generate questions
    questions = generate_content(role=role, resume_text=resume_text)

    # 3. Create session in DB
    session_data = InterviewSessionModel(
        user_id=str(current_user["_id"]),
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


@router.post("/submit_answer_audio/{session_id}")
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
    # from app.db.crud.session import update_current_question_index
    session = await get_interview_session_by_id(session_id=session_id)

    if session:
        if session.current_question_index < len(session.questions):
            next_question = session.questions[session.current_question_index]
            # result=await update_current_question_index(session_id=session_id)
            # print(f"updated index status {result}")
            # print(next_question)
            
            return {"next_question": next_question ,"question_id":session.current_question_index}
        else:
            return {"message": "No more questions available. mark session as completed."}
    return {"error": "Session not found"}


@router.post("/end_session/{session_id}")
async def complete_session(session_id: str,current_user: dict = Depends(get_current_user)):
    """ mark the satuts of the session as completed by fetching the session by id and updating the status """

    from app.db.crud.session import update_session_status
    updated_session = await update_session_status(session_id=session_id, status="completed")

    if updated_session:
        return {"message": "Session marked as completed", "session_id": session_id}
    return {"error": "Session not found or update failed"}


@router.get("/evaluate_score/{session_id}")
async def evaluate_score(session_id: str , current_user: dict = Depends(get_current_user)):
    """
    Evaluate the score for the given session ID.
    and pass the session deatails back to ui for display

    """
    from app.db.crud.answers import get_answers_by_session_id
    from app.services.scoring import evaluate_session
    from app.db.crud.answers import set_score
    session = await get_interview_session_by_id(session_id=session_id)
    answers = await get_answers_by_session_id(session_id=session_id)

     # Check if session and answers exist

    if not session:
        return {"error": "Session not found"}
    
    if not answers:
        
        return {"error": "No answers found for this session"}

    # if not session or answers is None:
    #     return {"error": " api block Session or answers not found"}

    # Build dict {question_text: answer_text}
    QA_pairs = {}

    for idx, qtext in enumerate(session.questions, start=1):  # 1-based indexing
        ans_obj = next((a for a in answers if a["question_id"] == idx), None)
        answer_text = ans_obj["answer_text"] if ans_obj else "Not answered"
        QA_pairs[qtext] = answer_text

    # Pass to Gemini evaluator
    score_details = await evaluate_session(QA_pairs)

    # Update session with score
    status =await set_score(session_id=session_id, score=score_details["score"])
    if not status:
        return {"error": "Failed to update score in session"}
    
    return {
        "session_id": session_id,
        "role": session.role,
        "score": score_details["score"],
        "feedback": score_details["feedback"],
        "qa_pairs": QA_pairs
    }

    

