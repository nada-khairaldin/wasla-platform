import { QueryClient } from "@tanstack/react-query";
import { isDeadlineApproaching } from "@/src/features/contracts/utils/deadlineUtils";
import { Notification } from "../notificationTypes ";

interface NotificationsCache {
  pages: {
    notifications: Notification[];
    nextCursor?: string | null;
    unreadCount?: number;
    unreadMsgCount?: number;
  }[];
  pageParams: unknown[];
}

export function parseNotificationPayloadData(data: unknown): Record<string, unknown> {
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (data && typeof data === "object") {
    return data as Record<string, unknown>;
  }
  return {};
}

export function findDeadlineApproachingNotification(
  notifications: Notification[] | undefined,
  contractId: string | number | undefined
): Notification | undefined {
  if (!notifications || contractId == null) return undefined;

  return notifications.find((notification) => {
    if (notification.type !== "DEADLINE_APPROACHING") return false;
    const payload = parseNotificationPayloadData(notification.data);
    return String(payload.contractId) === String(contractId);
  });
}

export function removeDeadlineApproachingNotifications(
  queryClient: QueryClient,
  contractId: string | number
): void {
  queryClient.setQueryData<NotificationsCache>(["notifications"], (old) => {
    if (!old) return old;

    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        notifications: page.notifications?.filter((notification) => {
          if (notification.type !== "DEADLINE_APPROACHING") return true;
          const payload = parseNotificationPayloadData(notification.data);
          return String(payload.contractId) !== String(contractId);
        }),
      })),
    };
  });
}

/** Drops stale approaching-deadline notifications when the contract end date is no longer near. */
export function syncDeadlineApproachingNotifications(
  queryClient: QueryClient,
  contractId: string | number,
  contractEndDate: string | null | undefined
): void {
  if (!contractEndDate || isDeadlineApproaching(contractEndDate)) return;
  removeDeadlineApproachingNotifications(queryClient, contractId);
}
