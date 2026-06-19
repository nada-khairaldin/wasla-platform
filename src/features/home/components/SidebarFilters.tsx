"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Skeleton } from "@/src/components/ui/Skeleton";
import Button from "../../../components/ui/Button";
import { HourRangeSlider } from "./HourRangeSlider";

interface Category {
  id?: string;
  name: string;
}

interface FilterState {
  type: string;
  categories: string[];
  hours: number;
}

import { useSkills } from "@/src/features/skills";

const TYPE_OPTIONS = [
  { label: "الكل", value: "الكل" },
  { label: "العروض", value: "عرض" },
  { label: "الطلبات", value: "طلب" },
];

interface SidebarFiltersProps {
  categories?: Category[];
  isLoading: boolean;
  onFilterChange: (filters: FilterState) => void;
  initialHours?: number;
  isOpen?: boolean;
  onClose?: () => void;
  isMobileDrawer?: boolean;
}

export const SidebarFilters = ({
  categories = [],
  isLoading,
  onFilterChange,
  initialHours = 24,
  isOpen = false,
  onClose,
  isMobileDrawer = false,
}: SidebarFiltersProps) => {
  const [selectedType, setSelectedType] = useState("الكل");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [hours, setHours] = useState(initialHours);

  const { data: dbSkills = [], isLoading: isSkillsLoading } = useSkills();
  const isActuallyLoading = isLoading || isSkillsLoading;

  useEffect(() => {
    if (isMobileDrawer && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobileDrawer]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const applyFilters = () => {
    onFilterChange({
      type: selectedType,
      categories: selectedCats,
      hours,
    });
    if (isMobileDrawer && onClose) onClose();
  };

  const resetFilters = () => {
    setSelectedType("الكل");
    setSelectedCats([]);
    setHours(24);
    onFilterChange({ type: "الكل", categories: [], hours: 24 });
    if (isMobileDrawer && onClose) onClose();
  };

  const renderFilterForm = () => (
    <div className="space-y-5 text-right ">
      <div className="flex items-center justify-between border-b pb-4 border-neutral-200">
        <h3 className="font-bold text-lg text-neutral-900">تصفية المنشورات</h3>
        {isMobileDrawer && onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold text-neutral-600">نوع المنشور</p>
        <div className="flex gap-2">
          {TYPE_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedType(value)}
              className={`flex-1 py-2.5 rounded-full text-[13px] font-bold transition-all border 
                ${
                  selectedType === value
                    ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                    : "text-neutral-500 border-neutral-300 bg-white hover:border-primary-400"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-bold text-neutral-600">التخصصات</p>
        <div className="flex flex-col gap-3 max-h-[240px] overflow-y-auto pl-2 custom-scrollbar">
          {isActuallyLoading
            ? Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="w-full h-5 rounded-lg" />
                ))
            : (categories.length > 0
                ? categories.map((c) => c.name)
                : dbSkills.map((s) => s.name)
              ).map((cat, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 cursor-pointer group py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={selectedCats.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                    className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer transition-all"
                  />
                  <span
                    className={`text-[14px] transition-colors leading-none ${selectedCats.includes(cat) ? "text-primary-600 font-bold" : "text-neutral-600 group-hover:text-primary-600"}`}
                  >
                    {cat}
                  </span>
                </label>
              ))}
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <HourRangeSlider
          onChange={(val) => setHours(val)}
          initialValue={hours}
        />
      </div>

      <div className=" pt-4">
        <Button
          onClick={applyFilters}
          variant="filled"
          size="md"
          className="w-full text-[15px] py-3 rounded-xl mb-2"
        >
          تطبيق الفلتر
        </Button>
        <button
          onClick={resetFilters}
          className="w-full border-none hover:text-neutral-900 text-[14px] text-neutral-400 font-bold pt-1 transition-colors"
        >
          إعادة تعيين الفلتر
        </button>
      </div>
    </div>
  );

  if (isMobileDrawer) {
    if (!isOpen || typeof window === "undefined") return null;
    return createPortal(
      <div className="fixed inset-0 z-[100000] flex justify-end md:hidden animate-in fade-in duration-200">
        <div
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full max-w-[320px] bg-white h-full p-6 shadow-2xl overflow-y-auto flex flex-col z-10 animate-in slide-in-from-right duration-300">
          {renderFilterForm()}
        </div>
      </div>,
      document.body,
    );
  }

  return (
    <div className="bg-neutral-50 rounded-xl p-6 shadow-sm ">
      {renderFilterForm()}
    </div>
  );
};
