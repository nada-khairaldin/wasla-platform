export type NotificationCategory = "all" | "contracts" | "sessions" | "chat";

export interface Notification {
  id: string;
  category: Exclude<NotificationCategory, "all">;
  type?: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  iconType: "contract" | "offer" | "message" | "session";
  data?: unknown;
  createdAt?: string;
}