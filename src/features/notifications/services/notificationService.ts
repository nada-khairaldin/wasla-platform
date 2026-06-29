import { apiRequest } from "@/src/services/api";
import { Notification, NotificationCategory } from "../notificationTypes ";

export interface NotificationPayload {
  id: string;
  userId: number;
  type: string;
  title: string;
  body: string;
  data: unknown;
  isRead: boolean;
  createdAt: string;
}

export interface GetNotificationsResponse {
  notifications: NotificationPayload[];
  nextCursor?: string | null;
  unreadCount?: number;
  unreadMsgCount?: number;
}

export const mapNotificationPayloadToUI = (payload: NotificationPayload): Notification => {
  let category: Exclude<NotificationCategory, "all"> = "contracts";
  let iconType: "contract" | "offer" | "message" | "session" = "contract";

  const type = payload.type;
  if (
    type === "EXCHANGE_REQUESTED" ||
    type === "EXCHANGE_ACCEPTED" ||
    type === "EXCHANGE_REJECTED" ||
    type === "EXCHANGE_CANCELED" ||
    type === "CONTRACT_AUTO_RESOLVED" ||
    type.startsWith("DEADLINE_")
  ) {
    category = "contracts";
    iconType = "contract";
  } else if (
    type === "SESSION_RECORDED" ||
    type === "SESSION_CONFIRMED" ||
    type === "SESSION_REJECTED"
  ) {
    category = "sessions";
    iconType = "session";
  } else if (
    type === "NEW_MESSAGE" ||
    type === "CONVERSATION_STARTED"
  ) {
    category = "chat";
    iconType = "message";
  } else {
    // Default fallback
    category = "contracts";
    iconType = "contract";
  }

  // Simple relative time formatter
  const date = new Date(payload.createdAt);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  let timeStr = "";
  if (diffInMinutes < 1) timeStr = "الآن";
  else if (diffInMinutes < 60) timeStr = `منذ ${diffInMinutes} دقيقة`;
  else if (diffInMinutes < 1440) timeStr = `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
  else timeStr = `منذ ${Math.floor(diffInMinutes / 1440)} يوم`;

  return {
    id: payload.id,
    category,
    type: payload.type,
    title: payload.title,
    description: payload.body,
    time: timeStr,
    isRead: payload.isRead,
    iconType,
    data: payload.data,
    createdAt: payload.createdAt,
  };
};

export const notificationService = {
  getNotifications: async (cursor?: string, limit: number = 20) => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    params.append("limit", limit.toString());

    return apiRequest<GetNotificationsResponse>({
      method: "GET",
      url: `/notifications?${params.toString()}`,
    });
  },

  markAsRead: async (id: string) => {
    return apiRequest({
      method: "PATCH",
      url: `/notifications/${id}/read`,
    });
  },

  markAllAsRead: async () => {
    return apiRequest({
      method: "PATCH",
      url: `/notifications/read-all`,
    });
  },
};
