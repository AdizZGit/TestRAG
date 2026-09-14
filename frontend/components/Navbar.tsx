"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Overview", href: "#workflow" },
  { label: "Knowledge Base", href: "#knowledge" },
  { label: "GitHub", href: "#github" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-5 z-50 flex justify-center px-3 sm:px-4">
      <div className="w-full max-w-5xl">
        <nav
          className={`flex w-full items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 sm:px-6 ${
            scrolled
              ? "border-slate-700/80 bg-slate-950/80 backdrop-blur-2xl shadow-lg shadow-black/30"
              : "border-slate-800 bg-slate-900/60 backdrop-blur-xl"
          }`}
        >
          <a href="#" className="text-xl font-bold tracking-tight text-white">
            Regress<span className="text-blue-400">Ai</span>
          </a>

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

          <a
            href="#knowledge"
            className="hidden rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-400 lg:inline-flex"
          >
            Get Started
          </a>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 p-2 text-slate-200 transition hover:border-slate-500 hover:text-white lg:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/95 p-3 shadow-xl shadow-black/30 lg:hidden">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#knowledge"
              onClick={() => setMobileOpen(false)}
              className="mt-2 block rounded-xl bg-blue-500 px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              Get Started
            </a>
          </div>
        )}
      </div>
    </header>
  );
}