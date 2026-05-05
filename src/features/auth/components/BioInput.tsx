import React from "react";
import { FileText } from "lucide-react";

interface BioInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

function BioInput({ value, onChange, error }: BioInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-neutral-700 font-bold text-sm mr-2">
        <FileText size={18} className="text-primary-500" />
        نبذة تعريفية (اختياري)
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="أخبرنا المزيد عن خبراتك أو ما تبحث عنه باختصار..."
          rows={4}
          className={`w-full pt-4 pb-4 pr-4 pl-7 bg-white/70 border ${
            error ? "border-red-500" : "border-neutral-200"
          } rounded-2xl focus:ring-2 focus:ring-primary-500/70 outline-none transition-all text-sm resize-none custom-scrollbar`}
          maxLength={500}
        />
        <span className="absolute bottom-3 left-4 text-[10px] text-neutral-400 font-medium bg-white/50 px-1 rounded">
          {value.length}/500
        </span>
      </div>
      {error && <p className="text-red-500 text-xs mr-2">{error}</p>}
      <p className="text-[11px] text-neutral-400 mr-2">
        هذه النبذة تساعد الآخرين في التعرف عليك بشكل أسرع قبل البدء في التبادل المجتمعي.
      </p>
    </div>
  );
};

export default BioInput
