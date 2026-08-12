# 0001 Fix Contradiction Detection and Surface Model Errors

**Status**: Proposed
**Date**: 2026-08-12
**Mode**: ENHANCEMENT

## Summary

The story continuity editor was not displaying intentional story contradictions on the website. Investigation revealed three root causes. First, the backend model setting in backend/.env was set to an exhausted Gemini model tier returning rate limit errors (HTTP 429). Second, the frontend editor caught network and API errors silently, so when rate limits occurred, no feedback or contradictions were rendered. Third, claims without prior saved canon memories were skipped entirely without evaluating intra paragraph facts.

This specification outlines the architecture changes to update the default model, implement robust multi model fallback in the backend, handle intra paragraph fact evaluation, and surface rate limit or API status directly in the user interface.

## Requirements

- AC-1: The backend MUST default to `gemini/gemini-3.6-flash` in `backend/.env` and automatically fall back to alternative working Gemini models if a rate limit occurs.
- AC-2: The backend `llm.py` completion handler MUST retry and cycle through a list of fallback models (`gemini/gemini-3.6-flash`, `gemini/gemini-flash-latest`, `gemini/gemini-3.5-flash-lite`) before throwing a 429 rate limit exception.
- AC-3: The backend `pipeline.py` MUST combine same paragraph facts with retrieved canon hits when judging claims so intra paragraph contradictions are detected immediately.
- AC-4: The frontend editor MUST NOT swallow API rate limits or network failures silently. It MUST display a visual status banner or toast when checking fails due to rate limits or quota issues.
- AC-5: The frontend MUST automatically retry failed paragraph checks after the rate limit backoff period expires.

## Decision

### 1. Multi Model Fallback in Backend LLM Module (`backend/app/llm.py`)

When calling `_raw_completion`, if a 429 RateLimitError or quota error occurs on the primary model, the backend will attempt a ordered list of fallback models before raising an `LLMRateLimited` exception.

Fallback sequence:
1. `gemini/gemini-3.6-flash`
2. `gemini/gemini-flash-latest`
3. `gemini/gemini-3.5-flash-lite`

### 2. Intra Paragraph Canon Fusion (`backend/app/pipeline.py`)

In `_check_against_canon`, before judging claims, any newly extracted facts from the current paragraph will be prepended to the candidate canon memory list. This ensures that sentence 2 claims in a paragraph can be judged against sentence 1 facts from the same paragraph without waiting for a separate database write cycle.

### 3. Surface Rate Limit Status in Frontend (`frontend/src/components/ManuscriptEditor.tsx` & `Workspace.tsx`)

Modify `ManuscriptEditor.tsx` to handle HTTP 429 rate limits and 5xx errors:
- Catch 429 responses and notify the parent `Workspace.tsx` component.
- Display a sleek warning badge in the editor toolbar showing when rate limits or server errors occur.
- Schedule a automatic re-check after the retry period.

## Consequences

- Authors will instantly see rate limit notices if free tier limits are reached instead of wondering why errors are missing.
- Multi model fallbacks eliminate downtime during single model quota exhaustion.
- Intentional errors within the same paragraph or chapter are caught immediately upon typing.
