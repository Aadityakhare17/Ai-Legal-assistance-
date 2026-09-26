import os
import sys

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from loguru import logger

from app.core.config import settings
from app.database.database import init_db
from app.api import auth, documents, constitution


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown."""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Demo Mode: {settings.DEMO_MODE}")
    logger.info(f"AI Configured: {'Yes' if settings.GEMINI_API_KEY else 'No (Demo Mode Only)'}")

    # Initialize database
    await init_db()
    logger.info("Database initialized")

    # Create upload directory
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.CHROMA_PERSIST_DIR, exist_ok=True)

    yield

    logger.info("Shutting down NyayaSetu backend")


app = FastAPI(
    title="NyayaSetu API",
    description="GenAI-powered Legal Document Intelligence Platform",
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(constitution.router)


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "ai_configured": bool(settings.GEMINI_API_KEY),
        "demo_mode": settings.DEMO_MODE,
    }


# Static frontend files (for production container & local build)
from fastapi.responses import FileResponse

static_dist = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dist):
    static_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

if os.path.exists(static_dist):
    assets_dir = os.path.join(static_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    async def root():
        index_file = os.path.join(static_dist, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {
            "message": f"Welcome to {settings.APP_NAME} API",
            "docs": "/api/docs",
            "health": "/health",
        }

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path == "health":
            return {
                "message": f"Welcome to {settings.APP_NAME} API",
                "docs": "/api/docs",
                "health": "/health",
            }
        file_path = os.path.join(static_dist, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(static_dist, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Not found"}

else:
    @app.get("/")
    async def root():
        return {
            "message": f"Welcome to {settings.APP_NAME} API",
            "docs": "/api/docs",
            "health": "/health",
        }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
