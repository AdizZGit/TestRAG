import json

from app.services.llm_service import generate_response


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
        # Decision 2+
        # Planning
        # ------------------------------------

        prompt = self._build_prompt(
            pr_summary,
            changed_files,
            retrieved_documents
        )

        response = generate_response(prompt)

        try:

            response = (
                response
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

            decision = json.loads(response)

        except Exception:

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

        # Retrieval quality is poor
        if best_score < -5:
            return True

        # Very few useful chunks
        strong_chunks = [
            score for score in rerank_scores
            if score > -2
        ]

        if len(strong_chunks) < 2:
            return True

        return False

    # --------------------------------------------------

    def _build_prompt(
        self,
        pr_summary,
        changed_files,
        retrieved_documents
    ):

        context = ""

        for doc in retrieved_documents:

            context += f"""

Source:
{doc["metadata"]["source_file"]}

Content:
{doc["content"]}

----------------------------------------

"""

        return f"""
You are a Senior QA Lead acting as a QA Planning Agent.

Your responsibility is ONLY planning.

Do NOT generate the QA report.

Use ONLY the supplied information.

Never invent:

- APIs
- modules
- requirements
- filenames
- automation scripts
- test cases

If information is unavailable return an empty list.

=========================================
PULL REQUEST
=========================================

{pr_summary}

=========================================
CHANGED FILES
=========================================

{changed_files}

=========================================
RETRIEVED DOCUMENTS
=========================================

{context}

=========================================
YOUR DECISIONS
=========================================

1. Estimate PR Risk.

2. Decide the Testing Strategy.

3. Select the highest priority existing test cases.

4. Identify testing coverage gaps.

5. Decide which topics the final QA report should emphasize.

Examples:

- GitHub API
- Authentication
- Logging
- Database
- Regression
- Security
- Error Handling

Return ONLY valid JSON.

{{
    "risk_level":"Low",

    "risk_reason":"Brief reason",

    "testing_strategy":[
        "API Testing",
        "Integration Testing"
    ],

    "priority_test_cases":[
        "TC_GH_001",
        "TC_API_001"
    ],

    "coverage_gaps":[
        "Missing logging failure scenario"
    ],

    "report_focus":[
        "GitHub API",
        "Logging",
        "Error Handling"
    ]
}}

Return JSON only.

Do not explain.

Do not use markdown.
"""