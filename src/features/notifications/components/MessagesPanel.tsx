"use client";

import { useRef, useEffect } from "react";
import { Inbox, MessageSquare } from "lucide-react";
import { NotificationItem } from "./NotificationItem";
import { useRouter } from "next/navigation";
import { useNotifications } from "../hooks/useNotifications";

interface MessagesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement>;
}

export function MessagesPanel({
  isOpen,
  onClose,
  anchorRef,
}: MessagesPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { notifications, markAllAsRead } = useNotifications();

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (!panelRef.current || panelRef.current.offsetWidth === 0) return;

      if (
        !panelRef.current.contains(e.target as Node) &&
        (!anchorRef?.current ||
          !anchorRef.current.contains(e.target as Node))
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose, anchorRef]);

  const handleNavigate = () => {
    onClose();
    router.push("/messages");
  };

  const messages = notifications.filter((n) => n.category === "messages");
  const unreadCount = messages.filter((n) => !n.isRead).length;

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
      {/* Header */}

      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <MessageSquare
            size={18}
            className="text-primary-500"
            strokeWidth={1.8}
          />
          <span className="text-sm font-bold text-primary-700">الرسائل</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-semibold bg-primary-700 text-white rounded-full w-4 h-4 leading-none flex justify-center items-center">
              {unreadCount}
            </span>
          )}
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
            className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors disabled:opacity-50"
          >
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      <div className="h-px bg-[#edeeef] mx-4" />

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#edeeef] custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-200">
            <MessageSquare
              size={32}
              strokeWidth={1.2}
              className="mb-2 opacity-50"
            />
            <p className="text-sm">لا توجد رسائل</p>
          </div>
        ) : (
          messages.map((msg) => (
            <NotificationItem
              key={msg.id}
              notification={msg}
              onNavigate={onClose}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-neutral-50">
        <button
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-neutral-200/60 text-xs font-medium text-neutral-500 hover:bg-neutral-50/60 transition-colors cursor-pointer"
          onClick={handleNavigate}
        >
          <Inbox size={13} strokeWidth={2} />
          الانتقال إلى صندوق الوارد
        </button>
      </div>
    </div>
  );
}


