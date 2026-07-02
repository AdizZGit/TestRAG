from app.services.retrieval_service import search_documents
from app.services.reranker_service import rerank_results
from app.services.impact_analysis_service import generate_impact_analysis


def analyze_diff(diff_text):

    print("\n===================================")
    print("DIFF RECEIVED")
    print("===================================")

    print(diff_text)

    chunks = search_documents(
        query=diff_text,
        top_k=20
    )

    print(f"\nRetrieved Chunks: {len(chunks)}")

    chunks = rerank_results(
        query=diff_text,
        chunks=chunks
    )

    chunks = chunks[:5]

    print("\nTop 5 After Reranking")

    for chunk in chunks:

        print(
            chunk["metadata"].get("source_file"),
            chunk["rerank_score"]
        )

    print("\nCalling LLM Impact Analysis...")

    analysis = generate_impact_analysis(
        diff_text=diff_text,
        matched_documents=chunks
    )

    print("\nImpact Analysis Generated")

    return {
        "matched_documents": chunks,
        "impact_analysis": analysis
    }