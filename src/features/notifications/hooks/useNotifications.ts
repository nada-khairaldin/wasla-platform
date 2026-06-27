import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { notificationService, GetNotificationsResponse, NotificationPayload, mapNotificationPayloadToUI } from "../services/notificationService";
import { Notification } from "../notificationTypes ";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";

interface NotificationsCache {
  pages: {
    notifications: Notification[];
    nextCursor?: string | null;
    unreadCount?: number;
    unreadMsgCount?: number;
  }[];
  pageParams: unknown[];
}

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const currentUserId = Number(currentUser?.user?.userId);

  const query = useInfiniteQuery<{ notifications: Notification[]; nextCursor?: string | null; unreadCount?: number; unreadMsgCount?: number }, Error>({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam = undefined }) => {
      const { data, error } = await notificationService.getNotifications(
        pageParam as string | undefined
      );
      if (error) throw new Error(error);
      
      const backendData = data as GetNotificationsResponse;
      
      if (Array.isArray(backendData)) {
        return { 
          notifications: (backendData as unknown as NotificationPayload[]).map(mapNotificationPayloadToUI), 
          nextCursor: null 
        };
      }
      return {
        notifications: (backendData.notifications || []).map(mapNotificationPayloadToUI),
        nextCursor: backendData.nextCursor,
        unreadCount: backendData.unreadCount,
        unreadMsgCount: backendData.unreadMsgCount,
      };
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor || undefined,
    initialPageParam: undefined,
  });

  const markAsRead = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousData = queryClient.getQueryData(["notifications"]);

      queryClient.setQueryData(
        ["notifications"],
        (data: NotificationsCache | undefined) => {
          if (!data) return data;

          let wasUnread = false;
          data.pages.forEach((page) => {
            const found = page.notifications?.find((n) => n.id === id);
            if (found && !found.isRead) {
              wasUnread = true;
            }
          });

          return {
            ...data,
            pages: data.pages.map((page, index) => {
              const updatedPage = {
                ...page,
                notifications: page.notifications?.map((n) =>
                  n.id === id ? { ...n, isRead: true } : n
                ),
              };

              if (wasUnread && index === 0 && updatedPage.unreadCount !== undefined) {
                updatedPage.unreadCount = Math.max(0, updatedPage.unreadCount - 1);
              }

              return updatedPage;
            }),
          };
        }
      );

      return { previousData };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["notifications"], context.previousData);
      }
    },
    onSettled: () => {
      // Optional: queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousData = queryClient.getQueryData(["notifications"]);

      queryClient.setQueryData(
        ["notifications"],
        (data: NotificationsCache | undefined) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page, index) => ({
              ...page,
              unreadCount: index === 0 ? 0 : page.unreadCount,
              notifications: page.notifications?.map((n) => ({ ...n, isRead: true })),
            })),
          };
        }
      );

      return { previousData };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["notifications"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const notificationsRaw = query.data?.pages.flatMap((p) => p.notifications || []) || [];
  const seenIds = new Set<string>();
  const notifications = notificationsRaw.filter((n) => {
    if (seenIds.has(n.id)) return false;
    seenIds.add(n.id);
    return true;
  });

  return {
    ...query,
    notifications,
    unreadCount: query.data?.pages[0]?.unreadCount,
    unreadMsgCount: query.data?.pages[0]?.unreadMsgCount,
    markAsRead,
    markAllAsRead,
  };
};
