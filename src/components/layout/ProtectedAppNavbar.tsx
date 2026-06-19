"use client";
import { useRef, useState } from "react";
import { Bell, MessageSquare, Menu, X, Search } from "lucide-react";
import Logo from "../ui/Logo";
import { UserAccount } from "./UserAccount";
import DesktopPublicNavLinks from "./DesktopProtectedNavLinks";
import SearchBar from "../../features/search/components/SearchBar";
import MobilePublicSidebar from "./MobileProtectedSidebar";
import { Skeleton } from "../ui/Skeleton";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { MessagesPanel } from "@/src/features/notifications/components/MessagesPanel";
import { NotificationsPanel } from "../../features/notifications/components/NotificationsPanel";
import { useNotifications } from "@/src/features/notifications/hooks/useNotifications";
import { useConversations } from "@/src/features/messages/hooks/useConversations";
import { useAuthStore } from "@/src/features/auth/store/useAuthStore";
import { useUserProfile } from "../../features/profile/hooks/useUserProfile";

const NAV_LINKS = [
  { label: "الرئيسية", href: "/home" },
  { label: "عقودي", href: "/my-contracts" },
  { label: "منشوراتي", href: "/my-posts" },
];

export default function ProtectedAppNavbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);

  const { data: currentUser, isLoading } = useCurrentUser();
  const userId = currentUser?.user?.userId ? Number(currentUser.user.userId) : undefined;
  const { data: profileData, isLoading: isProfileLoading } =
    useUserProfile(userId);
  const username = profileData?.profile?.username ?? "User";
  const points = profileData?.profile?.stats?.availableTimeCredits ?? 0;

  const bellRef = useRef<HTMLButtonElement>(null);
  const msgRef = useRef<HTMLButtonElement>(null);

  const { notifications, unreadCount } = useNotifications();
  const { conversations } = useConversations();

  const displayUnreadNotifCount = unreadCount ?? notifications.filter(
    (n) => !n.isRead && n.category !== "messages",
  ).length;

  const displayUnreadMsgCount = conversations 
    ? conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0)
    : notifications.filter((n) => !n.isRead && n.category === "messages").length;


  function toggleNotif(e: React.MouseEvent) {
    e.stopPropagation();
    setNotifOpen((prev) => !prev);
    setMsgOpen(false);
  }

  function toggleMsg(e: React.MouseEvent) {
    e.stopPropagation();
    setMsgOpen((prev) => !prev);
    setNotifOpen(false);
  }

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
              <div className="relative">
                <button
                  data-msg-trigger="true"
                  onClick={toggleMsg}
                  className={`relative p-2 rounded-xl transition-all ${
                    msgOpen
                      ? "bg-[#e9eef2] text-primary-400"
                      : "text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  <MessageSquare size={22} strokeWidth={1.8} />
                  {displayUnreadMsgCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center border-2 border-white">
                      {displayUnreadMsgCount > 99 ? '99+' : displayUnreadMsgCount}
                    </span>
                  )}
                </button>
                <MessagesPanel
                  isOpen={msgOpen}
                  onClose={() => setMsgOpen(false)}
                />
              </div>

              {/* Bell button + panel */}
              <div className="relative">
                <button
                  data-notif-trigger="true"
                  onClick={toggleNotif}
                  className={`relative p-2 rounded-xl transition-all ${
                    notifOpen
                      ? "bg-[#e9eef2] text-primary-400"
                      : "text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  <Bell size={22} strokeWidth={1.8} />
                  {displayUnreadNotifCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center border-2 border-white">
                      {displayUnreadNotifCount > 99 ? '99+' : displayUnreadNotifCount}
                    </span>
                  )}
                </button>
                <NotificationsPanel
                  isOpen={notifOpen}
                  onClose={() => setNotifOpen(false)}
                />
              </div>
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
              <div className="relative">
                <button
                  data-msg-trigger="true"
                  onClick={toggleMsg}
                  className={`relative p-2 rounded-xl transition-all ${
                    msgOpen
                      ? "bg-[#e9eef2] text-primary-400"
                      : "text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  <MessageSquare size={22} strokeWidth={1.8} />
                  {displayUnreadMsgCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center border-2 border-white">
                      {displayUnreadMsgCount > 99 ? '99+' : displayUnreadMsgCount}
                    </span>
                  )}
                </button>
                <MessagesPanel
                  isOpen={msgOpen}
                  onClose={() => setMsgOpen(false)}
                />
              </div>

              {/* Bell button + panel */}
              <div className="relative">
                <button
                  data-notif-trigger="true"
                  onClick={toggleNotif}
                  className={`relative p-2 rounded-xl transition-all ${
                    notifOpen
                      ? "bg-[#e9eef2] text-primary-400"
                      : "text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  <Bell size={22} strokeWidth={1.8} />
                  {displayUnreadNotifCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center border-2 border-white">
                      {displayUnreadNotifCount > 99 ? '99+' : displayUnreadNotifCount}
                    </span>
                  )}
                </button>
                <NotificationsPanel
                  isOpen={notifOpen}
                  onClose={() => setNotifOpen(false)}
                />
              </div>
            </div>

            <div className="hidden md:block">
              {isLoading ? (
                <Skeleton />
              ) : (
                profileData && (
                  <UserAccount
                    username={username}
                    points={`رصيدك ${points} ساعة`}
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
        points={`رصيدك ${points} ساعة`}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
}
