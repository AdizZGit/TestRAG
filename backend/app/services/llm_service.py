import os

from groq import Groq
from app.config import GROQ_API_KEY


GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "openai/gpt-oss-120b"
)


def _get_client():
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not configured")

    return Groq(api_key=GROQ_API_KEY)


def generate_response(prompt):
    print("\n========== GROQ CALL ==========")
    print("Sending Request To LLM")
    print(f"Model: {GROQ_MODEL}")

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
            timeout=20
        )

        answer = response.choices[0].message.content

    except Exception as exc:
        print(f"LLM call failed: {exc}")
        return f"LLM analysis unavailable: {exc}"

    print("\nResponse Received")
    print(answer)

    print("\n========== GROQ END ==========\n")

    return answer