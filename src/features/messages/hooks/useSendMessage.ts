import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services/chatService";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import type { ApiMessage } from "../chat.types";
import toast from "react-hot-toast";

/**
 * Helper to generate standard UUID v4 on the client side.
 */
export function generateUUID(): string {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  // Fallback UUID v4 generator
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Mutation to send a message in a conversation.
 * Uses optimistic updates so the message appears instantly in the UI
 * before the server responds, with automatic error handling.
 */
export function useSendMessage() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  return useMutation({
    networkMode: "always",
    mutationFn: async ({
      conversationId,
      body,
      clientMessageId,
    }: {
      conversationId: string | number;
      body: string;
      clientMessageId: string;
    }) => {
      // If client-side and offline, throw immediately to trigger onError
      if (typeof window !== "undefined" && !navigator.onLine) {
        throw new Error("لا يوجد اتصال بالإنترنت");
      }
      
      const { data, error } = await chatService.sendMessage(
        String(conversationId),
        body,
        clientMessageId
      );
      if (error) throw new Error(error);
      return data;
    },

    // ── Optimistic update: show the message BEFORE the server responds ──
    onMutate: async (variables) => {
      const queryKey = ["messages", String(variables.conversationId)];

      // 1. Cancel any in-flight refetches so they don't overwrite our optimistic data
      await queryClient.cancelQueries({ queryKey });

      // 2. Snapshot the current cache so we can roll back if needed
      const previousMessages = queryClient.getQueryData<ApiMessage[]>(queryKey);

      // 3. Build a temporary optimistic message that matches ApiMessage shape
      const optimisticMessage: ApiMessage = {
        id: `optimistic-${variables.clientMessageId}`,
        clientMessageId: variables.clientMessageId,
        conversationId: String(variables.conversationId),
        senderId: Number(currentUser?.user?.userId),
        sender: {
          id: Number(currentUser?.user?.userId),
          username: "",
        },
        body: variables.body,
        createdAt: new Date().toISOString(),
        deliveredAt: null,
        readAt: null,
        editedAt: null,
        deletedAt: null,
        readBy: [],
        status: "SENT",
      };

      // 4. Append the optimistic message to the cache
      queryClient.setQueryData<ApiMessage[]>(queryKey, (old) =>
        old ? [...old, optimisticMessage] : [optimisticMessage]
      );

      // Return the snapshot so onError can use it if needed
      return { previousMessages, queryKey };
    },

    // ── Handle failure (offline, server error, etc.) ──
    onError: (error, variables, _context) => {
      const queryKey = ["messages", String(variables.conversationId)];

      // Find the optimistic message and mark it as failed by renaming its ID prefix to 'failed-'
      queryClient.setQueryData<ApiMessage[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map((m) => {
          if (
            (String(m.id).startsWith("optimistic-") || m.clientMessageId === variables.clientMessageId) &&
            m.body === variables.body
          ) {
            return {
              ...m,
              id: `failed-${variables.clientMessageId}`,
            };
          }
          return m;
        });
      });

      // Notify the user of the error
      toast.error("فشل إرسال الرسالة. يرجى التحقق من اتصال الإنترنت.");
    },

    // ── Reconcile after successful server response ──
    onSuccess: (_data, variables) => {
      const queryKey = ["messages", String(variables.conversationId)];

      // Refetch messages to replace the optimistic entry with real server data
      queryClient.invalidateQueries({ queryKey });

      // Also refresh conversations list (updates lastMessage preview)
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}


