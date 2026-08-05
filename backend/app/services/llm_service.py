import os

from groq import Groq
from app.config import GROQ_API_KEY


def _get_client():
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not configured")
    return Groq(api_key=GROQ_API_KEY)


def generate_response(prompt):
    print("\n========== GROQ CALL ==========")
    print("Sending Request To LLM")

    try:
        client = _get_client()
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
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