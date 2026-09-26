import os
import time

from groq import Groq
from app.config import GROQ_API_KEY


GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "openai/gpt-oss-120b"
)
MAX_RATE_LIMIT_RETRIES = 2
DEFAULT_RETRY_DELAYS = (3, 8)


def _get_client():
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not configured")

    return Groq(api_key=GROQ_API_KEY)


def _is_rate_limit_error(error):
    response = getattr(error, "response", None)
    status_code = getattr(error, "status_code", None)

    if status_code is None and response is not None:
        status_code = getattr(response, "status_code", None)

    return status_code == 429


def _retry_delay(error, attempt):
    response = getattr(error, "response", None)
    headers = getattr(response, "headers", {}) if response else {}
    retry_after = headers.get("retry-after") or headers.get("Retry-After")

    if retry_after:
        try:
            return min(max(float(retry_after), 1), 30)
        except (TypeError, ValueError):
            pass

    return DEFAULT_RETRY_DELAYS[min(attempt, len(DEFAULT_RETRY_DELAYS) - 1)]


def generate_response(prompt):
    print("\n========== GROQ CALL ==========")
    print("Sending Request To LLM")
    print(f"Model: {GROQ_MODEL}")

    for attempt in range(MAX_RATE_LIMIT_RETRIES + 1):
        try:
            client = _get_client()

            response = client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0,
                timeout=60
            )

            answer = response.choices[0].message.content
            break

        except Exception as exc:
            if not _is_rate_limit_error(exc) or attempt == MAX_RATE_LIMIT_RETRIES:
                print(f"LLM call failed: {type(exc).__name__}")
                return f"LLM analysis unavailable: {exc}"

            delay = _retry_delay(exc, attempt)
            print(
                f"Groq rate limit reached; retrying in {delay:g} seconds "
                f"({attempt + 1}/{MAX_RATE_LIMIT_RETRIES})"
            )
            time.sleep(delay)

    print("\nResponse Received")
    print("LLM response received successfully")

    print("\n========== GROQ END ==========\n")

    return answer