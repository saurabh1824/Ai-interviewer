from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    gemini_api_key: str
    mongo_url: str
    mongo_db_name: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()