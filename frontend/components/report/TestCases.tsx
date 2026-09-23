"use client";

import { Check, FlaskConical } from "lucide-react";

type Props = {
  report: any;
};

export default function TestCases({
  report,
}: Props) {

  const tests =
    report?.agent_decision?.priority_test_cases ?? [];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Recommended Test Cases</h3>
          <p className="mt-1 text-xs text-slate-500">Prioritized checks for the changed surface</p>
        </div>
        <FlaskConical size={19} className="text-amber-400" />
      </div>
      <div className="space-y-2.5">
        {tests.length === 0 ? (

            <p className="text-sm text-slate-400">
            No recommended test cases.
          </p>

        ) : (

          tests.map((test: string, index: number) => (

            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3.5 transition hover:border-slate-600"
            >

              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-xs font-semibold text-amber-400">{index + 1}</div>
              <h4 className="min-w-0 flex-1 text-sm font-medium text-slate-200">{test}</h4>
              <Check size={16} className="shrink-0 text-emerald-400" />

            </div>

          ))

        )}

      </div>

    </div>
  );
}