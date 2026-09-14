"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!glowRef.current) return;

      const x = (e.clientX / window.innerWidth - 0.5) * 45;
      const y = (e.clientY / window.innerHeight - 0.5) * 45;

      glowRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!glowRef.current) return;
      glowRef.current.style.opacity = `${Math.max(0.4, 1 - window.scrollY / 600)}`;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="workflow" className="relative min-h-screen overflow-hidden bg-[#030712]">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0B1220] to-[#030712]" />

        <div
          ref={glowRef}
          className="hero-glow absolute left-1/2 top-1/2 h-[750px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/15 blur-[130px]"
        />

        <div className="hero-glow-secondary absolute left-[60%] top-[55%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 blur-[100px]" />

        <div className="hero-grid hero-grid-masked absolute inset-0 opacity-40" />

        <div className="grain pointer-events-none absolute inset-0" />

      </div>

      {/* Content */}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6">

        {/* Badge */}

        <div
          className="fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/5 px-3 py-1"
          style={{ animationDelay: "0s", opacity: 0 }}
        >
          <span className="badge-dot h-2 w-2 rounded-full bg-blue-400" />
          <span className="text-xs font-medium uppercase tracking-widest text-blue-400">
            Enterprise Beta
          </span>
        </div>

        {/* Heading */}

        <h1 className="max-w-4xl text-3xl leading-tight tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
          <span
            className="fade-up inline-block font-bold"
            style={{ animationDelay: "0.15s", opacity: 0 }}
          >
            Detect Regression Risks
          </span>
          <br />
          <span
            className="fade-up inline-block font-medium  text-white/90"
            style={{ animationDelay: "0.3s", opacity: 0 }}
          >
            Before Deployment
          </span>
        </h1>

        {/* Subtitle */}

        <p
          className="fade-up mt-8 max-w-2xl text-lg leading-8 text-slate-400"
          style={{ animationDelay: "0.45s", opacity: 0 }}
        >
          Analyze GitHub Pull Requests and instantly generate AI-powered QA
          regression reports using Retrieval-Augmented Generation.
        </p>

        {/* Buttons */}

        <div
          className="fade-up mt-12 flex w-full max-w-md flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center"
          style={{ animationDelay: "0.6s", opacity: 0 }}
        >
          <button
            type="button"
            onClick={() =>
              document.getElementById("knowledge")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-blue-200 px-6 py-4 font-medium text-slate-900 shadow-[0_0_20px_rgba(147,197,253,0.7)] transition-all hover:scale-[1.02] hover:brightness-105 sm:w-auto sm:px-8"
          >
            Explore Workflow
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>

          <a
            href="https://github.com/AdizZGit/TestRAG"
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center rounded-lg border border-white/10 px-6 py-4 font-medium text-slate-200 transition-all hover:scale-[1.02] hover:bg-white/5 sm:w-auto sm:px-8"
          >
            View Source
          </a>
        </div>
        {/* Product mockup */}

      </div>

    </section>
  );
}