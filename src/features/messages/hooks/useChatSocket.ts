import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { getSocket } from "../services/socketService";
import type { ApiMessage } from "../chat.types";

/**
 * Page-level hook: manages chat room join/leave.
 *
 * When the user opens a specific conversation:
 * - Emits `chat:join` to join the conversation room
 * - Emits `chat:messages:delivered` for any undelivered messages in cache
 * - Emits `chat:leave` when switching away or leaving the page
 *
 * This hook assumes the socket is already connected by `useGlobalSocket`
 * at the app layout level.
 */
export function useChatSocket(activeConversationId: string | null) {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const currentUserId = Number(currentUser?.user?.userId);
  const joinedRoomRef = useRef<string | null>(null);

  useEffect(() => {
    if (!currentUserId || !activeConversationId) {
      // If no active conversation, leave any previously joined room
      if (joinedRoomRef.current) {
        try {
          const socket = getSocket();
          socket.emit("chat:leave", { conversationId: joinedRoomRef.current });
        } catch {
          // Socket not available
        }
        joinedRoomRef.current = null;
      }
      return;
    }

    let socket;
    try {
      socket = getSocket();
    } catch {
      return;
    }

    if (!socket.connected) return;

    const previousRoom = joinedRoomRef.current;

    // Leave previous room if different
    if (previousRoom && previousRoom !== activeConversationId) {
      socket.emit("chat:leave", { conversationId: previousRoom });
    }

    // Join new room
    if (activeConversationId !== previousRoom) {
      socket.emit("chat:join", { conversationId: activeConversationId });
      joinedRoomRef.current = activeConversationId;

      // Acknowledge delivery for any unread messages already in cache
      const cachedMessages = queryClient.getQueryData<ApiMessage[]>([
        "messages",
        activeConversationId,
      ]);
      if (cachedMessages) {
        const undelivered = cachedMessages
          .filter(
            (m) =>
              m.senderId !== currentUserId &&
              (m.status === "SENT" || m.status === "DELIVERED")
          )
          .map((m) => m.id)
          // Filter out optimistic/failed messages
          .filter((id) => !id.startsWith("optimistic-") && !id.startsWith("failed-"));

        if (undelivered.length > 0) {
          socket.emit("chat:messages:read", {
            conversationId: activeConversationId,
            messageIds: undelivered,
          });
        }
      }
    }

    // Cleanup: leave room on unmount
    return () => {
      if (joinedRoomRef.current) {
        try {
          const s = getSocket();
          s.emit("chat:leave", { conversationId: joinedRoomRef.current });
        } catch {
          // Socket may be gone
        }
        joinedRoomRef.current = null;
      }
    };
  }, [activeConversationId, currentUserId, queryClient]);
}
