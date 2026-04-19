"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "../ui/Logo";
import Button from "../ui/Button";
import PublicNavTabs from "./PublicNavTabs";
import Link from "next/link";

export default function PublicNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="pt-base pb-base px-base md:px-base lg:px-xl7 flex items-center justify-between  relative z-50 sticky top-0  bg-white md:bg-white/80 md:backdrop-blur-lg ">
      <Logo />

      {/* Desktop Navigation */}
      <div className="hidden md:flex ">
        <PublicNavTabs setMenuOpen={setMenuOpen} />
      </div>
      <div className=" hidden md:flex gap-xs2 lg:gap-sm items-center">
        <Link href="/login" className="w-full">
          <Button variant="filled" className="text-label-2 lg:text-label-1">
            سجل دخول
          </Button>
        </Link>
        <Link href="/signup" className="w-full">
          <Button
            variant="outline"
            className="rounded-full px-lg text-label-2 lg:text-label-1"
          >
            ابدأ مجاناً
          </Button>
        </Link>
      </div>

      {/* Mobile Toggle */}
      <button
        className="md:hidden p-xs rounded-xl hover:bg-neutral-50 shadow-sm transition-all border border-neutral-100"
        onClick={() => setMenuOpen(true)}
      >
        <Menu size={24} className="text-neutral-800" />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Side Glass Drawer*/}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-white/80 backdrop-blur-md z-[70] shadow-2xl border-l border-white/20 transition-transform duration-500 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-lg">
          {/* Header of Drawer */}
          <div className="flex items-center justify-between mb-xl4">
            <Logo />
            <button
              onClick={() => setMenuOpen(false)}
              className="p-xs2 hover:bg-neutral-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1">
            <PublicNavTabs mobile setMenuOpen={setMenuOpen} />
          </div>

          {/* Action Buttons at bottom */}
          <div className="flex flex-col gap-sm pt-lg border-t border-neutral-100/50">
            <Link href="/login" className="w-full">
              <Button
                className="w-full rounded-xl shadow-md"
                onClick={() => setMenuOpen(false)}
              >
                ابدأ مجاناً
              </Button>
            </Link>
            <Link href="/signup" className="w-full">
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={() => setMenuOpen(false)}
              >
                سجل دخول
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
