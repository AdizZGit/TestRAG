"use client";

import { useEffect, useState, useRef } from "react";
import {
  GitPullRequest,
  Database,
  Search,
  BrainCircuit,
  Bot,
  FileText,
  CheckCircle2,
} from "lucide-react";
type Props = {
  onCompleted: () => void;
};

const pipeline = [
  {
    title: "GitHub Pull Request",
    subtitle: "Fetching changed files...",
    icon: GitPullRequest,
  },
  {
    title: "Retrieve Documents",
    subtitle: "Searching ChromaDB...",
    icon: Database,
  },
  {
    title: "Semantic Search",
    subtitle: "Finding relevant document chunks...",
    icon: Search,
  },
  {
    title: "Cross Encoder",
    subtitle: "Re-ranking retrieved documents...",
    icon: BrainCircuit,
  },
  {
    title: "QA Agent",
    subtitle: "Predicting regression impact...",
    icon: Bot,
  },
  {
    title: "Regression Report",
    subtitle: "Generating final AI report...",
    icon: FileText,
    final: true,
  },
];

export default function Pipeline({ onCompleted }: Props) {
  const [activeStage, setActiveStage] = useState(0);
  const [completed, setCompleted] = useState(false);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const completedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let current = 0;

    const timer = setInterval(() => {
      current++;

      if (current >= pipeline.length) {
        clearInterval(timer);
        setCompleted(true);

        setTimeout(() => {
          onCompleted();
        }, 800); // wait until "Analysis Completed" card is visible

        return;
      }

      setActiveStage(current);
    }, 1200);

    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (stageRefs.current[activeStage]) {
      stageRefs.current[activeStage]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeStage]);
  // useEffect(() => {
  //   if (completed) {
  //     completedRef.current?.scrollIntoView({
  //       behavior: "smooth",
  //       block: "center",
  //     });
  //   }
  // }, [completed]);

  return (
    <section
      id="pipeline"
      className="mx-auto max-w-6xl px-6 py-28"
    >
      {/* Heading */}

      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-blue-400">
          Step 03
        </p>

        <h2 className="mt-4 text-4xl font-bold text-white">
          AI Analysis Pipeline
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
          Your Pull Request is now being processed through multiple AI
          reasoning stages.
        </p>
      </div>

      {/* Timeline */}

      <div className="relative mx-auto mt-24 max-w-4xl">
        <div className="absolute left-8 top-0 bottom-0 w-px overflow-hidden bg-slate-800">
          <div className="animate-pipeline-flow absolute left-0 h-24 w-full bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-80" />
        </div>

        <div className="space-y-10">
          {pipeline.map((item, index) => {
            const Icon = item.icon;

            const isCompleted =
              completed || index < activeStage;

            const isActive =
              !completed && index === activeStage;

            return (
              <div
                key={item.title}
                ref={(el) => {
                  stageRefs.current[index] = el;
                }}
                className="relative flex items-center"
              >
                {/* Node */}

                <div
                  className={`
                    absolute
                    left-8
                    z-20
                    h-5
                    w-5
                    -translate-x-1/2
                    rounded-full
                    border-4
                    transition-all
                    duration-500

                    ${isActive
                      ? "border-white bg-blue-400 shadow-[0_0_18px_rgba(59,130,246,.9)]"
                      : isCompleted
                        ? "border-blue-500 bg-blue-400"
                        : "border-blue-500 bg-slate-950"
                    }
                  `}
                />

                {/* Card */}

                <div
                  className={`
                    ml-20
                    w-full
                    rounded-2xl
                    border
                    transition-all
                    duration-700

                    ${isActive
                      ? "border-blue-400 bg-slate-900 shadow-[0_0_35px_rgba(59,130,246,.25)]"
                      : isCompleted
                        ? "border-blue-500/40 bg-slate-900/80"
                        : item.final
                          ? "border-blue-500/40 bg-blue-500/10"
                          : "border-slate-800 bg-slate-900/60"
                    }
                  `}
                >
                  <div className="flex items-center gap-6 p-6">
                    <div
                      className={`
                        rounded-2xl
                        p-4
                        transition-all

                        ${isActive
                          ? "bg-blue-500/20 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,.45)]"
                          : isCompleted
                            ? "bg-blue-500/15 text-blue-400"
                            : item.final
                              ? "bg-blue-500 text-white"
                              : "bg-blue-500/10 text-blue-400"
                        }
                      `}
                    >
                      <Icon size={26} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-slate-400">
                        {item.subtitle}
                      </p>
                    </div>

                    <div
                      className={`
                        rounded-full
                        px-4
                        py-2
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider

                        ${isActive
                          ? "bg-blue-500 text-white"
                          : isCompleted
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-800 text-slate-400"
                        }
                      `}
                    >
                      {isCompleted ? "Done" : String(index + 1).padStart(2, "0")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {completed && (
        <div ref={completedRef} className="mt-16 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
          <CheckCircle2
            className="mx-auto text-emerald-400"
            size={42}
          />

          <h3 className="mt-4 text-2xl font-bold text-white">
            Analysis Completed
          </h3>

          <p className="mt-2 text-slate-400">
            Your AI Regression Impact Report has been generated successfully.
          </p>
        </div>
      )}

    </section>
  );
}