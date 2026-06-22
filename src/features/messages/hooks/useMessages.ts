import { useMemo, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services/chatService";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { transformMessages } from "../utils/transformConversations";
import type { Message, ApiConversation } from "../chat.types";

/**
 * Fetches messages for a specific conversation and transforms them into UI Message[].
 */
export function useMessages(
  conversationId: string | number | null,
  isOtherUserOnline?: boolean
) {
  const { data: currentUser } = useCurrentUser();
  const userId = Number(currentUser?.user?.userId);
  const queryClient = useQueryClient();
  const markedReadRef = useRef<Set<string>>(new Set());

  const query = useQuery({
    queryKey: ["messages", conversationId ? String(conversationId) : null],
    queryFn: async () => {
      if (!conversationId) return [];
      const { data, error } = await chatService.getMessages(String(conversationId));
      if (error) throw new Error(error);
      return data!.messages;
    },
    enabled: !!conversationId && !!userId,
    staleTime: 1000 * 5, // 5 seconds
    refetchInterval: 1000 * 60, // Fallback polling every 60s (Socket.IO handles real-time updates)
  });

  // Automatically mark unread messages from the other party as read
  useEffect(() => {
    if (!query.data || !userId || !conversationId) return;

    // CRITICAL UX: Immediately reset conversation.unreadCount to 0 (optimistic)
    // Opening a chat = all messages are considered READ
    queryClient.setQueryData<ApiConversation[]>(["conversations"], (old) => {
      if (!old) return old;
      return old.map((conv) =>
        conv.id === String(conversationId)
          ? { ...conv, unreadCount: 0 }
          : conv
      );
    });

    // Find messages sent by the other user that the current user hasn't read yet
    const unreadMessages = query.data.filter(
      (m) =>
        m.senderId !== userId &&
        (!m.readBy || !m.readBy.some((r) => r.userId === userId))
    );

    if (unreadMessages.length === 0) return;

    // Filter out messages that are already in-flight or already marked
    const messagesToMark = unreadMessages.filter(
      (m) => !markedReadRef.current.has(m.id)
    );

    if (messagesToMark.length === 0) return;

    // Mark them as being processed
    messagesToMark.forEach((m) => markedReadRef.current.add(m.id));

    // Send read receipt API requests
    Promise.all(
      messagesToMark.map(async (m) => {
        try {
          await chatService.markAsRead(m.id);
        } catch (err) {
          markedReadRef.current.delete(m.id);
        }
      })
    ).then(() => {
      // Invalidate queries to update status and unread badges
      queryClient.invalidateQueries({
        queryKey: ["messages", String(conversationId)],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    });
  }, [query.data, userId, conversationId, queryClient]);

  const messages: Message[] = useMemo(() => {
    return query.data && userId
      ? transformMessages(query.data, userId, isOtherUserOnline)
      : [];
  }, [query.data, userId, isOtherUserOnline]);

  return {
    ...query,
    messages,
  };
}

