from functools import lru_cache


@lru_cache(maxsize=1)
def get_model():
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer("BAAI/bge-small-en-v1.5")


def create_embedding(text: str):
    model = get_model()
    return model.encode(text, normalize_embeddings=True).tolist()