import { useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { getSocket, disconnectSocket } from "../services/socketService";
import { useConversations } from "./useConversations";
import { notificationService, mapNotificationPayloadToUI } from "@/src/features/notifications/services/notificationService";
import type { NotificationPayload } from "@/src/features/notifications/services/notificationService";
import { syncDeadlineApproachingNotifications } from "@/src/features/notifications/utils/deadlineNotifications";
import { Notification } from "@/src/features/notifications/notificationTypes ";
import type { Exchange } from "@/src/features/profile/services/profileServices";
import type {
  ApiMessage,
  ApiConversation,
  ChatMessageNewEvent,
  ChatMessagesStatusEvent,
  ChatPresenceOnlineEvent,
  ChatPresenceOfflineEvent,
  ChatMessageDeletedEvent,
} from "../chat.types";
import type { Socket } from "socket.io-client";

export function useGlobalSocket() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const currentUserId = Number(currentUser?.user?.userId);
  const socketRef = useRef<Socket | null>(null);
  const joinedConversationsRef = useRef<Set<string>>(new Set());

  // Fetch conversations to ensure we have the list to join
  const { conversations } = useConversations();

  // Global debounce and dedupe state for notifications
  const lastSoundPlayedAtRef = useRef<number>(0);
  const playedNotificationIdsRef = useRef<Set<string>>(new Set());

  const emitDelivered = useCallback(
    (conversationId: string, messageIds: string[]) => {
      if (socketRef.current?.connected && messageIds.length > 0) {
        socketRef.current.emit("chat:messages:delivered", {
          conversationId,
          messageIds,
        });
      }
    },
    []
  );

  // Dynamic room joining effect
  useEffect(() => {
    if (conversations && socketRef.current?.connected) {
      conversations.forEach((conv) => {
        if (!joinedConversationsRef.current.has(conv.id)) {
          socketRef.current?.emit("chat:join", { conversationId: conv.id });
          joinedConversationsRef.current.add(conv.id);
        }
      });
    }
  }, [conversations]);

  useEffect(() => {
    if (!currentUserId) return;

    let socket: Socket;
    try {
      socket = getSocket();
    } catch {
      return;
    }

    socketRef.current = socket;

    const syncNotifications = async () => {
      try {
        const { data, error } = await notificationService.getNotifications();
        if (error || !data) return;
        
        const backendData = data;
        let mapped: Notification[] = [];
        let nextCursor: string | null = null;
        let unreadCount: number | undefined = undefined;
        let unreadMsgCount: number | undefined = undefined;

        if (Array.isArray(backendData)) {
          mapped = (backendData as unknown as NotificationPayload[]).map(mapNotificationPayloadToUI);
        } else if (backendData) {
          mapped = (backendData.notifications || []).map(mapNotificationPayloadToUI);
          nextCursor = backendData.nextCursor || null;
          unreadCount = backendData.unreadCount;
          unreadMsgCount = backendData.unreadMsgCount;
        }

        queryClient.setQueryData(["notifications"], {
          pages: [{
            notifications: mapped,
            nextCursor,
            unreadCount,
            unreadMsgCount
          }],
          pageParams: [undefined]
        });
      } catch (err) {
        console.error("Failed to sync notifications", err);
      }
    };

    // Sync notifications on app load
    syncNotifications();

    const onNewMessage = (msg: ChatMessageNewEvent) => {
      const queryKey = ["messages", msg.conversationId];

      queryClient.setQueryData<ApiMessage[]>(queryKey, (old) => {
        if (!old) return undefined; 
        const exists = old.some(
          (m) =>
            m.id === msg.id ||
            (msg.clientMessageId && m.clientMessageId === msg.clientMessageId)
        );
        if (exists) return old;
        return [...old, msg];
      });

      if (msg.senderId !== currentUserId) {
        emitDelivered(msg.conversationId, [msg.id]);
      }

      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    const playNotificationSound = () => {
      const now = Date.now();
      if (now - lastSoundPlayedAtRef.current < 1000) return; // Debounce 1 second
      lastSoundPlayedAtRef.current = now;

      try {
        const audio = new Audio('/notification.mp3');
        audio.play().catch((err) => console.log('Audio autoplay prevented by browser:', err));
      } catch {
        // ignore error
      }
    };

    const handleNewNotification = (payload: Record<string, unknown> | null) => {
      if (!payload) return;

      let dedupeKey = String(payload.id);

      // 1. Is this a raw message event (chat:message:new)?
      if (payload.conversationId && payload.senderId) {
        dedupeKey = String(payload.id);
        if (Number(payload.senderId) === currentUserId) {
          playedNotificationIdsRef.current.add(dedupeKey);
          return;
        }
      } 
      // 2. Is this a notification event (chat:notification:new)?
      else if (payload.type === "NEW_MESSAGE" && payload.data && typeof payload.data === "object") {
        const data = payload.data as Record<string, unknown>;
        if (data.messageId) {
          dedupeKey = String(data.messageId);
        }
      }

      if (!dedupeKey || dedupeKey === "undefined" || dedupeKey === "null") {
        try {
          dedupeKey = `hash-${JSON.stringify(payload)}`;
        } catch {
          dedupeKey = `unknown-${Date.now()}`;
        }
      }

      // 3. Prevent duplicate sounds for the same message/notification
      if (playedNotificationIdsRef.current.has(dedupeKey)) return;
      
      playedNotificationIdsRef.current.add(dedupeKey);
      
      // Clear set entirely if it gets too large, but to avoid the "Mark All as Read" blast bug,
      // we only delete the oldest half. For simplicity, just reset safely.
      if (playedNotificationIdsRef.current.size > 500) {
        playedNotificationIdsRef.current.clear();
      }

      playNotificationSound();

      // Invalidate the generic notifications list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      // Handle contract, session, and rating notifications
      const type = String(payload.type);
      if (type && type !== "NEW_MESSAGE" && type !== "CONVERSATION_STARTED") {
        // Show a visual toast notification in real-time
        if (payload.title) {
          toast(String(payload.title) + (payload.body ? `: ${String(payload.body)}` : ""), {
            icon: "🔔",
            duration: 5000,
          });
        }

        // Extract contract rich payload data to optimistically update queries in cache
        if (payload.data && typeof payload.data === "object") {
          const data = payload.data as Record<string, unknown>;
          const contractId = data.contractId ? String(data.contractId) : undefined;
          const contractEndDate = (data.contractEndDate !== undefined) ? (data.contractEndDate === null ? null : String(data.contractEndDate)) : undefined;
          const proposedEndDate = (data.proposedEndDate !== undefined) ? (data.proposedEndDate === null ? null : String(data.proposedEndDate)) : undefined;
          const status = data.status ? (data.status as Exchange["status"]) : undefined;

          if (contractId) {
            // Update active contract details query cache immediately
            queryClient.setQueryData<{ exchange: Exchange }>(
              ["contractDetails", contractId],
              (old) => {
                if (!old) return old;
                return {
                  ...old,
                  exchange: {
                    ...old.exchange,
                    contractEndDate: contractEndDate !== undefined ? contractEndDate : old.exchange.contractEndDate,
                    proposedEndDate: proposedEndDate !== undefined ? proposedEndDate : old.exchange.proposedEndDate,
                    status: status ? status : old.exchange.status,
                  },
                };
              }
            );

            // Update user exchanges list query cache immediately
            queryClient.setQueryData<Exchange[]>(
              ["userExchanges", undefined],
              (old) => {
                if (!old) return old;
                return old.map((ex) => {
                  if (String(ex.id) === contractId) {
                    return {
                      ...ex,
                      contractEndDate: contractEndDate !== undefined ? contractEndDate : ex.contractEndDate,
                      proposedEndDate: proposedEndDate !== undefined ? proposedEndDate : ex.proposedEndDate,
                      status: status ? status : ex.status,
                    };
                  }
                  return ex;
                });
              }
            );

            const effectiveEndDate =
              contractEndDate !== undefined
                ? contractEndDate
                : queryClient.getQueryData<{ exchange: Exchange }>([
                    "contractDetails",
                    contractId,
                  ])?.exchange?.contractEndDate;

            syncDeadlineApproachingNotifications(queryClient, contractId, effectiveEndDate);
          }
        }

        // Invalidate queries so React Query updates them from server in the background
        queryClient.invalidateQueries({ queryKey: ["userExchanges"] });
        queryClient.invalidateQueries({ queryKey: ["contractDetails"] });
        queryClient.invalidateQueries({ queryKey: ["contractSessions"] });
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      }
    };

    const onMessageSent = (msg: ChatMessageNewEvent) => {
      const queryKey = ["messages", msg.conversationId];

      queryClient.setQueryData<ApiMessage[]>(queryKey, (old) => {
        if (!old) return undefined;
        let replaced = false;
        const updated = old.map((m) => {
          if (
            msg.clientMessageId &&
            (m.clientMessageId === msg.clientMessageId ||
              String(m.id) === `optimistic-${msg.clientMessageId}`)
          ) {
            replaced = true;
            return msg;
          }
          return m;
        });
        if (!replaced && !old.some((m) => m.id === msg.id)) {
          return [...old, msg];
        }
        return updated;
      });
    };

    const onMessagesStatus = (event: ChatMessagesStatusEvent) => {
      const queryKey = ["messages", event.conversationId];

      queryClient.setQueryData<ApiMessage[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map((m) => {
          const update = event.updates.find((u) => u.messageId === m.id);
          if (!update) return m;
          return {
            ...m,
            status: update.status,
            deliveredAt: update.deliveredAt ?? m.deliveredAt,
            readAt: update.readAt ?? m.readAt,
          };
        });
      });
    };

    const onPresenceOnline = (event: ChatPresenceOnlineEvent) => {
      queryClient.setQueryData<ApiConversation[]>(
        ["conversations"],
        (old) => {
          if (!old) return old;
          return old.map((conv) => ({
            ...conv,
            participants: conv.participants.map((p) =>
              p.user.id === event.userId
                ? { ...p, user: { ...p.user, is_online: true } }
                : p
            ),
          }));
        }
      );
    };

    const onPresenceOffline = (event: ChatPresenceOfflineEvent) => {
      queryClient.setQueryData<ApiConversation[]>(
        ["conversations"],
        (old) => {
          if (!old) return old;
          return old.map((conv) => ({
            ...conv,
            participants: conv.participants.map((p) =>
              p.user.id === event.userId
                ? {
                    ...p,
                    user: {
                      ...p.user,
                      is_online: false,
                      last_seen: event.lastSeen,
                    },
                  }
                : p
            ),
          }));
        }
      );
    };

    const onMessageDeleted = (event: ChatMessageDeletedEvent) => {
      const queryKey = ["messages", event.conversationId];
      queryClient.setQueryData<ApiMessage[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map((m) =>
          m.id === event.id ? { ...m, deletedAt: event.deletedAt } : m
        );
      });
    };

    const onMessageEdited = (msg: ApiMessage) => {
      const queryKey = ["messages", msg.conversationId];
      queryClient.setQueryData<ApiMessage[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map((m) => (m.id === msg.id ? msg : m));
      });
    };

    const onConnect = () => {
      joinedConversationsRef.current.clear();
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      
      // Overwrite notifications cache on socket reconnect
      syncNotifications();
      
      // If we already have conversations in cache, join them immediately.
      // Otherwise, the separate useEffect will catch them when they load.
      const cached = queryClient.getQueryData<ApiConversation[]>(["conversations"]);
      if (cached && socket.connected) {
        cached.forEach((conv) => {
          if (!joinedConversationsRef.current.has(conv.id)) {
            socket.emit("chat:join", { conversationId: conv.id });
            joinedConversationsRef.current.add(conv.id);
          }
        });
      }
    };

    socket.on("chat:message:new", onNewMessage);
    socket.on("chat:message:sent", onMessageSent);
    socket.on("chat:messages:status", onMessagesStatus);
    socket.on("chat:presence:online", onPresenceOnline);
    socket.on("chat:presence:offline", onPresenceOffline);
    socket.on("chat:message:deleted", onMessageDeleted);
    socket.on("chat:message:edited", onMessageEdited);
    socket.on("connect", onConnect);

    // Notifications
    socket.on("notification:new", handleNewNotification); 
    socket.on("chat:notification:new", handleNewNotification); 
    socket.on("contract:notification:new", handleNewNotification);
    socket.on("chat:message:new", handleNewNotification);

    return () => {
      socket.off("chat:message:new", onNewMessage);
      socket.off("chat:message:sent", onMessageSent);
      socket.off("chat:messages:status", onMessagesStatus);
      socket.off("chat:presence:online", onPresenceOnline);
      socket.off("chat:presence:offline", onPresenceOffline);
      socket.off("chat:message:deleted", onMessageDeleted);
      socket.off("chat:message:edited", onMessageEdited);
      socket.off("connect", onConnect);

      socket.off("notification:new", handleNewNotification);
      socket.off("chat:notification:new", handleNewNotification);
      socket.off("contract:notification:new", handleNewNotification);
      socket.off("chat:message:new", handleNewNotification);

      disconnectSocket();
      socketRef.current = null;
    };
  }, [currentUserId, queryClient, emitDelivered]);
}
