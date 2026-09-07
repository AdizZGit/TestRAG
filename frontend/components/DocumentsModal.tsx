"use client";

import { X, Search, FileText, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

type FileItem = {
  name: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  files: FileItem[];
};

export default function DocumentsModal({
  open,
  onClose,
  files,
}: Props) {

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", close);

    return () => window.removeEventListener("keydown", close);

  }, [onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-950 p-8"
      >

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold text-white">
              Uploaded Documents
            </h2>

            <p className="mt-1 text-slate-400">
              {files.length} indexed files
            </p>

          </div>

          <button onClick={onClose}>
            <X className="text-slate-400 hover:text-white" />
          </button>

        </div>

        <div className="relative mt-8">

          <Search
            size={18}
            className="absolute left-4 top-3.5 text-slate-500"
          />

          <input
            placeholder="Search documents..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-4 text-white outline-none focus:border-blue-500"
          />

        </div>

        <div className="mt-8 max-h-[420px] space-y-4 overflow-y-auto pr-2">

          {files.map((file) => (

            <div
              key={file.name}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4"
            >

              <div className="flex items-center gap-4">

                <FileText
                  size={20}
                  className="text-blue-400"
                />

                <span className="text-slate-200">
                  {file.name}
                </span>

              </div>

              <div className="flex items-center gap-2 text-emerald-400">

                <CheckCircle2 size={18} />

                <span className="text-sm">
                  Indexed
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}