import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { scrollToSection } from "../../utils/scroll";

const tabs = [
  { name: "الرئيسية", id: "hero" },
  { name: "كيف تعمل", id: "how-it-works" },
  { name: "المميزات", id: "features" },
  { name: "قصص النجاح", id: "success-stories" },
];

export default function PublicNavTabs({
  mobile = false,
  setMenuOpen,
}: {
  mobile?: boolean;
  setMenuOpen: (open: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries : IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
          window.history.replaceState(null, "", `#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  if (mobile) {
    return (
      <ul className="flex flex-col gap-sm">
        {tabs.map((tab) => (
          <motion.li key={tab.id} whileTap={{ scale: 0.98 }}>
            <a
              href={`#${tab.id}`}
              onClick={(e) =>
                scrollToSection(e, tab.id, 120, () => {
                  setActiveTab(tab.id);
                  setMenuOpen(false);
                })
              }
              className={`group flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? "bg-primary-50/50"
                  : "hover:bg-primary-50/50"
              }`}
            >
              <span
                className={`text-h6 font-bold transition-colors ${
                  activeTab === tab.id
                    ? "text-primary-600"
                    : "text-neutral-900 group-hover:text-primary-600"
                }`}
              >
                {tab.name}
              </span>
              <ArrowLeft
                size={16}
                className={`ml-2 transition-all ${
                  activeTab === tab.id
                    ? "text-primary-600 opacity-100"
                    : "text-primary-300 opacity-0 group-hover:opacity-100 group-hover:text-primary-600"
                }`}
              />
            </a>
          </motion.li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="flex items-center justify-between gap-base lg:gap-xl4 xl:gap-xl8">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <motion.li
            key={tab.id}
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href={`#${tab.id}`}
              onClick={(e) =>
                scrollToSection(e, tab.id, 120, () => {
                  setActiveTab(tab.id);
                })
              }
              className={`text-label-1 lg:text-h6 xl:text-h2 font-bold white space-nowrap transition-colors cursor-pointer block pb-1 ${
                isActive
                  ? "text-primary-500"
                  : "text-neutral-900 hover:text-primary-500"
              }`}
            >
              {tab.name}
            </a>

            {isActive && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute -bottom-2 left-0 right-0 h-[3px] bg-primary-500 rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </motion.li>
        );
      })}
    </ul>
  );
}
