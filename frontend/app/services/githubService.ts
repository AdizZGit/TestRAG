import { axiosPost } from "@/app/api/axios";

export interface ConnectGithubResponse {
  authenticated: boolean;
  username: string;
  repositories: Repository[];
}

export interface Repository {
  name: string;
  owner: string;
  private: boolean;
  default_branch: string;
}

export interface PullRequest {
  number: number;
  title: string;
  state: string;
  author: string;
  created_at: string;
}

export interface PRFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  patch: string;
}
export interface AnalyzePRResponse {
  pr_number: number;
  total_files_changed: number;
  total_additions: number;
  total_deletions: number;
  total_changes: number;
  files: any[];
  agent_decision: any;
  retrieved_documents: any[];
  analysis: string;
}

export const connectGithubPAT = async (
  token: string
) => {
  return await axiosPost<ConnectGithubResponse>(
    "/github/connect",
    {
      token,
    }
  );
};

export const getPullRequests = async (
  token: string,
  owner: string,
  repo: string
) => {
  return await axiosPost<PullRequest[]>(
    "/github/pulls",
    {
      token,
      owner,
      repo,
    }
  );
};

export const getPullRequestFiles = async (
  token: string,
  owner: string,
  repo: string,
  pr_number: number
) => {
  return await axiosPost<PRFile[]>(
    "/github/pulls/files",
    {
      token,
      owner,
      repo,
      pr_number,
    }
  );
};

export const analyzePullRequest = async (
  token: string,
  owner: string,
  repo: string,
  prNumber: number
) => {
  return await axiosPost<AnalyzePRResponse>(
    "/analyze-pr",
    {
      token,
      owner,
      repo,
      pr_number: prNumber,
    }
  );
};