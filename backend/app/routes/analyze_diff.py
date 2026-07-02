from fastapi import APIRouter
from pydantic import BaseModel

from app.services.diff_analysis_service import analyze_diff

router = APIRouter()


class DiffRequest(BaseModel):
    diff: str


@router.post("/analyze-diff")
def analyze(request: DiffRequest):

    return analyze_diff(
        request.diff
    )