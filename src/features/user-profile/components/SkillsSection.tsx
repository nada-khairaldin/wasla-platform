import React from "react";
import { Briefcase, Hand } from "lucide-react";
import { getSkillIcon } from "@/src/utils/skillIcons";

interface SkillsSectionProps {
  offeredSkills: string[];
  requiredSkills: string[];
}

export default function SkillsSection({ offeredSkills, requiredSkills }: SkillsSectionProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4" dir="rtl">
      {/* Required Skills (Right side on desktop, top on mobile) */}
      <div className="flex-1 rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 sm:p-6 overflow-hidden relative">
        <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
          <Hand className="w-5 h-5 text-primary-500" />
          <h2 className="text-sm sm:text-base font-bold text-primary-500">خدمات يحتاجها</h2>
        </div>
        
        {/* Line separator like the design */}
        <div className="w-full h-px bg-neutral-100 mb-5"></div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {requiredSkills.length > 0 ? (
            requiredSkills.map((skill) => (
              <div 
                key={skill} 
                className="bg-[#ebf0f5] rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-2 sm:gap-3 hover:bg-[#e2e8f0] transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  {getSkillIcon(skill, { className: "w-4 h-4 sm:w-5 sm:h-5 text-neutral-600" })}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-neutral-700 text-center">{skill}</span>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-neutral-500 text-sm py-4">لا توجد خدمات محددة</div>
          )}
        </div>
      </div>

      {/* Offered Skills (Left side on desktop, bottom on mobile) */}
      <div className="flex-1 rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 sm:p-6 overflow-hidden relative">
        <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
          <Briefcase className="w-5 h-5 text-secondary-500" />
          <h2 className="text-sm sm:text-base font-bold text-secondary-500">خدمات يقدمها</h2>
        </div>
        
        {/* Line separator like the design */}
        <div className="w-full h-px bg-neutral-100 mb-5"></div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {offeredSkills.length > 0 ? (
            offeredSkills.map((skill) => (
              <div 
                key={skill} 
                className="bg-[#ebf0f5] rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-2 sm:gap-3 hover:bg-[#e2e8f0] transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  {getSkillIcon(skill, { className: "w-4 h-4 sm:w-5 sm:h-5 text-neutral-600" })}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-neutral-700 text-center">{skill}</span>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-neutral-500 text-sm py-4">لا توجد خدمات محددة</div>
          )}
        </div>
      </div>
    </div>
  );
}
