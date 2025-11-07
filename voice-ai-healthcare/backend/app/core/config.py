from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://voiceai:voiceai123@localhost:5432/voice_ai_healthcare"

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # API Keys
    OPENAI_API_KEY: str = "sk-mock-key"
    DEEPGRAM_API_KEY: str = "mock-deepgram-key"

    # Application
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ENVIRONMENT: str = "development"

    # CORS
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
