"use client";

import { MapPin, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { PostsSearchRequest } from "../types/search.types";
import { GAZA_CITIES } from "../../../utils/constants";
import { HourRangeSlider } from "../../home/components/HourRangeSlider";

interface PostFiltersProps {
  filters: NonNullable<PostsSearchRequest["filters"]>;
  onChange: (key: string, value: string | number | undefined) => void;
  onReset: () => void;
}

const CATEGORY_OPTIONS = [
  { label: "الكل", value: "" },
  { label: "طلب", value: "REQUEST" },
  { label: "عرض", value: "OFFER" },
];

const SERVICE_MODE_OPTIONS = [
  { label: "الكل", value: "" },
  { label: "أونلاين", value: "ONLINE" },
  { label: "ميداني", value: "OFFLINE" },
];

export const PostFilters = ({ filters, onChange, onReset }: PostFiltersProps) => {
  return (
    <div className="text-right flex flex-col h-full w-full">
      <div className="flex-1 space-y-6 pb-8">
        
        {/* Category */}
        <div className="space-y-3">
          <h4 className="text-[13px] font-bold text-neutral-800">نوع المنشور</h4>
          <div className="flex gap-1 bg-neutral-100/50 p-1 rounded-lg">
            {CATEGORY_OPTIONS.map(({ label, value }) => {
              const isActive = (filters.category || "") === value;
              return (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => onChange("category", value || undefined)}
                  className={`flex-1 py-1.5 rounded-md text-[12px] font-bold transition-all duration-200 outline-none focus:outline-none ring-0 border-none ${
                    isActive
                      ? "bg-white text-primary-700 shadow-none"
                      : "bg-transparent text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/30"
                  }`}
                >
                  {label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Service Mode */}
        <div className="space-y-3">
          <h4 className="text-[13px] font-bold text-neutral-800">طريقة الخدمة</h4>
          <div className="flex flex-col gap-2">
            {SERVICE_MODE_OPTIONS.map(({ label, value }) => {
              const isActive = (filters.serviceMode || "") === value;
              return (
                <label
                  key={label}
                  onClick={() => onChange("serviceMode", value || undefined)}
                  className={`group flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] outline-none focus:outline-none border-none ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "bg-transparent text-neutral-600 hover:bg-neutral-50/50"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center transition-colors duration-200 ${
                      isActive ? "border-primary-500 bg-primary-500" : "border-neutral-300 group-hover:border-neutral-400"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        transition={{ type: "spring", stiffness: 400, damping: 25, duration: 0.2 }}
                        className="w-1.5 h-1.5 bg-white rounded-full" 
                      />
                    )}
                  </div>
                  <span className="text-[12px] font-bold">{label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Credits Range */}
        <div className="space-y-3">
          <h4 className="text-[13px] font-bold text-neutral-800">نطاق الرصيد</h4>
          <HourRangeSlider
            onChange={(val) => onChange("maxCredits", val)}
            initialValue={filters.maxCredits || 24}
            label=""
            labelClassName="hidden"
            valueClassName="text-[13px] font-bold text-primary-600 mb-2 block"
            variant="modal"
          />
        </div>

        {/* Location */}
        <div className="space-y-3">
          <h4 className="text-[13px] font-bold text-neutral-800">الموقع</h4>
          <div className="relative">
            <MapPin
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
            {/* We keep native select here for Location as it's a long list, but styled well */}
            <select
              value={filters.location || ""}
              onChange={(e) => onChange("location", e.target.value || undefined)}
              className="w-full rounded-lg py-2.5 pr-8 pl-3 text-[12px] font-bold outline-none focus:outline-none transition-all duration-200 appearance-none text-right bg-neutral-50 hover:bg-neutral-100 border-none cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <option value="">كل المدن</option>
              {GAZA_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

    </div>
  );
};
