"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Lock,
  GitPullRequest,
  FolderGit2,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import {
  connectGithubPAT,
  getPullRequests,
  analyzePullRequest,
} from "@/app/services/githubService";

type Props = {
  onAnalysisStarted: () => void;
};


export default function GitHubConnect({ onAnalysisStarted }: Props) {
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");

  const [repositories, setRepositories] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState("");

  const [prs, setPrs] = useState<any[]>([]);
  const [selectedPR, setSelectedPR] = useState<number | null>(null);

  const [analyzing, setAnalyzing] = useState(false);

  const connectGithub = async () => {
    if (!token.trim()) return;

    try {
      setLoading(true);

      const response = await connectGithubPAT(token);

      setUsername(response.username);
      setRepositories(response.repositories);

      setConnected(true);

      setPrs([]);
      setSelectedRepo("");
      setSelectedPR(null);
    } catch (error) {
      console.error(error);
      alert("Invalid GitHub Token");
    } finally {
      setLoading(false);
    }
  };

  const onRepositoryChange = async (repo: string) => {
    setSelectedRepo(repo);
    setSelectedPR(null);

    const repository = repositories.find((r) => r.name === repo);

    if (!repository) return;

    try {
      const response = await getPullRequests(
        token,
        repository.owner,
        repository.name
      );

      setPrs(response);
    } catch (error) {
      console.error(error);
      alert("Unable to fetch Pull Requests");
    }
  };
  const onAnalyze = async () => {
    if (!selectedPR) return;

    try {
      setAnalyzing(true);
      const repository = repositories.find(
  (r) => r.name === selectedRepo
);

if (!repository) return;

      const result = await analyzePullRequest(
    token,
    repository.owner,
    repository.name,
    selectedPR
)
      console.log("Backend Result:", result);
      console.log("RESULT =", result);
      console.log("FILES =", result?.files);
      console.log("AGENT =", result?.agent_decision);

      sessionStorage.setItem(
        "analysisResult",
        JSON.stringify(result)
      );
      onAnalysisStarted();

      setTimeout(() => {
        document
          .getElementById("pipeline")
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);

      // Scroll to Pipeline section
      document
        .getElementById("pipeline")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

    } catch (error) {
      console.error(error);
      alert("Failed to analyze PR");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <section
      id="github"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-blue-400">
          Step 02
        </p>

        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Connect GitHub Repository
        </h2>

        <p className="mt-6 text-base leading-8 text-slate-400 sm:text-lg">
          Connect your GitHub account and choose a Pull Request to analyze.
        </p>
      </div>

      <div className="mt-14 rounded-3xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-xl sm:p-8 lg:p-10">
        {!connected ? (
          <>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-slate-800 p-4">
                <FaGithub
                  size={30}
                  className="text-white"
                />
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white">
                  GitHub Integration
                </h3>

                <p className="mt-1 text-slate-400">
                  Authenticate using a Personal Access Token.
                </p>
              </div>
            </div>

            <div className="mt-10">
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Personal Access Token
              </label>

              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxx"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <Lock size={16} />
              Token is used only for this session and is never stored.
            </div>

            <button
              disabled={!token || loading}
              onClick={connectGithub}
              className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />
                  Connecting...
                </>
              ) : (
                <>
                  <FaGithub size={20} />
                  Connect GitHub
                </>
              )}
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
              <CheckCircle2
                size={28}
                className="text-emerald-400"
              />

              <div>
                <h3 className="text-xl font-semibold text-white">
                  Connected Successfully
                </h3>

                <p className="text-slate-400">
                  Connected as{" "}
                  <span className="text-white">
                    {username}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {/* Repository */}

              <div>
                <label className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <FolderGit2 size={16} />
                  Repository
                </label>

                <select
                  value={selectedRepo}
                  onChange={(e) =>
                    onRepositoryChange(e.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-white outline-none focus:border-blue-500"
                >
                  <option value="">
                    Select Repository
                  </option>

                  {repositories.map((repo) => (
                    <option
                      key={repo.name}
                      value={repo.name}
                    >
                      {repo.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pull Requests */}

              <div>
                <label className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <GitPullRequest size={16} />
                  Pull Request
                </label>

                <select
                  value={selectedPR ?? ""}
                  onChange={(e) =>
                    setSelectedPR(Number(e.target.value))
                  }
                  disabled={!selectedRepo}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-white outline-none focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">
                    Select Pull Request
                  </option>

                  {prs.map((pr: any) => (
                    <option
                      key={pr.number}
                      value={pr.number}
                    >
                      PR #{pr.number} - {pr.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              disabled={!selectedPR || analyzing}
              onClick={onAnalyze}
              className="mt-12 w-full rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <Loader2
                    size={20}
                    className="mr-2 inline animate-spin"
                  />
                  Starting Analysis...
                </>
              ) : (
                "Analyze Pull Request →"
              )}
            </button>
          </>
        )}
      </div>
    </section>
  );
}