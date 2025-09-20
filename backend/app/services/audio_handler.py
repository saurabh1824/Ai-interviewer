# import whisper
# import shutil
# import tempfile
# import os

# # Load Whisper model (choose: tiny, base, small, medium, large)
# # "small" is a good trade-off for accuracy/speed

# model = whisper.load_model("small")

# async def transcribe_audio(file)->str:
#     # save audio file tempararily and then transcribe it after transcribtion delete the file

#     with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
#         shutil.copyfileobj(file.file ,temp_file)
#         temp_file_path = temp_file.name

    
#     # Run Whisper AFTER file handle is closed
#     result = model.transcribe(temp_file_path, language="en")
#     # Now safe to remove
#     try:
#         os.remove(temp_file_path)
#     except PermissionError:
#         print(f"Warning: could not delete temp file {temp_file_path}")

#     return result["text"]

# backend/app/services/audio_handler.py

import httpx
from fastapi import UploadFile

# URL of the running transcription container
# If using Docker Compose, you can use the service name: http://audio_transcription:8001/transcribe
# Otherwise, use localhost or container IP
TRANSCRIPTION_URL = "http://localhost:8001/transcribe"

async def transcribe_audio(file: UploadFile) -> str:
    """
    Send audio file to AudioTranscription container for transcription
    and return the transcribed text.
    """
    # Read the uploaded file content
    file_content = await file.read()

    # Send POST request to the transcription container
    async with httpx.AsyncClient(timeout=300) as client:  # increase timeout if needed
        files = {"file": (file.filename, file_content, file.content_type)}
        response = await client.post(TRANSCRIPTION_URL, files=files)

    # Raise error if request failed
    response.raise_for_status()

    # Extract transcription from container response
    result = response.json()
    return result.get("transcription", "")
