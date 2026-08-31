import json

from app.services.llm_service import generate_response


# ============================================================
# PRODUCTION-SAFE LIMITS
# ============================================================

MAX_DOCUMENTS = 3

# Maximum characters from each retrieved document
MAX_CHUNK_CHARS = 1200

# Maximum characters from Git diff
MAX_DIFF_CHARS = 4000

# Absolute maximum prompt size sent to the LLM
MAX_PROMPT_CHARS = 20000


def generate_impact_analysis(
    diff_text,
    matched_documents
):

    print("\n========== IMPACT ANALYSIS ==========")

    # ========================================================
    # 1. LIMIT GIT DIFF
    # ========================================================

    diff_text = str(diff_text or "")

    if len(diff_text) > MAX_DIFF_CHARS:

        print(
            f"Git diff truncated: "
            f"{len(diff_text)} -> {MAX_DIFF_CHARS} chars"
        )

        diff_text = diff_text[:MAX_DIFF_CHARS]

    # ========================================================
    # 2. LIMIT RETRIEVED DOCUMENTS
    # ========================================================

    matched_documents = (
        matched_documents or []
    )[:MAX_DOCUMENTS]

    context_parts = []

    # ========================================================
    # 3. BUILD COMPACT CONTEXT
    # ========================================================

    for idx, chunk in enumerate(
        matched_documents
    ):

        print(
            f"\nContext Chunk #{idx + 1}"
        )

        metadata = chunk.get(
            "metadata",
            {}
        )

        source_file = metadata.get(
            "source_file",
            "Unknown"
        )

        content = str(
            chunk.get(
                "content",
                ""
            )
        )

        # Limit individual chunk
        if len(content) > MAX_CHUNK_CHARS:

            print(
                f"Chunk truncated: "
                f"{len(content)} -> "
                f"{MAX_CHUNK_CHARS} chars"
            )

            content = content[
                :MAX_CHUNK_CHARS
            ]

        print(
            f"Source: {source_file}"
        )

        print(
            content[:200]
        )

        context_parts.append(
            f"""Source:
{source_file}

Content:
{content}

----------------------------------------"""
        )

    context = "\n\n".join(
        context_parts
    )

    # ========================================================
    # 4. BUILD PROMPT
    # ========================================================

    prompt = f"""
You are a Senior QA Engineer performing regression impact analysis.

Use ONLY the supplied Git diff and retrieved documents.

Do NOT invent information.

========================================
GIT DIFF
========================================

{diff_text}

========================================
RELEVANT DOCUMENTS
========================================

{context}

========================================
ANALYSIS
========================================

Determine:

1. Which feature or functionality changed?
2. Which requirements or modules are impacted?
3. What existing functionality might break?
4. Which existing test cases are relevant?
5. What coverage gaps exist?
6. What is the overall risk level?

Rules:

- Use ONLY information present in the supplied input.
- Do NOT invent APIs.
- Do NOT invent requirements.
- Do NOT invent modules.
- Do NOT invent filenames.
- Do NOT invent test cases.
- Only mention test cases explicitly present in the documents.
- If information is unavailable, return an empty list.
- Keep answers concise.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "feature_changed": "",
    "impacted_requirements": [],
    "potential_breakages": [],
    "suggested_test_cases": [],
    "coverage_gaps": [],
    "risk_level": "",
    "risk_reason": ""
}}

Return JSON only.
Do not explain.
Do not use markdown.
"""

    # ========================================================
    # 5. ABSOLUTE PROMPT SAFETY CAP
    # ========================================================

    if len(prompt) > MAX_PROMPT_CHARS:

        print(
            f"\nWARNING: Prompt exceeded hard limit."
        )

        print(
            f"Prompt size: {len(prompt)} chars"
        )

        print(
            f"Hard limit: {MAX_PROMPT_CHARS} chars"
        )

        # IMPORTANT:
        # Don't blindly cut the entire prompt because
        # that could remove the JSON instructions.
        #
        # Instead reduce the retrieved context first.

        available_context_chars = (
            MAX_PROMPT_CHARS
            - (
                len(prompt)
                - len(context)
            )
        )

        if available_context_chars < 0:
            available_context_chars = 0

        context = context[
            :available_context_chars
        ]

        # Rebuild prompt with reduced context
        prompt = f"""
You are a Senior QA Engineer performing regression impact analysis.

Use ONLY the supplied Git diff and retrieved documents.

Do NOT invent information.

GIT DIFF:
{diff_text}

RELEVANT DOCUMENTS:
{context}

Determine:

1. Which feature or functionality changed?
2. Which requirements or modules are impacted?
3. What existing functionality might break?
4. Which existing test cases are relevant?
5. What coverage gaps exist?
6. What is the overall risk level?

Rules:

- Use ONLY supplied information.
- Do NOT invent APIs, requirements, modules, filenames, or test cases.
- Only mention test cases explicitly present in the documents.
- If information is unavailable, return an empty list.
- Keep answers concise.

Return ONLY valid JSON.

{{
    "feature_changed": "",
    "impacted_requirements": [],
    "potential_breakages": [],
    "suggested_test_cases": [],
    "coverage_gaps": [],
    "risk_level": "",
    "risk_reason": ""
}}

Return JSON only.
Do not explain.
Do not use markdown.
"""

    print("\nPrompt Size:")
    print(
        len(prompt),
        "characters"
    )

    # ========================================================
    # 6. LLM CALL
    # ========================================================

    response = generate_response(
        prompt
    )

    print("\nLLM Response:")
    print(response)

    # ========================================================
    # 7. PARSE JSON
    # ========================================================

    try:

        cleaned_response = (
            str(response)
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        result = json.loads(
            cleaned_response
        )

    except Exception as e:

        print(
            "Failed to parse impact analysis:",
            e
        )

        result = {
            "feature_changed": "",
            "impacted_requirements": [],
            "potential_breakages": [],
            "suggested_test_cases": [],
            "coverage_gaps": [],
            "risk_level": "Not Found",
            "risk_reason": (
                "Unable to parse LLM response."
            )
        }

    # ========================================================
    # 8. PRINT RESULT
    # ========================================================

    print(
        "\nParsed Impact Analysis:"
    )

    print(
        json.dumps(
            result,
            indent=4
        )
    )

    print(
        "\n========== IMPACT ANALYSIS END ==========\n"
    )

    return result