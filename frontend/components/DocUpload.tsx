"use client";

import { useRef, useState, useEffect } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import DocumentsModal from "./DocumentsModal";
import { uploadDocument, getDocuments } from "@/app/services/documentService";

type UploadedFile = {
  name: string;
};

export default function DocUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (list: FileList | null) => {
    if (!list) return;

    setUploading(true);

    try {
      for (const file of Array.from(list)) {
        await uploadDocument(file, "requirement");
      }

      await loadDocuments();
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert(error.response.data.detail);
      } else if (error.code === "ECONNABORTED") {
        console.error("[Documents] Upload timed out", error);
        alert("The upload is still processing. Please wait and refresh the document list.");
      } else {
        console.error("[Documents] Upload failed", error);
      }
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };
  const loadDocuments = async () => {
    try {
      const data = await getDocuments();

      setFiles(
        data.map((doc) => ({
          name: doc.filename,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <>
      <section id="knowledge" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-28">

        {/* Header */}

        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-blue-400">
            Step 01
          </p>

          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Build Your Knowledge Base
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-400 sm:text-lg">
            Upload project documentation that will be indexed and used by the
            Retrieval Engine during analysis.
          </p>
        </div>

        {/* Two Column Layout */}

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-5">

          {/* Upload Card */}

          <div className="lg:col-span-2">

            <div
              onDragOver={(e) => {
                if (uploading) return;
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                if (uploading) return;
                e.preventDefault();
                setDragging(false);
                addFiles(e.dataTransfer.files);
              }}
              className={`flex h-full flex-col justify-center rounded-3xl border-2 border-dashed p-6 text-center transition-all duration-300 sm:p-8 lg:p-10 ${dragging
                ? "border-blue-500 bg-blue-500/5"
                : "border-slate-700 bg-slate-900/40"
                }`}
            >
              <UploadCloud
                size={56}
                className="mx-auto text-blue-400"
              />

              <h3 className="mt-6 text-2xl font-semibold text-white">
                Upload Project Documents
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Requirements, API specifications, architecture documents,
                QA test cases and supporting files.
              </p>

              <button
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {uploading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Browse Files"
                )}
              </button>

              <p className="mt-6 text-sm text-slate-500">
                PDF • DOCX • MD • TXT • XLSX
              </p>

              <input
                hidden
                multiple
                ref={inputRef}
                type="file"
                onChange={(e) => addFiles(e.target.files)}
              />

            </div>

          </div>

          {/* Knowledge Base */}

          <div className="lg:col-span-3">

            <div className="flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900/40 p-8">

              <div>
                <h3 className="text-2xl font-semibold text-white">
                  Knowledge Base
                </h3>

                <p className="mt-2 text-slate-400">
                  {files.length} indexed documents available for retrieval
                </p>
              </div>

              <div className="mt-8 flex-1 space-y-4">

                {files.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
                    No documents uploaded yet.
                  </div>
                ) : (
                  files.slice(0, 4).map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 transition hover:border-slate-700"
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

                      <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2">
                        <CheckCircle2
                          size={16}
                          className="text-emerald-400"
                        />

                        <span className="text-sm font-medium text-emerald-400">
                          Indexed
                        </span>
                      </div>
                    </div>
                  ))
                )}

              </div>

              {files.length > 0 && (
                <button
                  onClick={() => setOpen(true)}
                  className="mt-8 w-fit text-sm font-medium text-blue-400 transition hover:text-blue-300"
                >
                  View All Documents →
                </button>
              )}

            </div>

          </div>

        </div>

      </section>

      <DocumentsModal
        open={open}
        onClose={() => setOpen(false)}
        files={files}
      />
    </>
  );
}