from app.services.document_parser import parse_document
from app.services.chunker import chunk_text
from app.services.embedding_service import create_embedding
from app.services.vector_store import collection


def ingest_document(
    document_id: int,
    file_path: str,
    document_type: str,
    source_file: str
):

    print(f"Processing {source_file}...")

    # Step 1: Parse
    text = parse_document(file_path)

    # Step 2: Chunk
    chunks = chunk_text(text)

    print(f"Total Chunks: {len(chunks)}")

    # Step 3: Embed + Store
    for index, chunk in enumerate(chunks):

        embedding = create_embedding(chunk)

        collection.add(
            ids=[
                f"doc_{document_id}_chunk_{index}"
            ],

            documents=[
                chunk
            ],

            embeddings=[
                embedding
            ],

            metadatas=[{
                "document_id": document_id,
                "document_type": document_type,
                "source_file": source_file,
                "chunk_index": index
            }]
        )

    print("Document successfully stored in ChromaDB")