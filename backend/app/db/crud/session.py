from app.db.models.session import InterviewSessionModel
from app.db.database import db
from bson import ObjectId 

async def create_interview_session(session: InterviewSessionModel):
    """
    Create a new interview session in the database.
    """
    session_dict = session.dict()
    result = await db.Sessions.insert_one(session_dict)
    return str(result.inserted_id)

async def get_interview_session_by_id(session_id: str):
    """
    Retrieve an interview session by its ID.
    """
    session = await db.Sessions.find_one({"_id": ObjectId(session_id)}) 
    if session:
        return InterviewSessionModel.from_mongo(session)
    return None

async def update_session_status(session_id: str, status: str):
    """
    Update the status of an interview session.
    """
    result = await db.Sessions.find_one_and_update({"_id": ObjectId(session_id)},
                                                   {"$set": {"status":status}},)
    if result:
        return InterviewSessionModel(**result)
    return None


async def update_current_question_index(session_id:str):
    """get the session by Id and then update the current question index"""

    result= await db.Sessions.find_one_and_update({"_id":ObjectId(session_id)},
                                                {"$inc":{"current_question_index":1}})
    
    if(result):
        return "index incremented by 1"
    return None
