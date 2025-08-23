from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import interview
from app.api.v1 import auth
app = FastAPI(
    title="AI Interviewer API",
    version="1.0.0",
    description="Backend API for AI Interviewer MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interview.router,prefix="/api/v1/interview",tags=["interview"])
app.include_router(auth.router,prefix="/api/v1/auth",tags=["auth"])

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Interviewer API"}
