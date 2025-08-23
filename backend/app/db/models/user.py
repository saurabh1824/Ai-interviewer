from pydantic import BaseModel, EmailStr
from typing import Optional

class UserModel(BaseModel):
    email: EmailStr
    hashed_password: str
    full_name: Optional[str] = None
    role: str = "candidate"



    