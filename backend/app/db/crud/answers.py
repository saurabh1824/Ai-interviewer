from app.db.models.answers import InterviewAnswerModel ,Answer
from app.db.database import db
from pymongo import ReturnDocument
from bson import ObjectId 


async def create_answer_object(session_id: str):
    """Create new session with first answer"""
    session = InterviewAnswerModel(
        session_id=session_id,
        answers=[]
    )
    await db.Answers.insert_one(session.model_dump(by_alias=True))
    return session


async def append_answer(session_id: str, answer: Answer):
    """Add answer to existing session and update the current question index"""
    result = await db.Answers.find_one_and_update(
        {"session_id": session_id},  
        {"$push": {"answers": answer.model_dump(by_alias=True)}},
        return_document=ReturnDocument.AFTER  
    )

    await db.Sessions.update_one(
        {"_id": ObjectId(session_id)},
        {"$inc": {"current_question_index": 1}}
    )

    if result:
        return InterviewAnswerModel.from_mongo(result)  
    return None

async def get_answers_by_session_id(session_id: str):
    """Retrieve all answers for a given session ID"""
    result = await db.Answers.find_one({"session_id": session_id})
    if result:
        return result["answers"]
    return None

async def set_score(session_id: str, score: float):
    """
    Update the score of an interview session.
    """
    result = await db.Answers.find_one_and_update({"session_id": session_id},
                                                   {"$set": {"score": score}},)
    if result:
        return InterviewAnswerModel(**result)
    return None


