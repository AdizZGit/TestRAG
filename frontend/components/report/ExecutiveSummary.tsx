"use client";

import {
  ShieldAlert,
  BrainCircuit,
  FolderGit2,
  Files,
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
      title: "Testing Strategy",
      value: report.agent_decision?.testing_strategy ?? [],
      subtitle: "QA Agent Decision",
      icon: BrainCircuit,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
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
      title: "Retrieved Docs",
      value: report.retrieved_documents?.length ?? 0,
      subtitle: "RAG Context",
      icon: Files,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isArray = Array.isArray(card.value);

        return (
          <div
            key={card.title}
            className={`rounded-2xl border ${card.border} bg-slate-900/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40`}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left Content */}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-400">
                  {card.title}
                </p>

                {isArray ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {card.value.length ? (
                      card.value.map((item: string) => (
                        <span
                          key={item}
                          className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500">
                        N/A
                      </span>
                    )}
                  </div>
                ) : (
                  <h2
                    className={`mt-3 text-3xl font-bold ${card.color}`}
                  >
                    {card.value}
                  </h2>
                )}

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