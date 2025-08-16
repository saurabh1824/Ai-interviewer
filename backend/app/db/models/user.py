from pydantic import BaseModel, EmailStr
from typing import List,Optional
from datetime import datetime

class User(BaseModel):
    id: str
    name: str
    email: EmailStr
    created_at: datetime


    