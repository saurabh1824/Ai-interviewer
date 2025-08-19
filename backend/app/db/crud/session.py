from app.db.models.session import InterviewSessionModel
from app.db.database import db

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
    session = await db.Sessions.find_one({"_id": session_id})
    if session:
        return InterviewSessionModel(**session)
    return None
