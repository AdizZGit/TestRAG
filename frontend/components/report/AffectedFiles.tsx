"use client";

import {
  FileCode2,
  ChevronDown,
} from "lucide-react";

import { useState } from "react";


type Props = {
  files: any[];
};


export default function AffectedFiles({
  files,
}: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Affected Files</h3>
          <p className="mt-1 text-xs text-slate-500">Changed paths in this pull request</p>
        </div>
        <span className="text-xs font-medium text-slate-500">{files.length} files</span>
      </div>
      <div className="space-y-4">
        {files.map((item:any)=>{
          const isOpen =
            expanded === item.filename;
          return (
            <div
              key={item.filename}
              className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950/50"
            >
              {/* Header */}
              <button
                onClick={()=> 
                  setExpanded(
                    isOpen
                    ? null
                    : item.filename
                  )
                }
                className="flex w-full items-center justify-between gap-3 p-3.5 text-left hover:bg-slate-900"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-md bg-blue-500/10 p-2">
                    <FileCode2 className="text-blue-400" size={17} />
                  </div>
                  <div className="text-left">
                    <p className="break-all text-sm font-medium text-slate-200">
                      {item.filename}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.status}
                      {" • "}
                      <span className="text-green-400">
                        +{item.additions}
                      </span>

                      {" / "}

                      <span className="text-red-400">
                        -{item.deletions}
                      </span>
                      {" • "}
                      {item.changes} changes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden rounded-full border border-blue-500/30 px-2.5 py-1 text-[11px] text-blue-400 sm:inline-flex">{item.changes} changes</span>
                  <ChevronDown
                      size={18}
                      className="text-blue-400"
                    />
                    
                </div>
              </button>
              {/* Diff Section */}
              {
                isOpen && item.patch && (
                  <div
                    className="border-t border-slate-800 bg-black/40 p-4"
                  >
                    <p className="
                    mb-3
                    text-sm
                    font-semibold
                    text-white
                    ">
                      Changes
                    </p>
                    <pre
                      className="
                      overflow-x-auto
                      rounded-lg
                      bg-slate-950
                      p-4
                      text-xs
                      leading-6
                      text-slate-300
                      "
                    >
                      {item.patch}
                    </pre>
                  </div>
                )
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}