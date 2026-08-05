from app.services.embedding_service import create_embedding
from app.services.vector_store import collection


def search_documents(query: str, top_k=10):

    print("\n========== VECTOR SEARCH ==========")

    print(query)

    embedding = create_embedding(query)

    results = collection.query(
        query_embeddings=[embedding],
        n_results=top_k,
        include=["documents", "metadatas", "distances"]
    )

    response = []

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]
    distances = results["distances"][0]

    for doc, metadata, distance in zip(documents, metadatas, distances):

        response.append({
            "content": doc,
            "score": 1 - distance,
            "metadata": metadata
        })

    return response