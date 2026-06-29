"use client";

import { NotificationCategory } from "../notificationTypes ";

interface Tab {
  key: NotificationCategory;
  label: string;
}

const TABS: Tab[] = [
  { key: "all", label: "الكل" },
  { key: "contracts", label: "العقود" },
  { key: "sessions", label: "جلسات العمل" },
];

interface NotificationTabsProps {
  active: NotificationCategory;
  onChange: (tab: NotificationCategory) => void;
}

export function NotificationTabs({ active, onChange }: NotificationTabsProps) {
  return (
    <div
      className="flex items-center gap-1 border-b border-neutral-100/50 px-2  no-scrollbar"
    >
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`relative shrink-0 px-4 py-2.5 text-sm font-medium transition-colors duration-150 whitespace-nowrap ${
            active === tab.key
              ? "text-primary-700 "
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          {tab.label}
          {active === tab.key && (
            <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-primary-700 rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  );
}