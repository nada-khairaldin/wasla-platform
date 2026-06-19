"use client";

import { useRouter } from "next/navigation";
import { ContractStatus } from "../contract.types";

interface ContractStatusTabsProps {
  active: ContractStatus;
  onChange?: (status: ContractStatus) => void;
}

const TABS: { key: ContractStatus; label: string; route: string }[] = [
  { key: "active",  label: "نشطة", route: "/my-contracts" },
  { key: "pending", label: "قيد الانتظار", route: "/my-contracts" },
  { key: "completed", label: "منتهية", route: "/my-contracts/completed" },
];

export function ContractStatusTabs({ active, onChange }: ContractStatusTabsProps) {
  const router = useRouter();

  const handleTabClick = (tab: typeof TABS[0]) => {
    onChange?.(tab.key);
  };

  return (
    <div
      className="relative flex w-full rounded-2xl border border-neutral-100 bg-neutral-50 p-1.5 shadow-sm overflow-hidden"
    >
      <div
        className="absolute top-1.5 bottom-1.5 bg-primary-500 rounded-xl shadow-sm transition-all duration-300 ease-out"
        style={{
          width: "calc((100% - 12px) / 3)",
          right: "6px",
          transform: `translateX(${
            active === "active" ? "0" : active === "pending" ? "-100%" : "-200%"
          })`
        }}
      />

      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab)}
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