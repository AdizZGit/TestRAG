from fastapi import APIRouter
from pydantic import BaseModel

from app.services.analysis_service import analyze_pull_request

router = APIRouter()


class AnalyzePRRequest(BaseModel):
    token: str
    owner: str
    repo: str
    pr_number: int


@router.post("/analyze-pr")
def analyze(request: AnalyzePRRequest):

    return analyze_pull_request(
        token=request.token,
        owner=request.owner,
        repo=request.repo,
        pr_number=request.pr_number,
    )