import whisper
import shutil
import tempfile
import os

# Load Whisper model (choose: tiny, base, small, medium, large)
# "small" is a good trade-off for accuracy/speed

model = whisper.load_model("small")

async def transcribe_audio(file)->str:
    # save audio file tempararily and then transcribe it after transcribtion delete the file

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
        shutil.copyfileobj(file.file ,temp_file)
        temp_file_path = temp_file.name

    
    # Run Whisper AFTER file handle is closed
    result = model.transcribe(temp_file_path, language="en")
    # Now safe to remove
    try:
        os.remove(temp_file_path)
    except PermissionError:
        print(f"Warning: could not delete temp file {temp_file_path}")

    return result["text"]
