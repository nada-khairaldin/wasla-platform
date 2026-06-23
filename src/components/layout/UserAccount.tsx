"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, LogOut, KeyRound, Wallet } from "lucide-react";
import { getInitials } from "@/src/utils/index";
import { motion, AnimatePresence } from "framer-motion";
import AppNavLink from "./AppNavLink";
import {
  useAuthActions,
} from "../../features/auth/store/useAuthStore";

export const UserAccount = ({
  username,
  points,
}: {
  username: string;
  points: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuthActions();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-xs bg-white border rounded-full py-2 pr-1.5 pl-3 transition-all cursor-pointer select-none
          ${isOpen ? "border-primary-200 shadow-md ring-4 ring-primary-50/50" : "border-neutral-100 hover:shadow-sm"}`}
      >
        <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold font-cairo text-xs border border-white shadow-sm">
          {getInitials(username)}
        </div>

        <div className="flex flex-col items-start leading-tight gap-xxs">
          <span className="text-neutral-900 font-bold text-[13px] font-cairo line-clamp-1">
            {username}
          </span>
          <span className="text-primary-500 text-[10px] font-bold font-cairo bg-primary-50 px-1.5 py-0.5 rounded-md">
            {points}
          </span>
        </div>

        <ChevronDown
          size={14}
          className={`text-neutral-400 transition-transform duration-300 ${isOpen ? "rotate-180" : "group-hover:translate-y-0.5"}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 mt-3 w-60 bg-white border border-neutral-100 rounded-2xl shadow-xl z-[60] overflow-hidden p-2"
          >
            <div className="flex flex-col gap-1">
              <AppNavLink
                href="/my-profile"
                icon={<User size={18} />}
                label="عرض الملف الشخصي"
                variant="dropdown"
                onClick={() => setIsOpen(false)}
              />
              <AppNavLink
                href="/my-profile/wallet"
                icon={<Wallet size={18} />}
                label="تفاصيل المحفظة"
                variant="dropdown"
                onClick={() => setIsOpen(false)}
              />

              <div className="h-px bg-neutral-50 my-1 mx-2" />

              <button
                onClick={logout}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 transition-colors rounded-xl font-bold font-cairo text-sm active:scale-95"
              >
                <LogOut size={18} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
