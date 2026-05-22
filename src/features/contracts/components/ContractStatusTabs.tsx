"use client";

import { ContractStatus } from "../contract.types";

interface ContractStatusTabsProps {
  active: ContractStatus;
  onChange: (status: ContractStatus) => void;
}

const TABS: { key: ContractStatus; label: string }[] = [
  { key: "active",  label: "نشطة" },
  { key: "pending", label: "قيد الانتظار" },
];

export function ContractStatusTabs({ active, onChange }: ContractStatusTabsProps) {
  return (
    <div
      className="relative flex w-full rounded-2xl border border-neutral-100 bg-neutral-50 p-1.5 shadow-sm overflow-hidden"
    >
      <div
        className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary-500 rounded-xl shadow-sm transition-all duration-300 ease-out ${
          active === "active" 
            ? "right-1.5 translate-x-0" 
            : "right-1.5 -translate-x-[calc(100%+2px)]"
        }`}
      />

      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`relative z-10 flex-1 py-3 text-sm font-bold rounded-xl transition-colors duration-300 ${
              isActive
                ? "text-white"
                : "text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100/50"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}