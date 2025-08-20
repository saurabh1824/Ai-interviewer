from app.db.crud.answers import append_answer
from app.services.audio_handler import transcribe_audio

async def process_audio_answer(session_id: str,question_id:str, audio_file) -> dict:
    """
    Process the audio answer for a given session ID.
    Transcribe the audio and append it to the session's answers.
    """
    answer_text=await transcribe_audio(audio_file)

    answer_doc={
        
        "question_id": question_id,
        "answer_type": "voice",
        "answer_text": answer_text
    }

    await append_answer(session_id=session_id, answer=answer_doc)

    return {"message": "Answer processed successfully", "answer_text": answer_text}



