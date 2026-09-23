"use client";

import {
  ShieldAlert,
  FolderGit2,
  Files,
  FlaskConical,
} from "lucide-react";

type Props = {
  report: any;
};

export default function ExecutiveSummary({
  report,
}: Props) {
  const cards = [
    {
      title: "Regression Risk",
      value: report.agent_decision?.risk_level ?? "Unknown",
      subtitle: report.agent_decision?.risk_reason ?? "",
      icon: ShieldAlert,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
    {
      title: "Affected Files",
      value: report.total_files_changed,
      subtitle: `${report.total_changes} total changes`,
      icon: FolderGit2,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    {
      title: "Evidence Used",
      value: report.retrieved_documents?.length ?? 0,
      subtitle: "Retrieved RAG context",
      icon: Files,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Recommended Tests",
      value: report.agent_decision?.priority_test_cases?.length ?? 0,
      subtitle: "Suggested regression coverage",
      icon: FlaskConical,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`rounded-xl border ${card.border} bg-slate-900/70 p-5 transition-colors hover:border-slate-600`}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left Content */}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-400">
                  {card.title}
                </p>

                <h2 className={`mt-3 text-3xl font-semibold ${card.color}`}>
                  {card.value}
                </h2>

                <p className="mt-3 text-sm text-slate-500">
                  {card.subtitle}
                </p>
              </div>

              {/* Icon */}
              <div
                className={`${card.bg} flex-shrink-0 rounded-xl p-4`}
              >
                <Icon
                  className={card.color}
                  size={26}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}