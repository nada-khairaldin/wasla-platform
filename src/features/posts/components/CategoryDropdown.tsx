"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, LayoutGrid, Plus } from "lucide-react";
import { useSkills } from "@/src/features/skills";

interface CategoryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function CategoryDropdown({
  value,
  onChange,
  error,
}: CategoryDropdownProps) {
  const [catOpen, setCatOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const catRef = useRef<HTMLDivElement>(null);

  const { data: dbSkills = [] } = useSkills();
  const categoriesList = useMemo(() => {
    return dbSkills.map((s) => s.name);
  }, [dbSkills]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
        setIsCustomMode(false);
        setCustomInput("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggleDropdown = () => {
    const nextOpenState = !catOpen;
    setCatOpen(nextOpenState);

    if (nextOpenState && value && !categoriesList.includes(value)) {
      setIsCustomMode(true);
      setCustomInput(value);
    } else if (!nextOpenState) {
      setIsCustomMode(false);
      setCustomInput("");
    }
  };

  return (
    <div className="relative w-full" ref={catRef}>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 z-10 pointer-events-none">
        <LayoutGrid size={18} />
      </div>

      <button
        type="button"
        className={`w-full rounded-xl border-none p-4 pr-12 outline-none focus:ring-1 focus:ring-neutral-100 transition-all bg-neutral-50 text-right flex items-center justify-between ${value ? "text-neutral-900" : "text-neutral-400"} ${error ? "ring-1 ring-error-500" : ""}`}
        onClick={handleToggleDropdown} 
      >
        <span>{value || "اختر مجال من القائمة"}</span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${catOpen ? "rotate-180" : ""}`}
        />
      </button>

      {catOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-primary-50 z-[10001] animate-in fade-in slide-in-from-top-2 p-1">
          {!isCustomMode ? (
            <>
              <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                {categoriesList.map((cat, index) => (
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

              <div className="border-t border-neutral-100 mt-1 pt-1">
                <button
                  type="button"
                  className="w-full py-2.5 px-5 text-sm font-cairo font-bold text-primary-600 hover:bg-primary-50 text-right flex items-center gap-2 rounded-lg transition-colors"
                  onClick={() => setIsCustomMode(true)} 
                >
                  <Plus size={16} />
                  <span>إضافة مجال جديد...</span>
                </button>
              </div>
            </>
          ) : (
            /* واجهة إدخال المجال الجديد المخصص */
            <div className="p-3 space-y-3 text-right">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-neutral-400 block font-cairo">
                  كتابة مجال مخصص جديد:
                </label>
              </div>
              <input
                type="text"
                placeholder="مثال: التصوير، صيانة الحواسيب..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200/60 rounded-xl p-3 text-sm text-right font-cairo outline-none focus:ring-1 focus:ring-primary-500 focus:bg-white transition-all text-neutral-900"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (customInput.trim()) {
                      onChange(customInput.trim());
                      setCatOpen(false);
                    }
                  }
                }}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (customInput.trim()) {
                      onChange(customInput.trim());
                      setCatOpen(false);
                    }
                  }}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold font-cairo py-2.5 rounded-xl transition-colors shadow-md shadow-primary-600/10"
                >
                  تأكيد
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomMode(false);
                    setCustomInput("");
                  }}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-bold font-cairo px-4 py-2.5 rounded-xl transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
