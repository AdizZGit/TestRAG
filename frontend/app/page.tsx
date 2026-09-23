"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DocUpload from "@/components/DocUpload";
import GitHubConnect from "@/components/GitHubConnect";
import Pipeline from "@/components/Pipeline";
import ImpactReport from "@/components/report/ImpactReport";
import Footer from "@/components/Footer";

const NOTICE_KEY = "regressai-first-visit-notice";

export default function Home() {
  const [showPipeline, setShowPipeline] = useState(false);
  const [pipelineCompleted, setPipelineCompleted] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const hasSeenNotice = window.localStorage.getItem(NOTICE_KEY) === "true";
    if (!hasSeenNotice) {
      setShowNotice(true);
    }
  }, []);

  const dismissNotice = () => {
    window.localStorage.setItem(NOTICE_KEY, "true");
    setShowNotice(false);
  };

  return (
    <main>
      {showNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-black/40">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
                  Quick note
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  For best results
                </h2>
              </div>
              <button
                type="button"
                onClick={dismissNotice}
                className="rounded-full border border-slate-700 px-2 py-1 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
                aria-label="Close notice"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm leading-6 text-slate-300">
              <p>
                For best results, choose PRs with fewer files and smaller change sets.
              </p>
              <p>
                Since this app uses a free-tier LLM, longer requests may time out or produce incomplete results.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={dismissNotice}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />

      <Hero />

      <DocUpload />

      <GitHubConnect
        onAnalysisStarted={() => setShowPipeline(true)}
      />

      {showPipeline && (
        <Pipeline
          onCompleted={() => {
            setPipelineCompleted(true);

            setTimeout(() => {
              document.getElementById("report")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 300);
          }}
        />
      )}

      <ImpactReport pipelineCompleted={pipelineCompleted} />

      {pipelineCompleted && <Footer />}
    </main>
  );
}