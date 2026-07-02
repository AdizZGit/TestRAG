from app.services.vector_store import collection
from app.services.embedding_service import create_embedding

query = "RAG Architecture"

query_embedding = create_embedding(query)

results = collection.query(
    query_embeddings=[query_embedding],
    n_results=3
)

print(results["documents"])
print(results["metadatas"])