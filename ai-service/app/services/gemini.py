import os
import json
import logging
from google import genai
from google.genai import types

logger = logging.getLogger("cvniche-ai")

class GeminiService:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        self.client = None
        if self.api_key and self.api_key != "your-gemini-api-key-here":
            try:
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Gemini Client successfully initialized.")
            except Exception as e:
                logger.error(f"Error initializing Gemini client: {e}")
        else:
            logger.warning("GEMINI_API_KEY not found or is placeholder. AI endpoints will run in Mock Mode.")

    def generate_json(self, prompt: str, schema_class=None, mock_fallback=None) -> dict:
        if not self.client:
            logger.info("Running in Mock Mode. Returning fallback content.")
            return mock_fallback or {}

        try:
            # We use gemini-2.5-flash as the fast, cost-effective default model for text tasks
            config = types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            )
            
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=config
            )
            
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Gemini API execution failed: {e}. Falling back to mock data.")
            return mock_fallback or {}

    def generate_text(self, prompt: str, mock_fallback: str) -> str:
        if not self.client:
            return mock_fallback

        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            return response.text
        except Exception as e:
            logger.error(f"Gemini text execution failed: {e}. Falling back to mock.")
            return mock_fallback

    def get_embeddings(self, text: str) -> list[float]:
        if not self.client:
            # Return a mock 768-dimensional vector
            import random
            random.seed(hash(text))
            return [random.uniform(-0.1, 0.1) for _ in range(768)]

        try:
            response = self.client.models.embed_content(
                model="text-embedding-004",
                contents=text
            )
            # Response contains embedding values
            return response.embeddings[0].values
        except Exception as e:
            logger.error(f"Failed to generate embeddings: {e}")
            import random
            return [random.uniform(-0.1, 0.1) for _ in range(768)]

gemini_service = GeminiService()
