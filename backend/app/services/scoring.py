import httpx
import re ,json
import asyncio
from app.core import settings

GEMINI_API_KEY = settings.gemini_api_key
GEMINI_MODEL = "gemini-1.5-flash"
GEMINI_ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

# Retry config
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds

async def evaluate_session(session_details: dict) -> dict:
    """
    Evaluate the interview session using Gemini API.
    Returns dict with score and structured feedback.
    """
    evaluation_prompt = f"""
    You are an expert interviewer and evaluator.
    Your task is to evaluate the interview session based on the provided session details.
    Session details include the questions asked and answers given.
    Some answers may be 'Not answered'.

    Return ONLY valid JSON (no markdown, no extra text).

    The JSON must follow exactly:

    {{
    "score": <integer between 0-50>,
    "feedback": "<1-2 sentences overall feedback>",
    "strengths": ["point1","point2","point3"],
    "areas_for_improvement": ["point1","point2","point3"]
    }}

    Session Details:
    {session_details}
    """

    payload = {"contents": [{"parts": [{"text": evaluation_prompt}]}]}

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(GEMINI_ENDPOINT, json=payload)
                response.raise_for_status()
                data = response.json()

            candidates = data.get("candidates", [])
            if not candidates:
                raise ValueError("No candidates returned from Gemini")

            evaluation_text = candidates[0]["content"]["parts"][0]["text"].strip()

            # Ensure valid JSON
            match = re.search(r"\{.*\}", evaluation_text, re.DOTALL)
            if not match:
                raise ValueError(f"Unexpected format: {evaluation_text}")

            try:
                parsed = json.loads(match.group())
            except json.JSONDecodeError:
                raise ValueError(f"Could not parse JSON: {evaluation_text}")
            
            formated_data={
                "score": parsed.get("score", 0),
                "feedback": parsed.get("feedback", ""),
                "strengths": parsed.get("strengths", []),
                "areas_for_improvement": parsed.get("areas_for_improvement", [])
            }
            
            return formated_data

        except Exception as e:
            if attempt < MAX_RETRIES:
                await asyncio.sleep(RETRY_DELAY * attempt)
                continue
            return {
                "score": 0,
                "feedback": f"Evaluation failed: {str(e)}",
                "strengths": [],
                "areas_for_improvement": []
            }
