from app.db.database import db
from app.db.models.user import UserModel
from app.core.security import get_password_hash, verify_password

async def create_user(user_data):
    user_dict = {
        "email": user_data.email,
        "hashed_password": get_password_hash(user_data.password),
        "full_name": user_data.full_name,
        "role": "candidate",
    }
    result = await db.Users.insert_one(user_dict)
    return str(result.inserted_id)

async def get_user_by_email(email: str):
    return await db.Users.find_one({"email": email})
