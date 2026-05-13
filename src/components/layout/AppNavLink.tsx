"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  variant?: "dropdown" | "sidebar"; 
  className?: string; 
}

function AppNavLink({
  href,
  icon,
  label,
  active = false,
  onClick,
  variant = "dropdown",
  className = "",
}: NavLinkProps) {
   
  const baseStyles =
    "flex items-center gap-4 px-4 py-3 rounded-xl font-bold font-cairo text-sm transition-all active:scale-95 group";

  const dropdownStyles = active
    ? "bg-primary-50 text-primary-600"
    : "text-neutral-600 hover:bg-primary-50 hover:text-primary-600";


  const sidebarStyles = active
    ? "bg-primary-50 text-primary-600 shadow-sm shadow-primary-100/50"
    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900";

  const variantStyles = variant === "dropdown" ? dropdownStyles : sidebarStyles;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      <span
        className={`transition-colors ${active ? "text-primary-600" : "text-neutral-400 group-hover:text-primary-500"}`}
      >
        {icon}
      </span>
      <span className={variant === "sidebar" ? "text-[15px]" : ""}>
        {label}
      </span>
    </Link>
  );
}

export default AppNavLink;
