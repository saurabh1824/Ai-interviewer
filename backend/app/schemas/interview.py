from pydantic import BaseModel
from typing import  List


class interviewRequest(BaseModel):
    role:str

class interviewResponse(BaseModel):
    questions: List[str]

    

   