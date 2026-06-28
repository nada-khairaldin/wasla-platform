import { Calendar, Clock, CheckCircle2, AlertCircle, XCircle, ChevronLeft } from "lucide-react";
import { CompletedContract } from "../../contract.types";

interface CompletedContractCardProps {
  contract: CompletedContract;
  onViewDetails?: (id: string) => void;
}

export function CompletedContractCard({ contract, onViewDetails }: CompletedContractCardProps) {
  const isDispute = contract.status === "انتهى بنزاع";
  const isRejected = contract.status === "مرفوض" || contract.status === "ملغي";
  
  let iconBg = "bg-emerald-50 text-emerald-600";
  let statusColor = "text-emerald-700";
  let badgeBg = "bg-emerald-50 text-emerald-700";
  let otherPartyBg = "bg-primary-900";
  let Icon = CheckCircle2;

  if (isDispute) {
    iconBg = "bg-orange-50 text-orange-600";
    statusColor = "text-orange-700";
    badgeBg = "bg-orange-50 text-orange-700";
    otherPartyBg = "bg-orange-800";
    Icon = AlertCircle;
  } else if (isRejected) {
    iconBg = "bg-red-50 text-red-600";
    statusColor = "text-red-700";
    badgeBg = "bg-red-50 text-red-700";
    otherPartyBg = "bg-red-800";
    Icon = XCircle;
  }
  
  const handleCardClick = () => {
    if (contract.status === "مرفوض") return;
    if (onViewDetails) {
      onViewDetails(contract.id);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`w-full bg-white rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 text-right transition-all duration-300 ${contract.status === "مرفوض" ? "cursor-default" : "cursor-pointer hover:shadow-[0_4px_24px_rgb(0,0,0,0.06)] group"}`}
    >
      
      {/* Right Section: Status Icon + Status Label + Title */}
      <div className="flex flex-col gap-3 flex-1 md:max-w-[40%]">
         {/* Status Header: Icon + Label + Dispute Badge */}
         <div className="flex flex-wrap items-center gap-3">
           <div className="flex items-center gap-2">
             <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
               <Icon size={16} strokeWidth={2.5} />
             </div>
             <span className={`text-sm font-bold ${statusColor}`}>
               {contract.status}
             </span>
           </div>

           {isDispute && contract.disputeResponsible && (
             <div className={`flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold ${badgeBg}`}>
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

      <div className="hidden md:block w-px h-16 bg-neutral-100 shrink-0"></div>

      {/* Middle Section: Other Party */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-start gap-6 md:gap-8 flex-1">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${otherPartyBg}`}>
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

        {/* Left Section: Date & Duration */}
        <div className="flex flex-col gap-2 border-t border-neutral-100 pt-4 sm:border-0 sm:pt-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500">
            <Calendar size={14} className="shrink-0" />
            <span className="whitespace-nowrap">{contract.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500">
            <Clock size={14} className="shrink-0" />
            <span className="whitespace-nowrap">{contract.durationText}</span>
          </div>
        </div>
      </div>
      
      {/* Left Section: Action */}
      {contract.status !== "مرفوض" && (
        <>
          <div className="hidden md:block w-px h-16 bg-neutral-100 shrink-0"></div>
          <div className="flex flex-col items-end md:items-center justify-center w-full md:w-auto mt-2 md:mt-0 pl-2 md:h-16 shrink-0">
            <button 
              className="flex w-10 h-10 rounded-full bg-neutral-50 text-neutral-500 items-center justify-center group-hover:bg-primary-500 group-hover:text-white group-hover:shadow-[0_2px_8px_rgb(0,0,0,0.04)] active:scale-95 transition-all cursor-pointer"
              aria-label="View Details"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
          </div>
        </>
      )}

    </div>
  );
}
