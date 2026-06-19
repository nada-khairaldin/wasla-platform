import { FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface CompletedContractsHeaderProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function CompletedContractsHeader({ activeFilter, onFilterChange }: CompletedContractsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full text-right" dir="rtl">
      
      {/* Title Section */}
      <div className="flex items-start gap-3">
        <FileText size={28} className="text-primary-500 mt-1" />
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-primary-900">العقود المنتهية</h1>
          <p className="text-sm font-medium text-neutral-500">
            عرض جميع العقود التي تم انهاؤها
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-start md:justify-end gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full md:w-auto mt-4 md:mt-0">
        <button 
          onClick={() => onFilterChange("الكل")}
          className={`shrink-0 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            activeFilter === "الكل" 
              ? "bg-[#215077] text-white shadow-sm" 
              : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          الكل
        </button>

        <button 
          onClick={() => onFilterChange("انتهى بنجاح")}
          className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeFilter === "انتهى بنجاح" 
              ? "bg-emerald-50 border border-emerald-500 text-emerald-700 shadow-sm" 
              : "bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
          }`}
        >
          <CheckCircle2 size={16} />
          انتهت بنجاح
        </button>

        <button 
          onClick={() => onFilterChange("انتهى بنزاع")}
          className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeFilter === "انتهى بنزاع" 
              ? "bg-red-50 border border-red-500 text-red-700 shadow-sm" 
              : "bg-white border border-red-200 text-red-600 hover:bg-red-50"
          }`}
        >
          <AlertCircle size={16} />
          نزاعات
        </button>
      </div>

    </div>
  );
}
