import requests

from app.config import (
    GITHUB_OWNER,
    GITHUB_REPO,
    GITHUB_TOKEN
)

BASE_URL = "https://api.github.com"

headers = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
}
def get_pull_requests():

    url = f"{BASE_URL}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/pulls"

    response = requests.get(
        url,
        headers=headers
    )
    print(f"GitHub API Response Status Code: {response.status_code}")   

    response.raise_for_status()

    return response.json()