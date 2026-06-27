import { FileText, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Contract, CompletedContract } from "../../contract.types";

interface CompletedStatsRowProps {
  contracts: (Contract | CompletedContract)[];
}

export function CompletedStatsRow({ contracts }: CompletedStatsRowProps) {
  const total = contracts.length;
  const successful = contracts.filter(c => c.status === "completed" || c.status === "انتهى بنجاح").length;
  const disputes = contracts.filter(c => c.status === "disputed" || c.status === "انتهى بنزاع").length;
  const rejected = contracts.filter(c => c.status === "rejected" || c.status === "cancelled" || c.status === "مرفوض" || c.status === "ملغي").length;

  return (
    <div className="flex flex-col md:flex-row flex-wrap items-center gap-4 md:gap-6 w-full">
      {/* Rejected */}
      <div className="flex-1 min-w-[200px] w-full bg-white rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
          <XCircle size={24} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-red-500">{rejected}</span>
          <span className="text-sm font-bold text-neutral-500">عقود مرفوضة</span>
        </div>
      </div>

      {/* Disputes */}
      <div className="flex-1 min-w-[200px] w-full bg-white rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
          <AlertCircle size={24} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-orange-500">{disputes}</span>
          <span className="text-sm font-bold text-neutral-500">نزاعات تم التعامل معها</span>
        </div>
      </div>
      
      {/* Successful */}
      <div className="flex-1 min-w-[200px] w-full bg-white rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
          <CheckCircle2 size={24} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-emerald-600">{successful}</span>
          <span className="text-sm font-bold text-neutral-500">منتهية بنجاح</span>
        </div>
      </div>
      
      {/* Total */}
      <div className="flex-1 min-w-[200px] w-full bg-white rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#215077] shrink-0">
          <FileText size={24} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-[#215077]">{total}</span>
          <span className="text-sm font-bold text-neutral-500">إجمالي العقود المنتهية</span>
        </div>
      </div>
    </div>
  );
}
