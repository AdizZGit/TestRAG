from app.services.llm_service import generate_response


def generate_impact_analysis(
    diff_text,
    matched_documents
):

    print("\n========== IMPACT ANALYSIS ==========")

    context = ""

    for idx, chunk in enumerate(matched_documents):

        print(
            f"\nContext Chunk #{idx+1}"
        )

        print(
            chunk["metadata"].get("source_file")
        )

        print(
            chunk["content"][:200]
        )

        context += chunk["content"]
        context += "\n\n"

    prompt = f"""
You are a Senior QA Engineer.

Git Diff:
{diff_text}

Relevant Documents:
{context}

Analyze:

1. Which feature changed?
2. What requirements are impacted?
3. What functionality might break?
4. Suggested test cases.
5. Risk Level.

Return JSON only.
"""

    print("\nPrompt Size:")
    print(len(prompt))

    response = generate_response(prompt)

    print("\nLLM Response:")
    print(response)

    print("\n========== IMPACT ANALYSIS END ==========\n")

    return response