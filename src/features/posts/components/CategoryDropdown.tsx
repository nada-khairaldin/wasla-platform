"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, LayoutGrid } from "lucide-react";

const mockCategories = [
  "البرمجة", "التصميم", "التسويق", "إدارة الأعمال", "كتابة المحتوى",
  "المحاسبة", "اللغات", "الاستشارات", "الهندسة", "الطبخ", "الرياضة",
];

interface CategoryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function CategoryDropdown({ value, onChange, error }: CategoryDropdownProps) {
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node))
        setCatOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative w-full" ref={catRef}>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 z-10 pointer-events-none">
        <LayoutGrid size={18} />
      </div>
      <button
        type="button"
        className={`w-full rounded-xl border-none p-4 pr-12 outline-none focus:ring-1 focus:ring-neutral-100 transition-all bg-neutral-50 text-right flex items-center justify-between ${value ? "text-neutral-900" : "text-neutral-400"} ${error ? "ring-1 ring-error-500" : ""}`}
        onClick={() => setCatOpen(!catOpen)}
      >
        <span>{value || "اختر مجال من القائمة"}</span>
        <ChevronDown size={18} className={`transition-transform duration-300 ${catOpen ? "rotate-180" : ""}`} />
      </button>

      {catOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-primary-50 z-[10001] animate-in fade-in slide-in-from-top-2">
          <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1">
            {mockCategories.map((cat, index) => (
              <div
                key={index}
                className={`py-3 px-6 text-sm font-cairo cursor-pointer transition-colors rounded-lg hover:bg-primary-50 ${value === cat ? "bg-primary-50 text-primary-600 font-bold" : "text-neutral-700"}`}
                onClick={() => {
                  onChange(cat);
                  setCatOpen(false);
                }}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}