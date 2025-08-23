from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user import UserCreate, UserLogin, Token
from app.db.crud.user import create_user, get_user_by_email
from app.core.security import verify_password, create_access_token
from datetime import timedelta

router = APIRouter()

@router.post("/register")
async def register(user: UserCreate):
    existing_user = await get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    await create_user(user)
    return {"message": "User registered successfully"}

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await get_user_by_email(user.email)
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token(
        data={"sub": db_user["email"], "role": db_user["role"]},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
