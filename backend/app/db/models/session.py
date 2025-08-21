from typing import List, Optional
from pydantic import BaseModel
from bson import ObjectId

class InterviewSessionModel(BaseModel):
    user_id: Optional[str] = None
    role: str
    skills: Optional[List[str]] = None
    questions: List[str]
    current_question_index: int = 0
    status:str = "in_progress"
    
    
    class Config:
        json_encoders = {ObjectId: str}
