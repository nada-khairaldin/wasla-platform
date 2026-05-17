"use client";
import { useState } from "react";
import { Bell, MessageSquare, Menu, X, Search } from "lucide-react";
import Logo from "./../ui/Logo";
import { UserAccount } from "./UserAccount";
import DesktopPublicNavLinks from "./DesktopPublicNavLinks";
import SearchBar from "./../../features/search/components/SearchBar";
import MobilePublicSidebar from "./MobilePublicSidebar";
import {Skeleton} from "../ui/Skeleton";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";

const NAV_LINKS = [
  { label: "الرئيسية", href: "/home" },
  { label: "عقودي", href: "/contracts" },
  { label: "منشوراتي", href: "/my-posts" },
];

export default function AppNavbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: user, isLoading } = useCurrentUser();
  const username = user?.Username ?? "User";

  return (
    <>
      <div
        className={`fixed inset-0 z-60 transition-all duration-300 md:hidden ${
          sidebarOpen
            ? "bg-white/20 backdrop-blur-md opacity-100 visible"
            : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <nav
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md  px-4 md:px-8 lg:px-16"
        dir="rtl"
      >
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center py-3 md:h-[75px] justify-between gap-3 md:gap-4">
          <div className="flex items-center justify-between w-full md:w-auto shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-neutral-600"
              >
                <Menu size={26} />
              </button>
              <Logo />
            </div>

          
            <div className="flex items-center gap-3 md:hidden">
              <button className="relative p-1 text-neutral-500">
                <MessageSquare size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  3
                </span>
              </button>
              <button className="relative p-1 text-neutral-500">
                <Bell size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  3
                </span>
              </button>
            </div>
          </div>
          <div className="hidden lg:block w-64  mr-xl">
            <SearchBar />
          </div>
         
          <div className="hidden md:flex items-center md:gap-6 lg:gap-10 mx-auto">
            <DesktopPublicNavLinks links={NAV_LINKS} />
          </div>

       
          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
          

            <button className="hidden md:flex lg:hidden p-2 text-neutral-500 hover:bg-neutral-50 rounded-xl transition-all">
              <Search size={22} />
            </button>

           
            <div className="hidden md:flex items-center gap-1 border-l border-neutral-100 pl-2">
              <button className="relative p-2 text-neutral-500 hover:bg-neutral-50 rounded-xl transition-all">
                <MessageSquare size={22} strokeWidth={1.8} />
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center border-2 border-white">
                  3
                </span>
              </button>
              <button className="relative p-2 text-neutral-500 hover:bg-neutral-50 rounded-xl transition-all">
                <Bell size={22} strokeWidth={1.8} />
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center border-2 border-white">
                  3
                </span>
              </button>
            </div>

            <div className="hidden md:block">
              {isLoading ? (
                <Skeleton />
              ) : (
                user && (
                  <UserAccount
                    username={user?.Username}
                    points={`رصيدك ${user?.points ?? 0} نقطة`}
                  />
                )
              )}
            </div>
          </div>

          <div className="md:hidden w-full">
            <SearchBar />
          </div>
        </div>
      </nav>

      <MobilePublicSidebar
        isOpen={sidebarOpen}
        username={username}
        points={`رصيدك ${user?.points ?? 0} نقطة`}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
}
