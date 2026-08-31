import json

from app.services.llm_service import generate_response


MAX_DOCUMENTS = 3
MAX_CHUNK_CHARS = 2000
MAX_CHANGED_FILES_CHARS = 4000
MAX_PR_SUMMARY_CHARS = 3000


class QAAgent:

    def __init__(self):
        print("Initializing QA Agent...")

    def analyze(
        self,
        pr_summary: str,
        changed_files: list,
        retrieved_documents: list
    ):

        # ------------------------------------
        # Decision 1
        # Should we retrieve more context?
        # ------------------------------------

        need_more_retrieval = self._need_more_retrieval(
            retrieved_documents
        )

        if need_more_retrieval:

            return {
                "need_more_retrieval": True,
                "reason": "Retrieved context is insufficient."
            }

        # ------------------------------------
        # Build final QA planning prompt
        # ------------------------------------

        prompt = self._build_prompt(
            pr_summary,
            changed_files,
            retrieved_documents
        )

        print("\n========== QA AGENT PROMPT ==========")
        print(f"Prompt length: {len(prompt)} characters")
        print("======================================")

        response = generate_response(prompt)

        try:

            response = (
                response
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

            decision = json.loads(response)

        except Exception as e:

            print(f"QA Agent JSON parsing failed: {e}")

            decision = {
                "risk_level": "Not Found",
                "risk_reason": "",
                "testing_strategy": [],
                "priority_test_cases": [],
                "coverage_gaps": [],
                "report_focus": [],
                "reason": "Unable to parse agent response."
            }

        decision["need_more_retrieval"] = False

        return decision

    # --------------------------------------------------
    # Retrieval quality check
    # --------------------------------------------------

    def _need_more_retrieval(self, documents):

        if len(documents) < 3:
            return True

        rerank_scores = [
            d.get("rerank_score")
            for d in documents
            if d.get("rerank_score") is not None
        ]

        if not rerank_scores:
            return False

        best_score = max(rerank_scores)

        # Extremely poor retrieval
        if best_score < -8:
            return True

        # Accept moderately relevant chunks.
        # Your CrossEncoder scores are negative,
        # so -6 is a more practical threshold than -2.
        strong_chunks = [
            score
            for score in rerank_scores
            if score > -6
        ]

        if len(strong_chunks) < 2:
            return True

        return False

    # --------------------------------------------------
    # Build compact prompt
    # --------------------------------------------------

    def _build_prompt(
        self,
        pr_summary,
        changed_files,
        retrieved_documents
    ):

        # ------------------------------------
        # Limit PR summary
        # ------------------------------------

        pr_summary = str(pr_summary)[:MAX_PR_SUMMARY_CHARS]

        # ------------------------------------
        # Compact changed files
        # ------------------------------------

        changed_files_parts = []

        for file in changed_files[:20]:

            filename = file.get(
                "filename",
                "Unknown"
            )

            status = file.get(
                "status",
                "modified"
            )

            additions = file.get(
                "additions",
                0
            )

            deletions = file.get(
                "deletions",
                0
            )

            changed_files_parts.append(
                f"{filename} | "
                f"{status} | "
                f"+{additions}/-{deletions}"
            )

        changed_files_text = "\n".join(
            changed_files_parts
        )

        changed_files_text = (
            changed_files_text[:MAX_CHANGED_FILES_CHARS]
        )

        # ------------------------------------
        # Retrieved documents
        # ------------------------------------

        context_parts = []

        documents = retrieved_documents[:MAX_DOCUMENTS]

        for doc in documents:

            metadata = doc.get(
                "metadata",
                {}
            )

            source_file = metadata.get(
                "source_file",
                "Unknown"
            )

            content = doc.get(
                "content",
                ""
            )

            content = content[:MAX_CHUNK_CHARS]

            context_parts.append(
                f"""
Source:
{source_file}

Content:
{content}
"""
            )

        context = "\n----------------------------------------\n".join(
            context_parts
        )

        # ------------------------------------
        # Final prompt
        # ------------------------------------

        prompt = f"""
You are a Senior QA Lead acting as a QA Planning Agent.

Your responsibility is ONLY QA planning.

Do NOT generate the final QA report.

Use ONLY the supplied information.

Never invent:

- APIs
- modules
- requirements
- filenames
- automation scripts
- test cases

If information is unavailable, return an empty list.

=========================================
PULL REQUEST
=========================================

{pr_summary}

=========================================
CHANGED FILES
=========================================

{changed_files_text}

=========================================
RETRIEVED DOCUMENTS
=========================================

{context}

=========================================
YOUR DECISIONS
=========================================

1. Estimate PR Risk.

2. Decide the Testing Strategy.

3. Select the highest priority EXISTING test cases.

4. Identify testing coverage gaps.

5. Decide which topics the final QA report should emphasize.

IMPORTANT:

Only select test cases that actually appear
in the supplied retrieved documents.

Do not create new test case IDs.

Return ONLY valid JSON.

Expected format:

{{
    "risk_level": "Low",
    "risk_reason": "Brief reason",
    "testing_strategy": [
        "API Testing",
        "Integration Testing"
    ],
    "priority_test_cases": [
        "TC_GH_001",
        "TC_API_001"
    ],
    "coverage_gaps": [
        "Missing logging failure scenario"
    ],
    "report_focus": [
        "GitHub API",
        "Logging",
        "Error Handling"
    ]
}}

JSON ONLY.

Do not explain.
Do not use markdown.
"""

        return prompt