from sentence_transformers import CrossEncoder

reranker = CrossEncoder(
    "cross-encoder/ms-marco-MiniLM-L-6-v2"
)

def rerank_results(query, chunks):

    print("\n========== RERANK START ==========")

    pairs = []

    for chunk in chunks:
        pairs.append(
            [query, chunk["content"]]
        )

    scores = reranker.predict(pairs)

    for chunk, score in zip(chunks, scores):

        chunk["rerank_score"] = float(score)

        print("\nChunk:")
        print(chunk["content"][:100])
        print(f"Rerank Score: {score}")

    chunks.sort(
        key=lambda x: x["rerank_score"],
        reverse=True
    )

    print("\nTop Ranked Results:")

    for idx, chunk in enumerate(chunks):
        metadata = chunk.get("metadata", {})
        print(
            f"{idx+1}. "
            f"{metadata.get('source_file', 'Unknown')} "
            f"Score={chunk['rerank_score']}"
        )

    print("\n========== RERANK END ==========\n")

    return chunks