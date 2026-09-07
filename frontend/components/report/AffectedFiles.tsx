"use client";

import {
  FileCode2,
  ChevronRight,
  AlertTriangle,
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
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          Affected Files
        </h3>
        <AlertTriangle
          className="text-red-400"
          size={22}
        />
      </div>
      <div className="space-y-4">
        {files.map((item:any)=>{
          const isOpen =
            expanded === item.filename;
          return (
            <div
              key={item.filename}
              className="
              rounded-xl
              border
              border-slate-800
              bg-slate-950/60
              overflow-hidden
              "
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
                className="
                flex
                w-full
                items-center
                justify-between
                p-4
                hover:bg-slate-900
                "
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-500/10 p-3">
                    <FileCode2
                      className="text-blue-400"
                      size={20}
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-200">
                      {item.filename}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
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
                  <span
                    className="
                    rounded-full
                    border
                    border-blue-500/40
                    px-3
                    py-1
                    text-xs
                    text-blue-400
                    "
                  >
                    {item.changes} Changes
                  </span>
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
                    className="
                    border-t
                    border-slate-800
                    bg-black/40
                    p-5
                    "
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
                      text-sm
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