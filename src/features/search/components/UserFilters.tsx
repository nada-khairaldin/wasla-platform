"use client";

import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { UsersSearchRequest } from "../types/search.types";
import { GAZA_CITIES } from "../../../utils/constants";

interface UserFiltersProps {
  filters: NonNullable<UsersSearchRequest["filters"]>;
  onChange: (key: string, value: string | boolean | undefined) => void;
  onReset?: () => void;
}

const SKILL_TYPE_OPTIONS = [
  { label: "الكل", value: "" },
  { label: "مقدم خدمة", value: "OFFER" },
  { label: "طالب خدمة", value: "REQUEST" },
];

export const UserFilters = ({ filters, onChange }: UserFiltersProps) => {
  return (
    <div className="text-right flex flex-col h-full w-full">
      <div className="flex-1 space-y-6 pb-8">
        
        {/* Skill Type */}
        <div className="space-y-3">
          <h4 className="text-[13px] font-bold text-neutral-800">الفئة</h4>
          <div className="flex gap-1 bg-neutral-100/50 p-1 rounded-lg">
            {SKILL_TYPE_OPTIONS.map(({ label, value }) => {
              const isActive = (filters.skillType || "") === value;
              return (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => onChange("skillType", value || undefined)}
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

        {/* Online Status */}
        <div className="space-y-3">
          <h4 className="text-[13px] font-bold text-neutral-800">حالة الاتصال</h4>
          <div className="flex flex-col gap-2">
            {[
              { label: "الكل", value: undefined },
              { label: "متصل الآن", value: true },
            ].map(({ label, value }) => {
              const isActive =
                value === undefined
                  ? filters.isOnline === undefined
                  : filters.isOnline === value;
              return (
                <label
                  key={label}
                  onClick={() => onChange("isOnline", value)}
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
                  <span className="text-[12px] font-bold flex-1">{label}</span>
                  {value === true && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <h4 className="text-[13px] font-bold text-neutral-800">الموقع</h4>
          <div className="relative">
            <MapPin
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
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
