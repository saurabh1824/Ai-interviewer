from typing import List, Optional
from pydantic import BaseModel ,Field , ConfigDict
from bson import ObjectId

class InterviewSessionModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: Optional[str] = None
    role: str
    skills: Optional[List[str]] = None
    questions: List[str]
    current_question_index: int = 0
    status:str = "in_progress"
    
    
    model_config = ConfigDict(
        populate_by_name=True,        
        arbitrary_types_allowed=True, # allows bson.ObjectId
        json_encoders={ObjectId: str}
    )

    @classmethod
    def from_mongo(cls, doc: dict):
        if not doc:
            return None
        doc["_id"] = str(doc["_id"])
        return cls(**doc)
