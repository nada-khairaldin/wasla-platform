"use client";

import { Calendar, Clock, Hourglass } from "lucide-react";
import { ContractStats } from "../contract.types";
import { ProgressRing } from "./ProgressRing";

interface ContractStatsRowProps {
  stats?: ContractStats; // Safe fallback handle
  highlight?: boolean;
  deadlineRef?: React.RefObject<HTMLDivElement | null>;
}


function StatCard({ 
  children, 
  className = "",
  deadlineRef,
}: { 
  children: React.ReactNode; 
  className?: string;
  deadlineRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div 
      ref={deadlineRef}
      className={`relative shrink-0 snap-center w-[208px] h-[248px] rounded-[24px] bg-primary-500 pt-[32px] pb-[28px] px-[20px] flex flex-col items-center justify-between text-center shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
}

// Unified circular icon container adjusted for dark background contrast
function IconCircle({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-14 h-14 rounded-full bg-white/10 text-secondary-300 flex items-center justify-center border border-white/5 shrink-0">
      {children}
    </div>
  );
}

export function ContractStatsRow({ 
  stats,
  highlight,
  deadlineRef,
}: ContractStatsRowProps) {
  const {
    completedHours = 0,
    totalHours = 0,
    endDate = "—",
    remainingHours = 0,
    proposedEndDate,
  } = stats || {};

  const progressPercentage =
    totalHours > 0 ? (completedHours / totalHours) * 100 : 0;

  return (
    <div className="relative z-10 w-full flex md:flex-wrap items-center justify-start md:justify-between gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory p-2 pb-4 md:p-2 md:pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* 1 – Completed Hours (Progress Ring) */}
      <StatCard>
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex items-center justify-center shrink-0">
            <ProgressRing
              completedHours={completedHours}
              totalHours={totalHours}
              size={90}
              strokeWidth={15}
            />
            <span className="absolute text-xl font-black text-white">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <p className="text-xs font-bold text-white/70">ساعات منجزة</p>
        </div>
        <p className="text-sm font-black text-white mt-auto">
          ({String(completedHours).padStart(2, "0")}/
          {String(totalHours).padStart(2, "0")})
        </p>
      </StatCard>
      {/* 2– Approved Total Hours */}
      <StatCard>
        <div className="flex flex-col items-center gap-2">
          <IconCircle>
            <Clock size={22} strokeWidth={1.8} />
          </IconCircle>
          <p className="text-xs font-bold text-white/70">اجمالي الساعات</p>
        </div>
        <p className="text-3xl font-black text-white mt-auto leading-none">
          {String(totalHours).padStart(2, "0")}
          <span className="text-xs font-bold text-white/50 mr-1">ساعات</span>
        </p>
      </StatCard>
      {/* 3 – Remaining Hours */}
      <StatCard>
        <div className="flex flex-col items-center gap-2">
          <IconCircle>
            <Hourglass size={22} strokeWidth={1.8} />
          </IconCircle>
          <p className="text-xs font-bold text-white/70">الساعات المتبقية</p>
        </div>

        {/* Value at the very bottom */}
        <p className="text-3xl font-black text-white mt-auto leading-none">
          {String(remainingHours).padStart(2, "0")}
          <span className="text-xs font-bold text-white/50 mr-1">ساعة</span>
        </p>
      </StatCard>

      {/* 4 – Target End Date */}
      <StatCard
        deadlineRef={deadlineRef}
        className={`transition-all duration-500 ${
          highlight 
            ? "!z-20 ring-4 ring-secondary-300 ring-offset-2 scale-[1.02] shadow-lg animate-pulse" 
            : "z-10"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <IconCircle>
            <Calendar size={22} strokeWidth={1.8} />
          </IconCircle>
          <p className="text-xs font-bold text-white/70">تاريخ الانتهاء</p>
        </div>
        <div className="mt-auto space-y-1">
          <p className="text-base font-black text-white tracking-tight leading-none">
            {endDate}
          </p>
          {proposedEndDate && (
            <p className="text-xs font-bold text-secondary-300 leading-none pt-1">
              مقترح: {proposedEndDate}
            </p>
          )}
        </div>
      </StatCard>
    </div>
  );
}
