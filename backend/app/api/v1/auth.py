# from fastapi import APIRouter, HTTPException, Depends
# from app.schemas.user import UserCreate, UserLogin, Token
# from app.db.crud.user import create_user, get_user_by_email
# from app.core.security import verify_password, create_access_token
# from datetime import timedelta

# router = APIRouter()

# @router.post("/register")
# async def register(user: UserCreate):
#     existing_user = await get_user_by_email(user.email)
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
#     await create_user(user)
#     return {"message": "User registered successfully"}

# @router.post("/login", response_model=Token)
# async def login(user: UserLogin):
#     db_user = await get_user_by_email(user.email)
#     if not db_user or not verify_password(user.password, db_user["hashed_password"]):
#         raise HTTPException(status_code=401, detail="Invalid email or password")

#     access_token_expires = timedelta(minutes=60)
#     access_token = create_access_token(
#         data={"sub": db_user["email"], "role": db_user["role"]},
#         expires_delta=access_token_expires
#     )
#     return {"access_token": access_token, "token_type": "bearer"}


from fastapi import APIRouter, HTTPException ,Depends
from datetime import timedelta

from app.schemas.user import UserCreate, UserLogin, Token
from app.db.crud.user import create_user, get_user_by_email
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings

router = APIRouter()
from fastapi.security import OAuth2PasswordRequestForm

@router.post("/register")
async def register(user: UserCreate):
    existing_user = await get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = get_password_hash(user.password)   # ✅ hash here
    await create_user(user, hashed_pw)            # ✅ pass into crud
    return {"message": "User registered successfully"}

# @router.post("/login", response_model=Token)
# async def login(form_data: OAuth2PasswordRequestForm = Depends()):
#     db_user = await get_user_by_email(form_data.email)
#     if not db_user or not verify_password(form_data.password, db_user["hashed_password"]):
#         raise HTTPException(status_code=401, detail="Invalid email or password")

#     access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
#     access_token = create_access_token(
#         data={"sub": str(db_user["_id"]), "role": db_user["role"]},
#         expires_delta=access_token_expires
#     )
#     return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db_user = await get_user_by_email(form_data.username)  # username == email
    if not db_user or not verify_password(form_data.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    print("Issued token payload:", {"sub": str(db_user["_id"]), "role": db_user["role"]})
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(db_user["_id"]), "role": db_user["role"]},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}