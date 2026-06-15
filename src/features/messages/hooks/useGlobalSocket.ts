import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { getSocket, disconnectSocket } from "../services/socketService";
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

/**
 * App-level hook: connects Socket.IO when the user is authenticated.
 * This makes the user appear "online" across the entire site — not just the chat page.
 *
 * Responsibilities:
 * - Connect/disconnect socket based on auth
 * - Listen for presence events (online/offline) and update conversations cache
 * - Listen for new messages and emit `chat:messages:delivered` (user is online)
 * - Listen for status updates and sync React Query cache
 *
 * Mount this in the protected layout so it runs on every authenticated page.
 */
export function useGlobalSocket() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const currentUserId = Number(currentUser?.user?.userId);
  const socketRef = useRef<Socket | null>(null);
  const joinedConversationsRef = useRef<Set<string>>(new Set());

  // ── Helper: emit delivered ack for messages from others ──
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

  useEffect(() => {
    if (!currentUserId) return;

    let socket: Socket;
    try {
      socket = getSocket();
    } catch {
      return;
    }

    socketRef.current = socket;

    // ─── chat:message:new — new message from another user ───
    const onNewMessage = (msg: ChatMessageNewEvent) => {
      const queryKey = ["messages", msg.conversationId];

      queryClient.setQueryData<ApiMessage[]>(queryKey, (old) => {
        if (!old) return undefined; // Don't create cache for unopened conversations
        const exists = old.some(
          (m) =>
            m.id === msg.id ||
            (msg.clientMessageId && m.clientMessageId === msg.clientMessageId)
        );
        if (exists) return old;
        return [...old, msg];
      });

      // User is online → acknowledge delivery immediately
      if (msg.senderId !== currentUserId) {
        emitDelivered(msg.conversationId, [msg.id]);
      }

      // Refresh conversations sidebar (lastMessage, unreadCount)
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    // ─── chat:message:sent — server confirms our optimistic message ───
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

    // ─── chat:messages:status — batch status updates (DELIVERED/READ) ───
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

    // ─── chat:presence:online ───
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

    // ─── chat:presence:offline ───
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

    // ─── chat:message:deleted ───
    const onMessageDeleted = (event: ChatMessageDeletedEvent) => {
      const queryKey = ["messages", event.conversationId];
      queryClient.setQueryData<ApiMessage[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map((m) =>
          m.id === event.id ? { ...m, deletedAt: event.deletedAt } : m
        );
      });
    };

    // ─── chat:message:edited ───
    const onMessageEdited = (msg: ApiMessage) => {
      const queryKey = ["messages", msg.conversationId];
      queryClient.setQueryData<ApiMessage[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map((m) => (m.id === msg.id ? msg : m));
      });
    };

    // ─── Helper: join all conversation rooms ───
    const joinAllConversations = () => {
      const conversations = queryClient.getQueryData<ApiConversation[]>(["conversations"]);
      if (conversations && socket.connected) {
        conversations.forEach((conv) => {
          if (!joinedConversationsRef.current.has(conv.id)) {
            socket.emit("chat:join", { conversationId: conv.id });
            joinedConversationsRef.current.add(conv.id);
          }
        });
      }
    };

    // ─── On connect/reconnect, join all rooms and refresh data ───
    const onConnect = () => {
      // Reset joined rooms tracking (server forgot them after disconnect)
      joinedConversationsRef.current.clear();
      // Refresh conversations first, then join rooms
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      // Join rooms with current cache data (will be updated after invalidation)
      joinAllConversations();
    };

    // ─── Register all listeners ───
    socket.on("chat:message:new", onNewMessage);
    socket.on("chat:message:sent", onMessageSent);
    socket.on("chat:messages:status", onMessagesStatus);
    socket.on("chat:presence:online", onPresenceOnline);
    socket.on("chat:presence:offline", onPresenceOffline);
    socket.on("chat:message:deleted", onMessageDeleted);
    socket.on("chat:message:edited", onMessageEdited);
    socket.on("connect", onConnect);

    return () => {
      socket.off("chat:message:new", onNewMessage);
      socket.off("chat:message:sent", onMessageSent);
      socket.off("chat:messages:status", onMessagesStatus);
      socket.off("chat:presence:online", onPresenceOnline);
      socket.off("chat:presence:offline", onPresenceOffline);
      socket.off("chat:message:deleted", onMessageDeleted);
      socket.off("chat:message:edited", onMessageEdited);
      socket.off("connect", onConnect);
      disconnectSocket();
      socketRef.current = null;
    };
  }, [currentUserId, queryClient, emitDelivered]);
}
