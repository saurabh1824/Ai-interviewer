from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class InterviewSessionModel(BaseModel):
    id: str
    user_id: Optional[str]
    role: str
    skills: Optional[List[str]]
    questions: List[str]
    created_at: datetime
