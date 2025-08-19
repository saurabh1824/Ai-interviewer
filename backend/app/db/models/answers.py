from pydantic import BaseModel, Field, ConfigDict, field_validator
from bson import ObjectId
from typing import List, Optional
from enum import Enum

class AnswerType(str, Enum):
    VOICE = "voice"
    TEXT = "text"

class Answer(BaseModel):
    question_id: int = Field(..., 
                           description="ID of the question being answered",
                           examples=[1, 2, 3])
    answer_type: AnswerType = Field(...,
                                  description="Type of the answer (voice or text)",
                                  examples=["voice"])
    answer_text: str = Field(...,
                           description="The actual answer content",
                           examples=["FastAPI is a modern web framework"])
    
    @field_validator('answer_text')
    def validate_answer_text(cls, v):
        v = v.strip()
        if len(v) == 0:
            raise ValueError("Answer text cannot be empty")
        if len(v) < 5:
            raise ValueError("Answer text must be at least 5 characters")
        return v

class InterviewAnswerModel(BaseModel):
    id: str = Field(alias="_id", 
                   default_factory=lambda: str(ObjectId()),
                   description="MongoDB document ID")
    session_id: str = Field(...,
                           description="ID of the interview session",
                           examples=["session_001"])
    answers: List[Answer] = Field(...,
                                description="List of answers provided during the interview")
    score: Optional[float] = Field(None,
                                 ge=0,
                                 le=5,
                                 description="Score of the interview (0-5 scale)")

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str},
        json_schema_extra={
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "session_id": "507f1f77bcf86cd7996455231",
                "answers": [
                    {
                        "question_id": 1,
                        "answer_type": "voice",
                        "answer_text": "FastAPI supports async operations"
                    },
                    {
                        "question_id": 2,
                        "answer_type": "text",
                        "answer_text": "Pydantic does data validation"
                    }
                ],
                "score": 10.5,
                
            }
        }
    )

    @classmethod
    def from_mongo(cls, data: dict):
        """Convert MongoDB document to Pydantic model"""
        if "_id" in data:
            data["_id"] = str(data["_id"])
        return cls(**data)