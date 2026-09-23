"use client";

import {
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";


type Props = {
  decision: any;
};


export default function ReasoningPanel({
  decision,
}: Props) {


  return (
    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">

        <BrainCircuit
          size={22}
          className="text-blue-400"
        />

        <div>
          <h3 className="text-lg font-semibold text-white">AI Analysis &amp; Decision</h3>
          <p className="mt-1 text-xs text-slate-500">Model reasoning behind the regression assessment</p>
        </div>

      </div>



      {/* Risk Reason */}


      <p className="max-w-4xl rounded-lg border border-blue-500/20 bg-blue-500/5 p-5 text-base leading-7 text-slate-200 sm:p-6 sm:text-[17px] sm:leading-8">
        {decision?.risk_reason ?? "No decision summary available."}
      </p>





      {/* Testing Strategy */}


      <div className="mt-8">

        <h4 className="mb-3 text-sm font-semibold text-slate-200">
          Testing Strategy
        </h4>


        <div className="flex flex-wrap gap-3">


          {
            decision?.testing_strategy?.map(
              (item:string)=>(
                
                <span
                  key={item}
                  className="
                  flex
                  items-center
                  gap-2
                  rounded-md
                  bg-green-500/10
                  px-4
                  py-2
                  text-sm
                  text-green-400
                  "
                >

                  <CheckCircle2 size={15}/>

                  {item}

                </span>

              )
            )
          }


        </div>


      </div>

      {/* Coverage Gaps */}


        {decision?.coverage_gaps?.length > 0 && (

          <div className="mt-8">


            <h4 className="mb-3 text-sm font-semibold text-slate-200">

              Coverage Gaps

            </h4>



            {
              decision.coverage_gaps.map(
                (gap:string)=>(
                  
                  <div
                    key={gap}
                    className="
                    flex
                    gap-2
                    rounded-lg
                    bg-red-500/10
                    px-4
                    py-3
                    text-sm
                    text-red-300
                    "
                  >

                    <AlertCircle size={16}/>

                    {gap}

                  </div>

                )
              )
            }


          </div>

        )
      }






    </div>
  );
}