import { FileText, CheckCircle2, AlertCircle } from "lucide-react";

export function CompletedStatsRow() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 lg:gap-8 w-full">
      {/* 3 */}
      <div className="flex-1 w-full bg-white rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
          <AlertCircle size={24} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-red-500">3</span>
          <span className="text-sm font-bold text-neutral-500">نزاعات تم التعامل معها</span>
        </div>
      </div>
      
      {/* 2 */}
      <div className="flex-1 w-full bg-white rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
          <CheckCircle2 size={24} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-neutral-800">9</span>
          <span className="text-sm font-bold text-neutral-500">منتهية بنجاح تام</span>
        </div>
      </div>
      
      {/* 1 */}
      <div className="flex-1 w-full bg-white rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#215077] shrink-0">
          <FileText size={24} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-[#215077]">12</span>
          <span className="text-sm font-bold text-neutral-500">إجمالي العقود المنتهية</span>
        </div>
      </div>
    </div>
  );
}
