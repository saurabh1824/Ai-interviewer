from app.db.database import db
from app.schemas.user import UserCreate
from bson import ObjectId

async def create_user(user: UserCreate, hashed_password: str):
    user_doc = {
        "email": user.email,
        "hashed_password": hashed_password,
        "full_name": user.full_name,
        "role": "candidate"
    }
    await db.Users.insert_one(user_doc)
    return user_doc

async def get_user_by_email(email: str):
    return await db.Users.find_one({"email": email})

async def get_user_by_id(user_id: str):
    return await db.Users.find_one({"_id": ObjectId(user_id)})
