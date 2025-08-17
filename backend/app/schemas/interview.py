from pydantic import BaseModel
from typing import  List


class interviewRequest(BaseModel):
    role:str

class InterviewResponse(BaseModel):
    session_id: str
    questions: List[str]
    role: str

    

   