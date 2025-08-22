import httpx
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
    Evaluate the interview session using Gemini API (async + retries).
    Returns dict with score and feedback.
    """
    evaluation_prompt = f"""
    You are an expert interviewer and evaluator.
    Your task is to evaluate the interview session based on the provided session details.
    Session details include the questions asked and answers given.
    Some answers may be 'Not answered'.

    Provide:
    - A score between 0 to 5 (overall performance).
    - Feedback with strengths and areas of improvement.

    Format strictly as:
    Score: <score>
    Feedback: <feedback>

    Session Details:
    {session_details}
    """

    payload = {
        "contents": [
            {"parts": [{"text": evaluation_prompt}]}
        ]
    }

    # Retry loop
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(GEMINI_ENDPOINT, json=payload)
                response.raise_for_status()
                data = response.json()

            # Extract text safely
            candidates = data.get("candidates", [])
            if not candidates:
                raise ValueError("No candidates returned from Gemini")

            evaluation_text = candidates[0]["content"]["parts"][0]["text"].strip()

            # Parse score + feedback safely
            if "Score:" not in evaluation_text or "Feedback:" not in evaluation_text:
                raise ValueError(f"Unexpected format: {evaluation_text}")

            score, feedback = evaluation_text.split("\n", 1)

            return {
                "score": score.replace("Score: ", "").strip(),
                "feedback": feedback.replace("Feedback: ", "").strip()
            }

        except (httpx.RequestError, httpx.HTTPStatusError, ValueError) as e:
            if attempt < MAX_RETRIES:
                print(f"[WARN] Gemini API call failed (attempt {attempt}), retrying... {e}")
                await asyncio.sleep(RETRY_DELAY * attempt)  # Exponential backoff
                continue
            else:
                print(f"[ERROR] Gemini API call failed after {MAX_RETRIES} attempts: {e}")
                return {
                    "score": "0",
                    "feedback": f"Evaluation failed: {str(e)}"
                }
