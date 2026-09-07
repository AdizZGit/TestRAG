"use client";

import { useEffect, useState } from "react";

const navItems = [
  { label: "Workflow", href: "#workflow" },
  { label: "Knowledge Base", href: "#knowledge" },
  { label: "GitHub", href: "#github" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Report", href: "#report" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-5 z-50 flex justify-center px-4">

      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-full border px-6 py-3 transition-all duration-300 ${
          scrolled
            ? "border-slate-700/80 bg-slate-950/80 backdrop-blur-2xl shadow-lg shadow-black/30"
            : "border-slate-800 bg-slate-900/60 backdrop-blur-xl"
        }`}
      >

        {/* Logo */}

        <a
          href="#"
          className="text-xl font-bold tracking-tight text-white"
        >
          Ar<span className="text-blue-400">ia</span>
        </a>

        {/* Navigation */}

        <div className="hidden items-center gap-7 lg:flex">

          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition-colors duration-200 hover:text-white"
            >
              {item.label}
            </a>
          ))}

        </div>

        {/* CTA */}

        <a
          href="#knowledge"
          className="rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-400"
        >
          Get Started
        </a>

      </nav>

    </header>
  );
}