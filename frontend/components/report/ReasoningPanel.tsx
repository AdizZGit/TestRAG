"use client";

import {
  BrainCircuit,
  Quote,
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
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">


      <div className="mb-6 flex items-center gap-3">

        <BrainCircuit
          size={22}
          className="text-blue-400"
        />

        <h3 className="text-xl font-semibold text-white">
          AI Decision Summary
        </h3>

      </div>



      {/* Risk Reason */}


      <div className="
        rounded-xl
        border
        border-blue-500/20
        bg-blue-500/5
        p-5
      ">


        <div className="flex gap-4">


          <Quote
            className="mt-1 text-blue-400"
            size={20}
          />


          <p className="leading-8 text-slate-300">

            {decision?.risk_reason ??
              "No decision summary available."}

          </p>


        </div>


      </div>





      {/* Testing Strategy */}


      <div className="mt-6">

        <h4 className="mb-3 font-medium text-white">
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
                  rounded-full
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


      {
        decision?.coverage_gaps?.length > 0 && (

          <div className="mt-6">


            <h4 className="mb-3 font-medium text-white">

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






      {/* Report Focus */}


      <div className="mt-6">


        <h4 className="mb-3 font-medium text-white">

          Report Focus

        </h4>



        <div className="flex flex-wrap gap-2">


          {
            decision?.report_focus?.map(
              (focus:string)=>(
                
                <span
                  key={focus}
                  className="
                  rounded-full
                  border
                  border-blue-500/30
                  px-3
                  py-1
                  text-xs
                  text-blue-400
                  "
                >

                  {focus}

                </span>

              )
            )
          }


        </div>


      </div>


    </div>
  );
}