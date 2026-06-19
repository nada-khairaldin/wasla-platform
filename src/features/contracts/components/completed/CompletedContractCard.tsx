import { Calendar, Clock, ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { CompletedContract } from "../../contract.types";

interface CompletedContractCardProps {
  contract: CompletedContract;
  onViewDetails?: (id: string) => void;
}

export function CompletedContractCard({ contract, onViewDetails }: CompletedContractCardProps) {
  const isDispute = contract.status === "انتهى بنزاع";
  
  return (
    <div className="w-full bg-white rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] hover:shadow-[0_4px_24px_rgb(0,0,0,0.06)] p-6 transition-shadow flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6 text-right group">
      
      {/* Right Section: Status Icon + Status Label + Title */}
      <div className="flex flex-col gap-3 flex-1">
         {/* Status Header: Icon + Label + Dispute Badge */}
         <div className="flex flex-wrap items-center gap-3">
           <div className="flex items-center gap-2">
             <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
               isDispute ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
             }`}>
               {isDispute ? <AlertCircle size={16} strokeWidth={2.5} /> : <CheckCircle2 size={16} strokeWidth={2.5} />}
             </div>
             <span className={`text-sm font-bold ${isDispute ? "text-red-700" : "text-emerald-700"}`}>
               {contract.status}
             </span>
           </div>

           {isDispute && contract.disputeResponsible && (
             <div className="flex items-center px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-[11px] font-bold">
               {contract.disputeResponsible}
             </div>
           )}
         </div>
         
         {/* Title & Desc */}
         <div className="flex flex-col gap-1 pr-1 mt-1">
           <h3 className="text-lg font-black text-primary-900 leading-tight">{contract.title}</h3>
           <p className="text-sm font-medium text-neutral-500">{contract.serviceDescription}</p>
         </div>
      </div>

      <div className="hidden md:block w-px h-24 bg-neutral-100"></div>

      {/* Middle Section: Other Party */}
      <div className="flex items-center gap-3 w-full md:w-auto md:mt-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
          isDispute ? "bg-red-800" : "bg-primary-900"
        }`}>
          {contract.otherPartyInitials}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-neutral-400">الطرف الآخر</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-neutral-800">{contract.otherPartyName}</span>
            {contract.rating && (
              <div className="flex items-center gap-1 text-xs font-bold text-neutral-800">
                <span className="text-orange-400 -mt-0.5">★</span> {contract.rating}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden md:block w-px h-24 bg-neutral-100"></div>

      {/* Middle-Left Section: Date & Duration */}
      <div className="flex flex-col gap-2 w-full md:w-auto md:mt-7">
        <div className="flex items-center justify-end md:justify-start gap-1.5 text-xs font-bold text-neutral-500">
          <Calendar size={14} />
          {contract.date}
        </div>
        <div className="flex items-center justify-end md:justify-start gap-1.5 text-xs font-bold text-neutral-500">
          <Clock size={14} />
          {contract.durationText}
        </div>
      </div>

      {/* Left Section: Action */}
      <div className="flex flex-col items-end md:items-center justify-center w-full md:w-auto mt-2 md:mt-0 pl-2 md:h-24">
        <button 
          onClick={() => onViewDetails?.(contract.id)}
          className="flex w-10 h-10 rounded-full bg-neutral-50 text-neutral-500 items-center justify-center hover:bg-primary-500 hover:text-white shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
      </div>

    </div>
  );
}
