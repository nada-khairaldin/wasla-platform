"use client";

import { useRouter } from "next/navigation";
import { ContractStatus } from "../contract.types";

interface ContractStatusTabsProps {
  active: string;
  onChange?: (status: string) => void;
  tabs?: { key: string; label: string; route?: string }[];
}

const TABS: { key: string; label: string; route: string }[] = [
  { key: "active",  label: "نشطة", route: "/my-contracts" },
  { key: "pending", label: "قيد الانتظار", route: "/my-contracts" },
  { key: "completed", label: "منتهية", route: "/my-contracts/completed" },
];

export function ContractStatusTabs({ active, onChange, tabs }: ContractStatusTabsProps) {
  const router = useRouter();

  const currentTabs = tabs || TABS;
  const activeIndex = currentTabs.findIndex((t) => t.key === active);
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;
  const tabCount = currentTabs.length;

  const handleTabClick = (tab: typeof currentTabs[0]) => {
    onChange?.(tab.key);
  };

  return (
    <div
      className="relative flex w-full rounded-2xl border border-neutral-100 bg-neutral-50 p-1.5 shadow-sm overflow-hidden"
    >
      <div
        className="absolute top-1.5 bottom-1.5 bg-primary-500 rounded-xl shadow-sm transition-all duration-300 ease-out"
        style={{
          width: `calc((100% - 12px) / ${tabCount})`,
          right: "6px",
          transform: `translateX(calc(-100% * ${safeActiveIndex}))`
        }}
      />

      {currentTabs.map((tab) => {
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