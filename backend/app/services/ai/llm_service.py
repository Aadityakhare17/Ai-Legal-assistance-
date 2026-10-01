"""
LLM Service — Multi-provider abstraction layer supporting:
1. Grok (xAI API: https://api.x.ai/v1)
2. Google Gemini API
"""
import json
import re
import math
import hashlib
from typing import Optional, Dict, Any, List, Union
import httpx
from loguru import logger
from app.core.config import settings


class LLMService:
    def __init__(self):
        self._gemini_model = None

    def _get_gemini_client(self):
        """Lazy-initialize Gemini client."""
        if self._gemini_model is None and settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self._gemini_model = genai.GenerativeModel(settings.GEMINI_MODEL)
                logger.info(f"Initialized Gemini model: {settings.GEMINI_MODEL}")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini: {e}")
        return self._gemini_model

    async def _generate_grok(self, prompt: str, system_instruction: str = None) -> str:
        """Call xAI Grok API endpoint."""
        if not settings.GROK_API_KEY:
            raise ValueError("GROK_API_KEY not set")

        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        headers = {
            "Authorization": f"Bearer {settings.GROK_API_KEY.strip()}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": settings.GROK_MODEL,
            "messages": messages,
            "temperature": 0.1,
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            url = f"{settings.GROK_BASE_URL.rstrip('/')}/chat/completions"
            response = await client.post(url, headers=headers, json=payload)
            if response.status_code != 200:
                logger.error(f"Grok API error ({response.status_code}): {response.text}")
                response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

    async def _generate_gemini(self, prompt: str, system_instruction: str = None) -> str:
        """Call Google Gemini API."""
        model = self._get_gemini_client()
        if model is None:
            raise ValueError("GEMINI_API_KEY not set")
        full_prompt = f"{system_instruction}\n\n{prompt}" if system_instruction else prompt
        response = model.generate_content(full_prompt)
        return response.text

    async def generate(self, prompt: str, system_instruction: str = None) -> str:
        """Generate text response from active LLM provider (Grok or Gemini)."""
        provider = settings.active_llm_provider

        if provider == "grok":
            try:
                logger.info(f"Generating with Grok ({settings.GROK_MODEL})...")
                return await self._generate_grok(prompt, system_instruction)
            except Exception as e:
                logger.error(f"Grok generation failed: {e}")
                if settings.GEMINI_API_KEY:
                    logger.info("Falling back to Gemini...")
                    return await self._generate_gemini(prompt, system_instruction)
                raise

        elif provider == "gemini":
            try:
                logger.info(f"Generating with Gemini ({settings.GEMINI_MODEL})...")
                return await self._generate_gemini(prompt, system_instruction)
            except Exception as e:
                logger.error(f"Gemini generation failed: {e}")
                if settings.GROK_API_KEY:
                    logger.info("Falling back to Grok...")
                    return await self._generate_grok(prompt, system_instruction)
                raise

        else:
            raise ValueError("No LLM configured. Please set GROK_API_KEY or GEMINI_API_KEY in .env.")

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

    def get_embeddings(self, texts: Union[str, List[str]]) -> list:
        """Get embeddings using Google embedding model or fast deterministic local vectorizer."""
        if settings.GEMINI_API_KEY:
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
                logger.error(f"Gemini embedding error: {e}")

        # Local deterministic semantic representation for zero-dependency vector search
        def _text_to_vec(t: str, dim: int = 768) -> list:
            vec = [0.0] * dim
            tokens = re.findall(r"\w+", t.lower())
            if not tokens:
                return vec
            for token in tokens:
                h = int(hashlib.md5(token.encode("utf-8")).hexdigest(), 16)
                idx = h % dim
                vec[idx] += 1.0
            norm = math.sqrt(sum(x * x for x in vec)) or 1.0
            return [x / norm for x in vec]

        if isinstance(texts, str):
            return _text_to_vec(texts)
        return [_text_to_vec(t) for t in texts]


# Singleton instance
llm_service = LLMService()
