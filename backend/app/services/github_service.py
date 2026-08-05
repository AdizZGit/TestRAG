
import requests

BASE_URL = "https://api.github.com"


def get_headers(token: str):
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
    }


def validate_github_token(token: str):
    """
    Validate GitHub PAT and return authenticated user.
    """

    url = f"{BASE_URL}/user"

    response = requests.get(
        url,
        headers=get_headers(token),
        timeout=15,
    )

    print(f"GitHub API token validated")
    response.raise_for_status()
    return response.json()


def get_repositories(token: str):
    """
    Fetch repositories accessible by the authenticated user.
    """

    url = f"{BASE_URL}/user/repos"

    response = requests.get(
        url,
        headers=get_headers(token),
        timeout=15,
    )
    print("Fetching repositories...")

    response.raise_for_status()

    repos = []

    for repo in response.json():
        repos.append(
            {
                "name": repo["name"],
                "owner": repo["owner"]["login"],
                "private": repo["private"],
                "default_branch": repo["default_branch"],
            }
        )

    return repos


def get_pull_requests(
    token: str,
    owner: str,
    repo: str,
):
    """
    Fetch pull requests for the selected repository.
    """

    url = f"{BASE_URL}/repos/{owner}/{repo}/pulls"

    response = requests.get(
        url,
        headers=get_headers(token),
        timeout=15,
    )

    response.raise_for_status()

    prs = []

    for pr in response.json():
        prs.append(
            {
                "number": pr["number"],
                "title": pr["title"],
                "state": pr["state"],
                "author": pr["user"]["login"],
                "created_at": pr["created_at"],
            }
        )
    print(f"Fetched {len(prs)} pull requests for {owner}/{repo}")

    return prs


def get_pr_files(
    token: str,
    owner: str,
    repo: str,
    pr_number: int,
):
    """
    Fetch changed files for a PR.
    """

    url = f"{BASE_URL}/repos/{owner}/{repo}/pulls/{pr_number}/files"

    response = requests.get(
        url,
        headers=get_headers(token),
        timeout=15,
    )

    response.raise_for_status()

    result = []

    for file in response.json():
        result.append(
            {
                "filename": file["filename"],
                "status": file["status"],
                "additions": file["additions"],
                "deletions": file["deletions"],
                "changes": file["changes"],
                "patch": file.get("patch", ""),
            }
        )
    print(f"Fetched {len(result)} files for PR #{pr_number} in {owner}/{repo}")
    return result