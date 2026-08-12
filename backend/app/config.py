"""Backend settings, loaded from backend/.env (git-ignored)."""
import logging
import time
from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

# Load .env into os.environ so LiteLLM sees provider keys (OPENAI_API_KEY, GROQ_API_KEY, ...).
load_dotenv()

logger = logging.getLogger("continuity.config")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=False
    )

    # Supermemory Cloud API configuration.
    supermemory_api_url: str = "https://api.supermemory.ai"
    supermemory_api_key: str = ""

    # LLM for extraction + judging. Any LiteLLM model string:
    #   gemini/gemini-3.6-flash, groq/llama-3.3-70b-versatile, openai/gpt-4o, ...
    extractor_model: str = "gemini/gemini-3.6-flash"
    # Optional override for custom OpenAI-compatible endpoints (e.g. local Ollama).
    extractor_api_base: str | None = None

    # CORS origin for the Next.js dev server.
    frontend_origin: str = "http://localhost:3000"


settings = Settings()  # type: ignore[call-arg]


def resolve_supermemory_key() -> str:
    """Returns SUPERMEMORY_API_KEY from environment settings."""
    if settings.supermemory_api_key:
        return settings.supermemory_api_key
    raise RuntimeError(
        "SUPERMEMORY_API_KEY is not set. Please obtain an API key from https://supermemory.ai "
        "and set SUPERMEMORY_API_KEY in backend/.env"
    )


