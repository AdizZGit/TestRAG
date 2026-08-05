from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk_text(
    text: str,
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
):

    recursive_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )

    # Step 1: Split into natural paragraphs
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

    chunks = []
    current_chunk = ""

    # Step 2: Merge paragraphs until chunk size is reached
    for paragraph in paragraphs:

        if len(current_chunk) + len(paragraph) < chunk_size:
            current_chunk += "\n\n" + paragraph if current_chunk else paragraph
        else:
            chunks.append(current_chunk)
            current_chunk = paragraph

    if current_chunk:
        chunks.append(current_chunk)

    # Step 3: Recursively split oversized chunks
    final_chunks = []

    for chunk in chunks:

        if len(chunk) <= chunk_size:
            final_chunks.append(chunk)
        else:
            final_chunks.extend(
                recursive_splitter.split_text(chunk)
            )

    return final_chunks

