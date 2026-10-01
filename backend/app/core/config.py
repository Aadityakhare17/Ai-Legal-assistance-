from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    APP_NAME: str = "NyayaSetu"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    DATABASE_URL: str = "sqlite+aiosqlite:///./nyayasetu.db"

    # LLM Settings (Supports both Grok / xAI and Google Gemini)
    LLM_PROVIDER: str = "auto"  # 'auto', 'grok', 'gemini'
    
    GROK_API_KEY: str = ""
    GROK_MODEL: str = "grok-2-latest"
    GROK_BASE_URL: str = "https://api.x.ai/v1"

    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"
    EMBEDDING_MODEL: str = "models/text-embedding-004"

    DEMO_MODE: bool = True

    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE_MB: int = 20
    ALLOWED_EXTENSIONS: str = ".pdf,.docx,.txt,.doc"

    CHROMA_PERSIST_DIR: str = "./chroma_db"
    CHROMA_COLLECTION: str = "nyayasetu_docs"

    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,*"
    RATE_LIMIT_PER_MINUTE: int = 60

    @property
    def is_ai_configured(self) -> bool:
        return bool(self.GROK_API_KEY or self.GEMINI_API_KEY)

    @property
    def active_llm_provider(self) -> str:
        if self.LLM_PROVIDER.lower() == "grok" and self.GROK_API_KEY:
            return "grok"
        if self.LLM_PROVIDER.lower() == "gemini" and self.GEMINI_API_KEY:
            return "gemini"
        if self.GROK_API_KEY:
            return "grok"
        if self.GEMINI_API_KEY:
            return "gemini"
        return "demo"

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    @property
    def allowed_extensions_list(self) -> List[str]:
        return [e.strip().lower() for e in self.ALLOWED_EXTENSIONS.split(",")]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
