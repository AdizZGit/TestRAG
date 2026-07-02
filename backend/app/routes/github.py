from fastapi import APIRouter

from app.services.github_service import get_pull_requests

router = APIRouter()


@router.get("/github/pulls")
def list_prs():

    return get_pull_requests()