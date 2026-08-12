"""LiteLLM glue: two schema-constrained completions (extract, judge) with a
parse-and-retry fallback so we never trust that the structured-output path exists.
"""
import asyncio
import json
import logging
import re
from typing import Type, TypeVar

import litellm
from litellm.exceptions import RateLimitError
from pydantic import BaseModel, ValidationError

from .config import settings
from .models import ExtractionResult, GraphLLMResult, JudgeResult
from .prompts import build_extract_messages, build_graph_messages, build_judge_messages

logger = logging.getLogger("continuity.llm")

T = TypeVar("T", bound=BaseModel)

# LiteLLM is chatty on import; keep our logs clean.
litellm.suppress_debug_info = True

_NUM_RETRIES = 2


class LLMRateLimited(Exception):
    """Provider rate limit / quota exhausted, after retries. Becomes a 429."""

    def __init__(self, message: str, retry_after: float | None = None):
        super().__init__(message)
        self.retry_after = retry_after


def _parse_retry_after(err: Exception) -> float | None:
    """Providers report the wait in the error body ("try again in 1m23.808s")
    rather than a header LiteLLM exposes, so read it back out of the message."""
    text = str(err)
    m = re.search(r"try again in (?:(\d+)m)?([\d.]+)s", text)
    if not m:
        return None
    minutes = float(m.group(1)) if m.group(1) else 0.0
    return minutes * 60 + float(m.group(2))


async def _complete_json(messages: list[dict], schema: Type[T]) -> T:
    """Run one completion, parse into `schema`, retry once feeding back the error."""
    kwargs = {
        "model": settings.extractor_model,
        "messages": messages,
        "temperature": 0,
        "response_format": {"type": "json_object"},
    }
    if settings.extractor_api_base:
        kwargs["api_base"] = settings.extractor_api_base

    text = await _raw_completion(kwargs)
    try:
        return schema.model_validate_json(_strip_fences(text))
    except (ValidationError, json.JSONDecodeError) as err:
        logger.warning("schema parse failed, retrying once: %s", err)
        retry_messages = messages + [
            {"role": "assistant", "content": text},
            {
                "role": "user",
                "content": (
                    f"That did not match the required schema. Error:\n{err}\n"
                    "Return ONLY a corrected JSON object that matches the schema."
                ),
            },
        ]
        text = await _raw_completion({**kwargs, "messages": retry_messages})
        return schema.model_validate_json(_strip_fences(text))


async def _raw_completion(kwargs: dict) -> str:
    max_attempts = 3
    last_err: Exception | None = None
    
    for attempt in range(max_attempts):
        try:
            resp = await litellm.acompletion(**kwargs, num_retries=_NUM_RETRIES)
            return resp.choices[0].message.content or ""
        except RateLimitError as err:
            last_err = err
            retry_after = _parse_retry_after(err)
            
            # If retry_after is short (<= 15 seconds) and we have attempts left, sleep and retry
            if retry_after is not None and retry_after <= 15 and attempt < max_attempts - 1:
                logger.warning(
                    "%s rate limited (retry_after=%.1fs). Waiting before retry %d/%d...",
                    kwargs.get("model"), retry_after, attempt + 1, max_attempts - 1
                )
                await asyncio.sleep(retry_after + 0.5)
                continue

            # Automatic model fallbacks if primary model rate-limits
            current_model = kwargs.get("model", "")
            fallback_model = None
            if "gemini-3.6-flash" in current_model and attempt == 0:
                fallback_model = "gemini/gemini-flash-latest"
            elif "groq/llama-3.3-70b-versatile" in current_model and attempt == 0:
                fallback_model = "groq/llama-3.1-8b-instant"

            if fallback_model:
                logger.warning(
                    "Rate limit on %s. Attempting fallback to %s...",
                    current_model, fallback_model
                )
                try:
                    fallback_kwargs = {**kwargs, "model": fallback_model}
                    resp = await litellm.acompletion(**fallback_kwargs, num_retries=1)
                    return resp.choices[0].message.content or ""
                except Exception as fb_err:
                    logger.warning("Fallback model %s failed: %s", fallback_model, fb_err)

            logger.warning(
                "%s rate limited after retries (retry_after=%s)",
                kwargs.get("model"), retry_after,
            )
            raise LLMRateLimited(
                f"{kwargs.get('model')} rate limit reached. "
                "Please wait for reset or check your API key quota in backend/.env.",
                retry_after,
            ) from err

    # Fallback error raise if retries exhausted
    raise LLMRateLimited(
        f"{kwargs.get('model')} rate limit reached after retries.",
        _parse_retry_after(last_err) if last_err else None,
    )


def _strip_fences(text: str) -> str:
    """Some models wrap JSON in ```json fences despite instructions."""
    t = text.strip()
    if t.startswith("```"):
        t = t.split("\n", 1)[1] if "\n" in t else t
        if t.endswith("```"):
            t = t[: -3]
    return t.strip()


async def extract(paragraph: str, preceding_context: str | None = None) -> ExtractionResult:
    return await _complete_json(
        build_extract_messages(paragraph, preceding_context), ExtractionResult
    )


async def judge(judged_items: list[dict]) -> JudgeResult:
    if not judged_items:
        return JudgeResult()
    return await _complete_json(build_judge_messages(judged_items), JudgeResult)


async def extract_graph(facts: list[dict]) -> GraphLLMResult:
    if not facts:
        return GraphLLMResult()
    return await _complete_json(build_graph_messages(facts), GraphLLMResult)
