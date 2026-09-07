"use client";

import { useState } from "react";
import {
  GitBranch,
  GitPullRequest,
  FolderGit2,
  Search,
  ArrowRight,
  User,
  FileCode2,
  GitCommitHorizontal,
} from "lucide-react";

const repositories = [
  "backend",
  "frontend",
  "payment-service",
];

const branches = [
  "main",
  "develop",
  "release",
];

const pullRequests = [
  {
    id: "#124",
    title: "feat: Payment Retry Logic",
    author: "Aditya Rangari",
    files: 18,
    commits: 4,
    repository: "backend",
    branch: "main",
  },
  {
    id: "#123",
    title: "fix: Login Session Timeout",
    author: "John Doe",
    files: 9,
    commits: 2,
    repository: "backend",
    branch: "develop",
  },
  {
    id: "#122",
    title: "refactor: Checkout API",
    author: "Jane Smith",
    files: 26,
    commits: 7,
    repository: "payment-service",
    branch: "main",
  },
];

export default function PRSelector() {
  const [repository, setRepository] = useState(repositories[0]);
  const [branch, setBranch] = useState(branches[0]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(pullRequests[0]);

  const filtered = pullRequests.filter((pr) =>
    `${pr.id} ${pr.title}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="mx-auto max-w-5xl px-6 py-28">

      {/* Heading */}

      <div className="text-center">

        <p className="text-sm uppercase tracking-[0.35em] text-blue-400">
          Step 02
        </p>

        {/* <h2 className="mt-4 text-4xl font-bold text-white">
          Select Pull Request
        </h2> */}

        <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-400">
          Choose a repository and pull request to generate an
          AI-powered regression impact report.
        </p>

      </div>

      {/* Card */}

      <div className="mt-16 rounded-3xl border border-slate-800 bg-slate-900/50 p-8">

        <div className="grid gap-8 md:grid-cols-3">

          {/* Repository */}

          <div>

            <label className="mb-3 flex items-center gap-2 text-sm text-slate-400">

              <FolderGit2 size={18} />

              Repository

            </label>

            <select
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              {repositories.map((repo) => (
                <option key={repo}>{repo}</option>
              ))}
            </select>

          </div>

          {/* Branch */}

          <div>

            <label className="mb-3 flex items-center gap-2 text-sm text-slate-400">

              <GitBranch size={18} />

              Branch

            </label>

            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              {branches.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>

          </div>

          {/* Search */}

          {/* <div>

            <label className="mb-3 flex items-center gap-2 text-sm text-slate-400">

              <GitPullRequest size={18} />

              Pull Request

            </label>

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Pull Request..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
              />

            </div>

          </div> */}

        </div>

        {/* Results */}

        <div className="mt-10 rounded-2xl border border-slate-800">

          {filtered.map((pr) => (

            <button
              key={pr.id}
              onClick={() => setSelected(pr)}
              className={`flex w-full items-center justify-between border-b border-slate-800 px-6 py-5 text-left transition last:border-none ${
                selected.id === pr.id
                  ? "bg-blue-500/10"
                  : "hover:bg-slate-800/50"
              }`}
            >

              <div>

                <p className="font-semibold text-white">
                  {pr.id}
                </p>

                <p className="mt-1 text-slate-400">
                  {pr.title}
                </p>

              </div>

              <GitPullRequest className="text-blue-400" />

            </button>

          ))}

        </div>

        {/* Selected */}

        <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-950/70 p-8">

          <h3 className="text-2xl font-semibold text-white">
            Selected Pull Request
          </h3>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <Info
              icon={<GitPullRequest size={18} />}
              label="Pull Request"
              value={selected.id}
            />

            <Info
              icon={<FolderGit2 size={18} />}
              label="Repository"
              value={selected.repository}
            />

            <Info
              icon={<GitBranch size={18} />}
              label="Branch"
              value={selected.branch}
            />

            <Info
              icon={<User size={18} />}
              label="Author"
              value={selected.author}
            />

            <Info
              icon={<FileCode2 size={18} />}
              label="Files Changed"
              value={selected.files.toString()}
            />

            <Info
              icon={<GitCommitHorizontal size={18} />}
              label="Commits"
              value={selected.commits.toString()}
            />

          </div>

          <div className="mt-10">

            <button className="group flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-medium text-white transition hover:bg-blue-500">

              Analyze Impact

              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />

            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">

      <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400">
        {icon}
      </div>

      <div>

        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="mt-1 font-medium text-white">
          {value}
        </p>

      </div>

    </div>
  );
}