"use client";

import { Calendar, Clock, Hourglass } from "lucide-react";
import { ContractStats } from "../contract.types";
import { ProgressRing } from "./ProgressRing";

interface ContractStatsRowProps {
  stats?: ContractStats; // Safe fallback handle
}


function StatCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[208px] h-[248px] rounded-[24px] bg-primary-500 pt-[32px] pb-[28px] px-[20px] flex flex-col items-center justify-between text-center shadow-sm hover:shadow-md transition-all duration-200 mx-auto">
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

export function ContractStatsRow({ stats }: ContractStatsRowProps) {
  const {
    completedHours = 0,
    totalHours = 0,
    endDate = "—",
    remainingHours = 0,
  } = stats || {};

  const progressPercentage =
    totalHours > 0 ? (completedHours / totalHours) * 100 : 0;

  return (
    <div className="w-full flex flex-wrap items-center justify-center md:justify-start gap-6">
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
      <StatCard>
        <div className="flex flex-col items-center gap-2">
          <IconCircle>
            <Calendar size={22} strokeWidth={1.8} />
          </IconCircle>
          <p className="text-xs font-bold text-white/70">تاريخ الانتهاء</p>
        </div>
        <p className="text-base font-black text-white tracking-tight mt-auto leading-none pb-1">
          {endDate}
        </p>
      </StatCard>
    </div>
  );
}
