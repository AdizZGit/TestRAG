"use client";

import {
  TestTube2,
} from "lucide-react";

type Props = {
  report: any;
};

export default function TestCases({
  report,
}: Props) {

  const tests =
    report?.agent_decision?.priority_test_cases ?? [];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

      <div className="mb-6 flex items-center justify-between">

        <h3 className="text-xl font-semibold text-white">
          Recommended Test Cases
        </h3>

        <TestTube2
          size={22}
          className="text-blue-400"
        />

      </div>

      <div className="space-y-4">

        {tests.length === 0 ? (

          <p className="text-slate-400">
            No recommended test cases.
          </p>

        ) : (

          tests.map((test: string, index: number) => (

            <div
              key={index}
              className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 transition hover:border-blue-500/30"
            >

              <div className="flex items-center justify-between">

                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase text-blue-400">
                  Priority {index + 1}
                </span>

                <span className="text-sm text-slate-500">
                  Existing Test Case
                </span>

              </div>

              <h4 className="mt-4 text-lg font-medium text-white">
                {test}
              </h4>

            </div>

          ))

        )}

      </div>

    </div>
  );
}