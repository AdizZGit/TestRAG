from groq import Groq
from app.config import GROQ_API_KEY

client = Groq(
    api_key=GROQ_API_KEY
)

def generate_response(prompt):

    print("\n========== GROQ CALL ==========")
    print("Sending Request To LLM")

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    answer = response.choices[0].message.content

    print("\nResponse Received")
    print(answer[:500])

    print("\n========== GROQ END ==========\n")

    return answer