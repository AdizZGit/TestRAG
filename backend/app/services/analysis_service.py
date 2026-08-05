import token

from app.services.github_service import get_pr_files
from app.services.retrieval_service import search_documents
from app.services.reranker_service import rerank_results
from app.services.llm_service import generate_response
from app.services.query_builder import build_search_query
from app.services.qa_agent import QAAgent


def analyze_pull_request(
    token: str,
    owner: str,
    repo: str,
    pr_number: int
):
    print(f"\nAnalyzing PR #{pr_number}")

    try:
        files = get_pr_files(
            token,
            owner,
            repo,
            pr_number
        )
    except Exception as exc:
        return {
            "pr_number": pr_number,
            "error": f"Unable to fetch PR files: {exc}",
            "analysis": "PR analysis could not be completed"
        }

    changed_files = []

    total_additions = 0
    total_deletions = 0
    total_changes = 0

    for file in files:

        total_additions += file["additions"]
        total_deletions += file["deletions"]
        total_changes += file["changes"]

        changed_files.append({
            "filename": file["filename"],
            "status": file["status"],
            "additions": file["additions"],
            "deletions": file["deletions"],
            "changes": file["changes"],
            "patch": file.get("patch", "")
        })

    # ----------------------------------------------------
    # Build Semantic Query
    # ----------------------------------------------------

    query = build_search_query(changed_files)

    if not query:
        query = str(changed_files)

    print("\n========== SEMANTIC QUERY ==========")
    print(query)
    print("====================================")

    # ----------------------------------------------------
    # Initial Retrieval
    # ----------------------------------------------------

    documents = search_documents(query) or []

    if documents:
        documents = rerank_results(query, documents)

    # ----------------------------------------------------
    # QA Agent Decision
    # ----------------------------------------------------

    print("\n========== QA AGENT ==========")

    qa_agent = QAAgent()
    decision = qa_agent.analyze(
        pr_summary=query,
        changed_files=changed_files,
        retrieved_documents=documents
    )

    print(decision)

    if decision.get("need_more_retrieval"):

        print("\nQA Agent requested another retrieval...")

        documents = search_documents(query, top_k=10) or []

        if documents:
            documents = rerank_results(query, documents)

    documents = documents[:5]

    # ----------------------------------------------------
    # Build Context
    # ----------------------------------------------------

    print("\n========== RETRIEVED DOCUMENTS ==========")

    context = ""

    for i, doc in enumerate(documents, start=1):

        metadata = doc.get("metadata", {})

        print(
            f"{i}. "
            f"{metadata.get('source_file', 'Unknown')} "
            f"Score={doc.get('score', 0):.4f}"
        )

        context += f"""
Document {i}

Source File:
{metadata.get("source_file", "Unknown")}

Chunk Index:
{metadata.get("chunk_index", "Unknown")}

Similarity Score:
{doc.get("score", 0)}

Content:
{doc.get("content", "")}

--------------------------------------------------
"""

    # ----------------------------------------------------
    # Final Prompt
    # ----------------------------------------------------

    prompt = f"""
    You are a Senior QA Automation Engineer.

    Your responsibility is to generate the FINAL QA Impact Report.

    You MUST use BOTH:

    1. Retrieved project documents
    2. QA Agent decisions

    The QA Agent has already analyzed the Pull Request and determined:

    - Risk Level
    - Testing Strategy
    - Priority Test Cases
    - Coverage Gaps

    The QA Agent has already completed the planning phase.

        Your responsibility is ONLY to write the report.

        Never re-decide

        - Risk
        - Testing Strategy
        - Priority Test Cases
        - Coverage Gaps
        - Report Focus

    Simply explain them using the retrieved evidence.
    ====================================================
    STRICT RULES
    ====================================================

    1. Use ONLY:
    - Pull Request Summary
    - Changed Files
    - Retrieved Documents
    - QA Agent Decision

    2. Never invent:
    - APIs
    - modules
    - requirements
    - automation scripts
    - filenames
    - regression areas
    - smoke tests

    3. Existing Test Cases
    Only list test cases found inside the retrieved documents.

    4. Missing Test Cases

    Use BOTH:
    - code changes
    - QA Agent coverage gaps

    Maximum 5.

    5. Automation Scripts

    If absent write exactly:

    No automation scripts identified.

    6. Regression Areas

    Use ONLY retrieved evidence.

    If unavailable write:

    Not Found

    7. Smoke Tests

    Use ONLY retrieved evidence.

    If unavailable write:

    Not Found

    8. API/UI Impact

    If UI is not mentioned:

    No UI impact identified.

    9. Risk Level

    Copy the QA Agent Risk Level exactly.

    10. Testing Priority

    High Risk -> High

    Medium Risk -> Medium

    Low Risk -> Low

    11. Final QA Recommendation

    Base your recommendation ONLY on

    - Risk Level
    - Testing Strategy
    - Priority Test Cases
    - Coverage Gaps
    - Report Focus

    12. Report Focus

    The QA Agent has already decided what the report should emphasize.

    DO NOT change this focus.

    Write the report emphasizing ONLY the areas listed in Report Focus.

    Do not introduce new focus areas.

    Do NOT invent additional reasoning.

    ====================================================
    QA AGENT DECISION
    ====================================================

    Risk Level:
    {decision.get("risk_level")}

    Risk Reason:
    {decision.get("risk_reason")}

    Testing Strategy:
    {decision.get("testing_strategy")}

    Priority Test Cases:
    {decision.get("priority_test_cases")}

    Coverage Gaps:
    {decision.get("coverage_gaps")}

    Report Focus:
    {decision.get("report_focus")}

    ====================================================
    PULL REQUEST SUMMARY
    ====================================================

    {query}

    ====================================================
    CHANGED FILES
    ====================================================

    {changed_files}

    ====================================================
    RETRIEVED DOCUMENTS
    ====================================================

    {context}

    ====================================================
    OUTPUT
    ====================================================

    ## Executive Summary

    ## Impacted Modules

    ## Existing Test Cases

    ## Missing Test Cases

    ## Automation Scripts Affected

    ## Regression Areas

    ## Smoke Tests Required

    ## API/UI Impact

    ## Risk Level

    ## Testing Priority

    ## Final QA Recommendation

    If information is unavailable return exactly:

    Not Found
    """
    # ----------------------------------------------------
    # Generate Report
    # ----------------------------------------------------

    analysis = generate_response(prompt)

    return {

        "pr_number": pr_number,

        "total_files_changed": len(changed_files),

        "total_additions": total_additions,

        "total_deletions": total_deletions,

        "total_changes": total_changes,

        "files": changed_files,

        "agent_decision": decision,

        "retrieved_documents": documents,

        "analysis": analysis
    }