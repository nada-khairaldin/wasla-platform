"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, RefreshCw, CheckCircle2 } from "lucide-react";
import { NotificationCategory } from "../notificationTypes ";
import { NotificationTabs } from "./NotificationTabs";
import { NotificationItem } from "./NotificationItem";
import { useNotifications } from "../hooks/useNotifications";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({
  isOpen,
  onClose,
}: NotificationsPanelProps) {
  const [activeTab, setActiveTab] = useState<NotificationCategory>("all");
  const panelRef = useRef<HTMLDivElement>(null);
  
  const { notifications, fetchNextPage, hasNextPage, isFetchingNextPage, markAllAsRead } = useNotifications();

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (!panelRef.current || panelRef.current.offsetWidth === 0) return;

      if (
        !panelRef.current.contains(e.target as Node) &&
        !(e.target as Element).closest('[data-notif-trigger]')
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  // Exclude messages from the main notifications panel if needed, or filter by activeTab
  const nonMessageNotifications = notifications.filter(n => n.category !== "messages");
  const filtered =
    activeTab === "all"
      ? nonMessageNotifications
      : nonMessageNotifications.filter((n) => n.category === activeTab);

  const unreadCount = nonMessageNotifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="
        fixed top-16 left-1/2 -translate-x-1/2 mt-2 
        w-[calc(100vw-32px)] max-w-[400px] max-h-[85vh] 
        md:absolute md:top-full md:left-0 md:translate-x-0 md:w-[400px] md:max-h-[560px]
        bg-white rounded-2xl shadow-2xl border border-neutral-100/50 
        flex flex-col overflow-hidden z-[100000]
        animate-in fade-in slide-in-from-top-2 duration-200
      "
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-primary-500" strokeWidth={2} />
          <span className="text-sm font-bold text-primary-700">الإشعارات</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-semibold bg-primary-700 text-white rounded-full w-4 h-4 leading-none flex justify-center items-center">
              {unreadCount}
            </span>
          )}
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            disabled={markAllAsRead.isPending}
            className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors disabled:opacity-50"
          >
            <CheckCircle2 size={14} />
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      <NotificationTabs active={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto divide-y divide-[#edeeef] custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-200">
            <Bell size={32} strokeWidth={1.2} className="mb-2 opacity-50" />
            <p className="text-sm">لا توجد إشعارات</p>
          </div>
        ) : (
          filtered.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onNavigate={onClose}
            />
          ))
        )}
      </div>

      {hasNextPage && (
        <div className="px-4 py-3 border-t border-neutral-50">
          <button 
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-neutral-200/60 text-xs font-medium text-neutral-500 hover:bg-neutral-50/60 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} strokeWidth={2} className={isFetchingNextPage ? "animate-spin" : ""} />
            {isFetchingNextPage ? "جاري التحميل..." : "تحميل الاشعارات السابقة"}
          </button>
        </div>
      )}
    </div>
  );
}
