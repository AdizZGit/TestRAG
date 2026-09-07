"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DocUpload from "@/components/DocUpload";
import GitHubConnect from "@/components/GitHubConnect";
import Pipeline from "@/components/Pipeline";
import ImpactReport from "@/components/report/ImpactReport";

export default function Home() {
  const [showPipeline, setShowPipeline] = useState(false);
  const [pipelineCompleted, setPipelineCompleted] = useState(false);

  return (
    <main>
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

      <ImpactReport 
  pipelineCompleted={pipelineCompleted}
/>
    </main>
  );
}