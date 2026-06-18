import { ChevronLeft } from "lucide-react";
import { Notification } from "../notificationTypes ";
import { NotificationIcon } from "./NotificationIcon";
import { useNotifications } from "../hooks/useNotifications";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
  notification: Notification;
  onNavigate?: () => void;
  onClick?: () => void;
}

export function NotificationItem({ notification, onNavigate, onClick }: NotificationItemProps) {
  const { id, title, description, time, isRead, iconType, category, data } = notification;
  const { markAsRead } = useNotifications();
  const router = useRouter();

  const handleClick = () => {
    if (!isRead) {
      markAsRead.mutate(id);
    }
    
    if (onClick) {
      onClick();
    }

    if (category === "messages" || notification.type === "NEW_MESSAGE") {
      if (onNavigate) onNavigate();
      
      let parsedData = data;
      if (typeof data === "string") {
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          console.error("Failed to parse notification data", e);
        }
      }

      const chatData = parsedData as Record<string, unknown> | undefined;
      const chatId = chatData?.conversationId || chatData?.chatId;
      if (chatId) {
        router.push(`/messages?conversationId=${chatId}`);
      } else {
        router.push(`/messages`);
      }
    }
  };

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 hover:bg-neutral-50/30 ${
        !isRead ? "bg-neutral-50/50" : ""
      }`}
      dir="rtl"
      onClick={handleClick}
    >
      {/* Unread dot */}
      <div className="flex-shrink-0 mt-4 w-2">
        {!isRead && (
          <span className="block w-2 h-2 rounded-full bg-primary-700" />
        )}
      </div>

      <NotificationIcon iconType={iconType} />

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug text-primary-900 ${
            !isRead ? "font-semibold" : "font-medium"
          }`}
        >
          {title}
        </p>
        <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed line-clamp-2">
          {description}
        </p>
        <p className="text-[11px] text-neutral-200 mt-1">{time}</p>
      </div>

      <ChevronLeft
        size={16}
        className="flex-shrink-0 mt-1 text-neutral-200"
        strokeWidth={2}
      />
    </div>
  );
}