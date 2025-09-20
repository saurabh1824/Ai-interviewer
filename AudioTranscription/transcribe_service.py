from fastapi import FastAPI, UploadFile, File
from faster_whisper import WhisperModel
import tempfile
import uvicorn

app = FastAPI()

# Load model (small is lighter; you can change to "medium" or "large")
model = WhisperModel("small", device="cpu")

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        temp_audio.write(await file.read())
        temp_audio.flush()

        segments, _ = model.transcribe(temp_audio.name)
        text = " ".join([segment.text for segment in segments])

    return {"transcription": text}

if __name__ == "__main__":
    uvicorn.run("transcribe_service:app", host="0.0.0.0", port=8001, reload=False)
