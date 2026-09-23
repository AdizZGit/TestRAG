import { ArrowUpRight } from "lucide-react";

const links = [
	{ label: "LinkedIn", href: "#" },
	{ label: "GitHub", href: "https://github.com/AdizZGit/TestRAG" },
	{ label: "Email", href: "mailto:hello@example.com" },
];

export default function Footer() {
	return (
		<footer className="border-t border-slate-800/80 px-4 py-16 sm:px-6 sm:py-20">
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
					<div>
						<p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-400">
							Analysis complete
						</p>
						<h2 className="mt-4 max-w-md text-3xl font-semibold tracking-tight text-white sm:text-4xl">
							Liked what you saw?
							<br />
							<span className="text-slate-500">There&apos;s more behind the code.</span>
						</h2>
					</div>

					<div className="md:text-right">
						<p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
							Let&apos;s connect <span className="text-blue-400">-&gt;</span>
						</p>
						<nav aria-label="Social links" className="flex flex-wrap gap-x-5 gap-y-3 md:justify-end">
							{links.map((link) => (
								<a
									key={link.label}
									href={link.href}
									target={link.href.startsWith("http") ? "_blank" : undefined}
									rel={link.href.startsWith("http") ? "noreferrer" : undefined}
									className="group inline-flex items-center gap-1.5 text-sm text-slate-300 transition hover:text-white"
								>
									{link.label}
									<ArrowUpRight size={14} className="text-slate-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-400" />
								</a>
							))}
						</nav>
					</div>
				</div>

				<div className="mt-14 flex items-center justify-between border-t border-slate-800/70 pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
					<span>diff / context / decision</span>
					<span>RegressAI</span>
				</div>
			</div>
		</footer>
	);
}
