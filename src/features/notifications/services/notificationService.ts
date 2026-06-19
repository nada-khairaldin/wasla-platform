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
  let category: NotificationCategory = "all";
  let iconType: "contract" | "offer" | "message" | "rating" | "session" = "contract";

  if (payload.type === "NEW_MESSAGE" || payload.type === "CONVERSATION_STARTED") {
    category = "messages";
    iconType = "message";
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
    category: category as Exclude<NotificationCategory, "all">,
    type: payload.type,
    title: payload.title,
    description: payload.body,
    time: timeStr,
    isRead: payload.isRead,
    iconType: iconType,
    data: payload.data,
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
