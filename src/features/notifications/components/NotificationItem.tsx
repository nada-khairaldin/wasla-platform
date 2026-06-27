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
  const { id, title, description, time, isRead, iconType, data } = notification;
  const { markAsRead } = useNotifications();
  const router = useRouter();

  const handleClick = () => {
    if (!isRead) {
      markAsRead.mutate(id);
    }
    
    if (onClick) {
      try {
        onClick();
      } catch (e) {
        console.error(e);
      }
    }

    if (onNavigate) {
      try {
        onNavigate();
      } catch (e) {
        console.error(e);
      }
    }

    let parsedData: unknown = data;
    if (typeof data === "string") {
      try {
        parsedData = JSON.parse(data);
      } catch {
        console.error("Failed to parse notification data");
      }
    }
    const payloadData = (parsedData && typeof parsedData === "object") ? (parsedData as Record<string, unknown>) : {};

    const type = notification.type;

    if (type === "EXCHANGE_REQUESTED") {
      router.push("/my-contracts?tab=pending");
    } else if (type === "EXCHANGE_ACCEPTED") {
      router.push("/my-contracts?tab=active");
    } else if (type === "EXCHANGE_REJECTED") {
      router.push("/my-contracts?tab=completed&status=rejected");
    } else if (type === "EXCHANGE_CANCELED") {
      router.push("/my-contracts?tab=completed");
    } else if (type === "SESSION_RECORDED") {
      const cId = payloadData.contractId;
      if (cId) {
        router.push(`/my-contracts/${cId}?tab=sessions&status=pending`);
      } else {
        router.push("/my-contracts");
      }
    } else if (type === "SESSION_CONFIRMED" || type === "SESSION_REJECTED") {
      const cId = payloadData.contractId;
      if (cId) {
        router.push(`/my-contracts/${cId}?tab=sessions`);
      } else {
        router.push("/my-contracts");
      }
    } else if (type === "DEADLINE_PROPOSED") {
      const cId = payloadData.contractId;
      if (cId) {
        router.push(`/my-contracts/${cId}?tab=active&highlight=deadline`);
      } else {
        router.push("/my-contracts?tab=active");
      }
    } else if (type === "DEADLINE_APPROVED" || type === "DEADLINE_REJECTED") {
      router.push("/my-contracts?tab=active");
    } else if (
      type === "DEADLINE_APPROACHING" ||
      type === "CONTRACT_AUTO_RESOLVED"
    ) {
      const cId = payloadData.contractId;
      if (cId) {
        router.push(`/my-contracts/${cId}`);
      } else {
        router.push("/my-contracts");
      }
    } else if (type === "NEW_MESSAGE" || type === "CONVERSATION_STARTED") {
      const convId = payloadData.conversationId;
      if (convId) {
        router.push(`/messages?conversationId=${convId}`);
      } else {
        router.push("/messages");
      }
    } else {
      // Fallback/other types
      const cId = payloadData.contractId;
      if (cId) {
        router.push(`/my-contracts/${cId}`);
      } else {
        const convId = payloadData.conversationId;
        if (convId) {
          router.push(`/messages?conversationId=${convId}`);
        } else {
          router.push("/my-contracts");
        }
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
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-neutral-400 font-medium">{time}</span>
        </div>
      </div>

      <ChevronLeft
        size={16}
        className="flex-shrink-0 mt-1 text-neutral-200"
        strokeWidth={2}
      />
    </div>
  );
}