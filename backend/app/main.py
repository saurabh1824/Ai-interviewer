from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import interview

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

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Interviewer API"}
