from app.services.llm_service import generate_response


def build_search_query(changed_files):

    print("Building semantic search query...")

    prompt = f"""
You are a Senior Software Architect helping a Retrieval-Augmented Generation (RAG) system.

Your task is to convert a GitHub Pull Request into a semantic search query that will be embedded and used to retrieve relevant project documentation.

Changed Files:

{changed_files}

Instructions:

- Understand the purpose of the PR.
- Summarize the change in natural language.
- Identify the impacted modules.
- Identify the affected features.
- Identify technologies involved.
- Identify the testing focus.
- Include keywords useful for retrieving:
  - requirements
  - design documents
  - test cases
  - regression suites
  - API tests
  - automation scripts

Do NOT return JSON.

Return ONLY plain text in the following format:

Summary:
<one or two sentences>

Impacted Modules:
- ...
- ...

Features:
- ...
- ...

Technologies:
- ...
- ...

Testing Focus:
- ...
- ...

Search Intent:
Find related requirements, test cases, regression tests, API tests, automation scripts, and design documents for the impacted modules.
"""

    response = generate_response(prompt)

    if response:
        response = response.replace("```", "").strip()

    return response