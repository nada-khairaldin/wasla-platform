export type NotificationCategory = "all" | "contracts" | "sessions" | "ratings" | "messages";

export interface Notification {
  id: string;
  category: Exclude<NotificationCategory, "all">;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  iconType: "contract" | "offer" | "message" | "rating" | "session";
}