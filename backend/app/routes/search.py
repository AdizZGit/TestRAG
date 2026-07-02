from fastapi import APIRouter

from app.services.retrieval_service import search_documents

router = APIRouter()


@router.get("/search")
def search(query: str):

    return search_documents(query)