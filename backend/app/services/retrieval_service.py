from app.services.embedding_service import create_embedding
from app.services.vector_store import collection


def search_documents(
    query,
    top_k=10,
    filters=None
):

    print("\n========== SEARCH START ==========")
    print("Query:")
    print(query)

    query_embedding = create_embedding(query)

    print("\nEmbedding Generated")
    print(f"Embedding Dimensions: {len(query_embedding)}")

    query_params = {
        "query_embeddings": [query_embedding],
        "n_results": top_k,
        "include": ["documents", "metadatas", "distances"]
    }

    if filters:
        query_params["where"] = filters

    results = collection.query(**query_params)

    print("\nRaw Distances:")
    print(results["distances"])

    response = []

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]
    distances = results["distances"][0]

    for idx, (doc, metadata, distance) in enumerate(
        zip(documents, metadatas, distances)
    ):

        score = 1 - distance

        print(f"\nChunk #{idx+1}")
        print(f"Score: {score}")
        print(f"Document Type: {metadata.get('document_type')}")
        print(f"Source: {metadata.get('source_file')}")
        print(f"Content Preview: {doc[:150]}")

        response.append({
            "content": doc,
            "score": score,
            "metadata": metadata
        })

    print("\n========== SEARCH END ==========\n")

    return response