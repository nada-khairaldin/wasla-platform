import { FileText, Users } from "lucide-react";
import { motion } from "framer-motion";

interface SearchTabsProps {
  activeTab: "posts" | "users";
  onTabChange: (tab: "posts" | "users") => void;
}

export const SearchTabs = ({ activeTab, onTabChange }: SearchTabsProps) => {
  const tabs = [
    { key: "posts" as const, label: "منشورات", icon: FileText },
    { key: "users" as const, label: "مستخدمين", icon: Users },
  ];

  return (
    <div className="flex p-1 mx-3 md:mx-4 mb-3 bg-neutral-100/80 rounded-xl relative">
      {tabs.map(({ key, label, icon: Icon }) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-colors relative z-10 ${
              isActive
                ? "text-primary-700"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="searchTabIndicator"
                className="absolute inset-0 bg-white rounded-lg shadow-sm border border-neutral-200/50"
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                style={{ zIndex: -1 }}
              />
            )}
            <Icon size={16} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
