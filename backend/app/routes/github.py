# from fastapi import APIRouter

# from app.services.github_service import get_pull_requests, get_pr_files


# router = APIRouter()


# @router.get("/github/pulls")
# def list_prs():
#     print("\n========== GITHUB API CALL ==========")
#     return get_pull_requests()

# @router.get("/github/pulls/{pr_number}/files")
# def pr_files(pr_number: int):
#     return get_pr_files(pr_number)

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.github_service import (
    validate_github_token,
    get_repositories,
    get_pull_requests,
    get_pr_files,
)

router = APIRouter()


class GitHubConnectRequest(BaseModel):
    token: str


class PullRequestRequest(BaseModel):
    token: str
    owner: str
    repo: str


class PRFilesRequest(BaseModel):
    token: str
    owner: str
    repo: str
    pr_number: int


@router.post("/github/connect")
def connect_github(request: GitHubConnectRequest):

    user = validate_github_token(request.token)

    repositories = get_repositories(request.token)

    return {
        "authenticated": True,
        "username": user["login"],
        "repositories": repositories,
    }


@router.post("/github/pulls")
def list_pull_requests(request: PullRequestRequest):

    return get_pull_requests(
        token=request.token,
        owner=request.owner,
        repo=request.repo,
    )


@router.post("/github/pulls/files")
def pull_request_files(request: PRFilesRequest):

    return get_pr_files(
        token=request.token,
        owner=request.owner,
        repo=request.repo,
        pr_number=request.pr_number,
    )