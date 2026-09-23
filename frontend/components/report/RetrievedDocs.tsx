"use client";

import {
  FileText,
  ChevronDown,
  Layers3,
} from "lucide-react";

import { useState } from "react";


type Props = {
  docs: any[];
};


export default function RetrievedDocs({
  docs,
}: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const groupedDocs = docs.reduce((groups: Map<string, any[]>, doc: any) => {
    const source = doc.metadata?.source_file ?? "Unknown Document";
    const sourceDocs = groups.get(source) ?? [];
    sourceDocs.push(doc);
    groups.set(source, sourceDocs);
    return groups;
  }, new Map<string, any[]>());
  const evidenceGroups = Array.from(groupedDocs.entries()).map(([source, chunks]) => ({
    source,
    chunks,
    bestScore: Math.max(...chunks.map((chunk) => chunk.score ?? 0)),
    description: chunks[0]?.metadata?.description ?? chunks[0]?.content ?? "Retrieved context supporting the analysis",
  }));

  return (
    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Evidence Used</h3>
          <p className="mt-1 text-xs text-slate-500">Retrieved context supporting the analysis</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>{docs.length} chunks</span>
          <span className="text-slate-700">·</span>
          <span>{evidenceGroups.length} documents</span>
          <FileText className="ml-1 text-blue-400" size={20} />
        </div>
      </div>
      <div className="space-y-2.5">
        {evidenceGroups.length === 0 ? (
          <p className="text-sm text-slate-400">No documents retrieved.</p>
        ) : (
          evidenceGroups.map((group) => {
            const isOpen = expanded === group.source;
            return (
              <div
                key={group.source}
                className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950/50"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : group.source)}
                  className="flex w-full items-center justify-between gap-4 p-3.5 text-left hover:bg-slate-900"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <p className="break-all text-sm font-medium text-slate-200">{group.source}</p>
                      <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                        {group.chunks.length} {group.chunks.length === 1 ? "chunk" : "chunks"}
                      </span>
                      <span className="shrink-0 text-xs font-semibold text-emerald-400">{(group.bestScore * 100).toFixed(0)}%</span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">{group.description}</p>
                  </div>
                  <ChevronDown size={17} className={`shrink-0 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="space-y-2 border-t border-slate-800 bg-black/30 p-3">
                    {group.chunks.map((doc: any, index: number) => (
                      <details key={`${group.source}-${index}`} className="group rounded-md border border-slate-800/80 bg-slate-950/70">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-xs text-slate-300 [&::-webkit-details-marker]:hidden">
                          <span className="flex items-center gap-2"><Layers3 size={14} className="text-slate-500" />Chunk {doc.metadata?.chunk_index ?? index + 1}</span>
                          <span className="font-semibold text-emerald-400">{((doc.score ?? 0) * 100).toFixed(0)}%</span>
                        </summary>
                        <pre className="max-h-72 overflow-auto whitespace-pre-wrap border-t border-slate-800 px-3 py-3 text-xs leading-5 text-slate-400">{doc.content}</pre>
                      </details>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}