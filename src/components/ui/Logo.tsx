"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

function Logo({ isFooter = false , className = "" }: { isFooter?: boolean; className?: string }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Link href={mounted && isAuthenticated ? "/home" : "/"}>
      <div
        className={
          isFooter
            ? "relative w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 bg-white rounded-2xl flex items-center justify-center p-2 md:p-3"
            : className
        }
      >
        <Image
          src="/images/common/logo.svg"
          alt="Wasla Logo"
          width={60}
          height={70}
          className={
            isFooter
              ? "object-contain translate-x-1 hover:-rotate-10 hover:scale-120 transition-transform duration-300"
              : ""
          }
        />
      </div>
    </Link>
  );
}

export default Logo;
