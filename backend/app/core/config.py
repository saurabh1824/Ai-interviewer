from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    gemini_api_key: str
    mongo_url: str
    mongo_db_name: str
    gemini_model: str = "gemini-1.5-flash"
    secret_key: str
    algorithm: str 
    access_token_expire_minutes: int

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()