"use client";

import { LucideIcon } from "lucide-react";

interface InfoItemProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColorClass?: string;
}

export function ContractInfoItem({ 
  label, 
  value, 
  icon: Icon, 
  iconColorClass = "text-neutral-400" 
}: InfoItemProps) {
  return (
    <div className="flex items-start gap-2 bg-neutral-50/50 p-2.5 rounded-xl border border-neutral-50">
      <Icon size={16} className={`${iconColorClass} mt-0.5 shrink-0`} />
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] text-neutral-400 font-medium leading-tight">
          {label}
        </span>
        <span className="text-[13px] font-bold text-neutral-900 truncate mt-0.5">
          {value}
        </span>
      </div>
    </div>
  );
}