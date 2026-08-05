import importlib
import sys


def test_embedding_model_is_loaded_lazily(monkeypatch):
    import sentence_transformers

    class FailOnInit:
        def __init__(self, *args, **kwargs):
            raise AssertionError("SentenceTransformer should not initialize during import")

    monkeypatch.setattr(sentence_transformers, "SentenceTransformer", FailOnInit, raising=False)
    sys.modules.pop("app.services.embedding_service", None)

    module = importlib.import_module("app.services.embedding_service")

    assert callable(module.create_embedding)
