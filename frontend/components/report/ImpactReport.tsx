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

    console.log("Stored:", stored);


    if (!stored || stored === "undefined") {
      console.log("No report found");
      return;
    }


    try {

      const parsed = JSON.parse(stored);

      console.log("Parsed Report:", parsed);

      setReport(parsed);

    } catch (err) {

      console.error("Invalid JSON:", err);

    }


  }, [pipelineCompleted]);

  if (!report) return null;
  console.log(report);
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
      className="mx-auto max-w-7xl px-6 py-28"
    >
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <p className="text-sm uppercase tracking-[0.35em] text-blue-400">
            Step 04
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white">
            Regression Impact Report
          </h1>

          <p className="mt-3 text-slate-400">
            PR #{report.pr_number}
          </p>

        </div>

        <button
          onClick={handleDownloadReport}
          className="
    rounded-xl 
    border 
    border-blue-500/30 
    bg-blue-500/10 
    px-6 
    py-3 
    text-blue-400 
    transition 
    hover:bg-blue-500/20
  "
        >
          Download Report
        </button>

      </div>

      <ExecutiveSummary report={report} />

      <div className="mt-10 grid gap-8 lg:grid-cols-2">

        <AffectedFiles
          files={report.files}
        />

        <RetrievedDocs
          docs={report.retrieved_documents}
        />

      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">

        <TestCases
          report={report}
        />

        <ReasoningPanel
  decision={report.agent_decision}
/>

      </div>

    </section>
  );
}