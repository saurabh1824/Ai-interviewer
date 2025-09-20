# Use Python 3.12 slim
FROM python:3.12-slim

# Install system dependencies (ffmpeg needed by faster-whisper)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy service code
COPY . .

# Expose FastAPI port
EXPOSE 8001

# Run service
CMD ["uvicorn", "transcribe_service:app", "--host", "0.0.0.0", "--port", "8001"]
