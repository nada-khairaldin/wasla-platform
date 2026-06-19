import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { notificationService, GetNotificationsResponse, NotificationPayload, mapNotificationPayloadToUI } from "../services/notificationService";
import { Notification } from "../notificationTypes ";
import { useEffect } from "react";
import { getSocket } from "../../messages/services/socketService";
import Cookies from "js-cookie";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";

// Global debounce to prevent duplicate sounds and fetches
let lastSoundPlayedAt = 0;
// Global set to prevent playing the sound for the same notification multiple times if backend loops
const playedNotificationIds = new Set<string>();

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const currentUserId = Number(currentUser?.user?.userId);

  const query = useInfiniteQuery<{ notifications: Notification[]; nextCursor?: string | null }, Error>({
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
        nextCursor: backendData.nextCursor
      };
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor || undefined,
    initialPageParam: undefined,
  });

  useEffect(() => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      const socket = getSocket();
      if (!socket) return;

      const playNotificationSound = () => {
        const now = Date.now();
        if (now - lastSoundPlayedAt < 1000) return; // Debounce 1 second
        lastSoundPlayedAt = now;

        try {
          const audio = new Audio('/notification.mp3');
          audio.play().catch((err) => console.log('Audio autoplay prevented by browser:', err));
        } catch (e) {
          // ignore error
        }
      };

      const handleNewNotification = (payload: Record<string, unknown> | null) => {
        if (!payload) return;

        let dedupeKey = String(payload.id);

        // 1. Is this a raw message event (chat:message:new)?
        if (payload.conversationId && payload.senderId) {
          dedupeKey = String(payload.id);
          // Block sound if WE sent this message!
          if (Number(payload.senderId) === currentUserId) {
            playedNotificationIds.add(dedupeKey); // Add to Set so the matching notification is also blocked!
            return;
          }
        } 
        // 2. Is this a notification event (chat:notification:new)?
        else if (payload.type === "NEW_MESSAGE" && payload.data && typeof payload.data === "object") {
          const data = payload.data as Record<string, unknown>;
          if (data.messageId) {
            // Deduplicate based on the original message ID, NOT the notification ID!
            // This prevents backend loops from playing sound if they create new notification rows.
            dedupeKey = String(data.messageId);
          }
        }

        if (!dedupeKey || dedupeKey === "undefined" || dedupeKey === "null") {
          dedupeKey = `unknown-${Date.now()}-${Math.random()}`;
        }

        // 3. Prevent duplicate sounds for the same message/notification
        if (playedNotificationIds.has(dedupeKey)) return;
        
        playedNotificationIds.add(dedupeKey);
        // Keep set small to avoid memory leaks
        if (playedNotificationIds.size > 200) playedNotificationIds.clear();

        playNotificationSound();
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      };

      socket.on("notification:new", handleNewNotification); 
      socket.on("chat:notification:new", handleNewNotification); 
      socket.on("chat:message:new", handleNewNotification); // This is what actually works currently!

      return () => {
        socket.off("notification:new", handleNewNotification);
        socket.off("chat:notification:new", handleNewNotification);
        socket.off("chat:message:new", handleNewNotification);
      };
    } catch (e) {
      console.error("Socket error in useNotifications:", e);
    }
  }, [queryClient, currentUserId]);

  const markAsRead = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousData = queryClient.getQueryData(["notifications"]);

      queryClient.setQueryData(
        ["notifications"],
        (data: { pages: { notifications: Notification[]; nextCursor?: string | null }[]; pageParams: unknown[] } | undefined) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              notifications: page.notifications?.map((n) =>
                n.id === id ? { ...n, isRead: true } : n
              ),
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
        (data: { pages: { notifications: Notification[]; nextCursor?: string | null }[]; pageParams: unknown[] } | undefined) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
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
      // Optional: queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    ...query,
    notifications: query.data?.pages.flatMap((p) => p.notifications || []) || [],
    markAsRead,
    markAllAsRead,
  };
};
