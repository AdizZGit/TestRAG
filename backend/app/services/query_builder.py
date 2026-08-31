from app.services.llm_service import generate_response


# Production-safe limits to prevent Groq TPM/context errors
PATCH_PREVIEW_LENGTH = 250
MAX_CHANGED_FILES = 10
MAX_PROMPT_LENGTH = 7000


def build_search_query(changed_files):
    """
    Build a compact semantic search query from GitHub PR changes.

    The prompt is intentionally limited to prevent large PRs from
    exceeding the LLM token-per-minute/context limits.
    """

    print("Building semantic search query...")

    file_summaries = []

    for file in changed_files[:MAX_CHANGED_FILES]:

        filename = file.get("filename", "Unknown")
        status = file.get("status", "modified")
        additions = file.get("additions", 0)
        deletions = file.get("deletions", 0)

        patch = file.get("patch", "")

        if patch:
            patch = patch.strip()

            if len(patch) > PATCH_PREVIEW_LENGTH:
                patch = patch[:PATCH_PREVIEW_LENGTH] + "\n..."

        else:
            patch = "Patch not available."

        file_summaries.append(
            f"""File: {filename}
Status: {status}
Changes: +{additions} / -{deletions}
Patch:
{patch}
"""
        )

    omitted_files = max(0, len(changed_files) - MAX_CHANGED_FILES)

    additional_note = ""

    if omitted_files > 0:
        additional_note = (
            f"\n{omitted_files} additional changed files were omitted."
        )

    changed_files_summary = "\n".join(file_summaries)

    prompt = f"""
You are a Senior Software Architect helping a RAG system.

Analyze this GitHub Pull Request and create a compact semantic search query.

Changed Files:
{changed_files_summary}
{additional_note}

Identify:
- Overall change/purpose
- Impacted modules
- Affected features
- Technologies
- Testing focus
- Useful keywords for requirements, test cases, regression tests,
  API tests, automation scripts, and design documents.

Return ONLY plain text using this format:

Summary:
<one or two sentences>

Impacted Modules:
- ...

Features:
- ...

Technologies:
- ...

Testing Focus:
- ...

Search Intent:
<one concise paragraph>
"""

    # Final safety guard
    if len(prompt) > MAX_PROMPT_LENGTH:
        prompt = prompt[:MAX_PROMPT_LENGTH]

    print(f"Semantic query prompt length: {len(prompt)} characters")

    response = generate_response(prompt)

    if response:
        response = response.replace("```", "").strip()

    return response