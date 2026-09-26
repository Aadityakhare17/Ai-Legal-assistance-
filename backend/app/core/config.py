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
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    @property
    def allowed_extensions_list(self) -> List[str]:
        return [e.strip().lower() for e in self.ALLOWED_EXTENSIONS.split(",")]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
