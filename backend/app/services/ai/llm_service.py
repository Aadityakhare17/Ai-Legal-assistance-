"""
LLM Service — abstraction layer over Google Gemini API.
Swap LLM providers by changing this service.
"""
import json
import re
from typing import Optional, Dict, Any
from loguru import logger
from app.core.config import settings


class LLMService:
    def __init__(self):
        self._client = None
        self._model = None

    def _get_client(self):
        """Lazy-initialize Gemini client."""
        if self._model is None and settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self._model = genai.GenerativeModel(settings.GEMINI_MODEL)
                logger.info(f"Initialized Gemini model: {settings.GEMINI_MODEL}")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini: {e}")
        return self._model

    async def generate(self, prompt: str, system_instruction: str = None) -> str:
        """Generate text response from LLM."""
        model = self._get_client()
        if model is None:
            raise ValueError("LLM not configured. Please set GEMINI_API_KEY in environment.")

        try:
            full_prompt = f"{system_instruction}\n\n{prompt}" if system_instruction else prompt
            response = model.generate_content(full_prompt)
            return response.text
        except Exception as e:
            logger.error(f"LLM generation error: {e}")
            raise

    async def generate_json(self, prompt: str, system_instruction: str = None) -> Dict:
        """Generate and parse JSON response from LLM."""
        text = await self.generate(prompt, system_instruction)
        # Extract JSON from markdown code blocks if present
        json_match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
        if json_match:
            text = json_match.group(1)
        try:
            return json.loads(text.strip())
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error: {e}, text: {text[:200]}")
            raise ValueError(f"LLM returned invalid JSON: {e}")

    def get_embeddings(self, texts: list) -> list:
        """Get embeddings for a list of texts using Google embedding model."""
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not set")
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            result = genai.embed_content(
                model=settings.EMBEDDING_MODEL,
                content=texts,
                task_type="retrieval_document"
            )
            return result["embedding"] if isinstance(texts, str) else result["embedding"]
        except Exception as e:
            logger.error(f"Embedding error: {e}")
            raise


# Singleton instance
llm_service = LLMService()
