import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { getSocket, disconnectSocket } from "../services/socketService";
import { useConversations } from "./useConversations";
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
