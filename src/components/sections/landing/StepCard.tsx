import type { Step } from "../../../../types";

function StepCard({ step }: { step: Step }) {
  return (
    <div className="flex-1 flex flex-col items-center text-center gap-[33px] relative ">
      {/* Icon circle with step badge */}
      <div className="relative z-10">
        <div className="w-[96px] h-[96px] rounded-3xl border  border-neutral-50 flex items-center justify-center text-primary-500 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_8px_10px_-6px_rgba(0,0,0,0.1)]">
          {step.icon}
        </div>

        <span className="absolute -top-3 -left-3 w-5 h-5 rounded-full bg-primary-500 text-white text-text-1 font-bold flex items-center justify-center leading-none w-xs h-xs ">
          {step.number}
        </span>
      </div>

      <div className="flex flex-col gap-xl">
        <h3 className="font-bold text-h6 text-primary-500 ">{step.title}</h3>
        <p className="text-base text-neutral-400 leading-relaxed mx-auto px-sm">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export default StepCard;
