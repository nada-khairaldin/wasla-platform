"use client";
import { X, Home, FileText, LayoutGrid, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getInitials } from "../../utils";
import AppNavLink from "./AppNavLink";
import {
  useAuthActions,
} from "../../features/auth/store/useAuthStore";

const SIDEBAR_LINKS = [
  { id: 1, label: "الرئيسية", href: "/home", icon: Home },
  { id: 2, label: "عقودي", href: "/my-contracts", icon: FileText },
  { id: 3, label: "منشوراتي", href: "/my-posts", icon: LayoutGrid },
];

function MobilePublicSidebar({
  isOpen,
  onClose,
  username,
  points,
}: {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  points: string;
}) {
  const pathname = usePathname();
  const { logout } = useAuthActions();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-300 ${
          isOpen
            ? "opacity-100 visible bg-white/20 backdrop-blur-md"
            : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[70] transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } p-6 flex flex-col`}
      >
        <button
          onClick={onClose}
          className="self-start mb-6 p-2 -mr-2 active:scale-90 transition-transform"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-neutral-100">
          <Link href="/my-profile" onClick={onClose} className="shrink-0 cursor-pointer transition-transform active:scale-95">
            <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold font-cairo text-sm border-2 border-white shadow-sm">
              {getInitials(username)}
            </div>
          </Link>
          <div>
            <h4 className="font-bold font-cairo text-neutral-900 leading-tight">
              {username}
            </h4>
            <Link
              href="/my-profile"
              onClick={onClose}
              className="text-xs text-primary-600 font-bold hover:underline transition-all"
            >
              عرض الملف الشخصي
            </Link>
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <AppNavLink
                key={link.id}
                icon={<Icon size={20} />}
                label={link.label}
                href={link.href}
                active={isActive}
                onClick={onClose}
                variant="sidebar"
              />
            );
          })}
        </nav>

        <button
          className="flex items-center gap-4 text-red-500 font-bold font-cairo p-3 hover:bg-red-50 rounded-xl transition-all group"
          onClick={logout}
        >
          <LogOut
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </>
  );
}

export default MobilePublicSidebar;
