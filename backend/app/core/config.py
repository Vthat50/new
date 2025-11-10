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

    # Eleven Labs
    ELEVENLABS_API_KEY: str = "sk-aa82c352bbcd6eecb2775358c18d07b0b1923e851568ef09"
    ELEVENLABS_AGENT_ID: str = "agent_6501k9nxtr86emsv7jm770kkdcyr"
    ELEVENLABS_PHONE_NUMBER_ID: str = "phnum_01jww78wjjffev4pdypxqt7bqv"

    # Application
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ENVIRONMENT: str = "development"

    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://voice-ai-healthcare-k2b6290si-vthatte1-5467s-projects.vercel.app",
        "https://voice-ai-healthcare.vercel.app",
        "https://*.vercel.app"
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
