"use client";

import {
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { useState } from "react";


type Props = {
  docs: any[];
};


export default function RetrievedDocs({
  docs,
}: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          Retrieved Documents
        </h3>
        <FileText
          className="text-blue-400"
          size={22}
        />
      </div>
      <div className="space-y-4">


        {docs.length === 0 ? (

          <p className="text-slate-400">
            No documents retrieved.
          </p>
        ) : (
          docs.map((doc:any,index:number)=>{
            const isOpen =
              expanded === index;
            return (
              <div
                key={index}
                className="
                overflow-hidden
                rounded-xl
                border
                border-slate-800
                bg-slate-950/60
                "
              >
                {/* Header */}
                <button

                  onClick={()=> 
                    setExpanded(
                      isOpen
                      ? null
                      : index
                    )
                  }
                  className="
                  flex
                  w-full
                  items-center
                  justify-between
                  p-4
                  text-left
                  hover:bg-slate-900
                "
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-slate-200">
                        {doc.metadata?.source_file ??
                          "Unknown Document"}
                      </p>
                      <span
                        className="
                        rounded-full
                        bg-blue-500/10
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-blue-400
                        "
                      >
                        {(doc.score * 100).toFixed(1)}%

                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">

                      Chunk {doc.metadata?.chunk_index ?? "-"}

                    </p>


                    {!isOpen && (

                      <p
                        className="
                        mt-2
                        line-clamp-2
                        text-xs
                        text-slate-400
                        "
                      >

                        {doc.content}

                      </p>

                    )}
                  </div>
                  <div className="flex items-center gap-3">          
                      <ChevronDown
                        size={18}
                        className="text-blue-400"
                      />
                  </div>
                </button>

                {/* Full Document Content */}
                {
                  isOpen && (

                    <div
                      className="
                      border-t
                      border-slate-800
                      bg-black/30
                      p-5
                      "
                    >
                      <p className="
                      mb-3
                      text-sm
                      font-semibold
                      text-white
                      ">
                        Document Content
                      </p>
                      <pre
                        className="
                        max-h-96
                        overflow-auto
                        whitespace-pre-wrap
                        rounded-lg
                        bg-slate-950
                        p-4
                        text-sm
                        leading-6
                        text-slate-300
                        "
                      >
                        {doc.content}
                      </pre>
                    </div>
                  )
                }
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}