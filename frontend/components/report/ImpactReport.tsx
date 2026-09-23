"use client";

import { useEffect, useState } from "react";

import ExecutiveSummary from "./ExecutiveSummary";
import AffectedFiles from "./AffectedFiles";
import RetrievedDocs from "./RetrievedDocs";
import TestCases from "./TestCases";
import ReasoningPanel from "./ReasoningPanel";
import { pdfdownload } from "../../app/services/pdfdownload";

type Props = {
  pipelineCompleted: boolean;
};


export default function ImpactReport({
  pipelineCompleted
}: Props) {

  const [report, setReport] = useState<any>(null);

  useEffect(() => {

    if (!pipelineCompleted) return;


    const stored = sessionStorage.getItem("analysisResult");

    if (!stored || stored === "undefined") {
      return;
    }


    try {

      const parsed = JSON.parse(stored);

      setReport(parsed);

    } catch (err) {

      console.error("Invalid analysis report JSON:", err);

    }


  }, [pipelineCompleted]);

  if (!report) return null;
  const handleDownloadReport = async () => {

    try {

      const blob = await pdfdownload(report);


      const url =
        window.URL.createObjectURL(blob);


      const link =
        document.createElement("a");


      link.href = url;


      link.download =
        `Regression_Report_PR_${report.pr_number}.pdf`;


      document.body.appendChild(link);


      link.click();


      document.body.removeChild(link);


      window.URL.revokeObjectURL(url);


    } catch (error) {

      console.error(
        "Report download failed:",
        error
      );

    }

  };

  return (
    <section
      id="report"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="flex flex-col gap-6 border-b border-slate-800/80 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            Regression analysis
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Regression Impact Report
          </h1>
          <p className="mt-2 text-sm text-slate-400">Pull request #{report.pr_number} <span className="mx-2 text-slate-700">/</span> analyzed just now</p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-blue-400/60 hover:bg-slate-800 md:w-auto"
        >
          <span aria-hidden="true">↓</span>
          Download Report
        </button>
      </div>

      <ExecutiveSummary report={report} />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AffectedFiles files={report.files ?? []} />
        <TestCases report={report} />
      </div>

      <ReasoningPanel decision={report.agent_decision} />

      <RetrievedDocs docs={report.retrieved_documents ?? []} />

    </section>
  );
}