import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services/chatService";
import type { ApiMessage } from "../chat.types";
import toast from "react-hot-toast";

/**
 * Mutation to edit a message in a conversation.
 * Updates the cache optimistically before the server confirms.
 */
export function useEditMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messageId,
      conversationId,
      body,
    }: {
      messageId: string;
      conversationId: string;
      body: string;
    }) => {
      const { data, error } = await chatService.editMessage(messageId, body);
      if (error || !data) throw new Error(error || "Failed to edit message");
      return data.message;
    },

    // ── Optimistic update: change message body and editedAt instantly ──
    onMutate: async (variables) => {
      const queryKey = ["messages", String(variables.conversationId)];

      await queryClient.cancelQueries({ queryKey });

      const previousMessages = queryClient.getQueryData<ApiMessage[]>(queryKey);

      queryClient.setQueryData<ApiMessage[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map((m) =>
          m.id === variables.messageId
            ? { ...m, body: variables.body, editedAt: new Date().toISOString() }
            : m
        );
      });

      return { previousMessages, queryKey };
    },

    // ── Rollback on failure ──
    onError: (error, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(context.queryKey, context.previousMessages);
      }
      toast.error("فشل تعديل الرسالة. يرجى المحاولة مرة أخرى.");
    },

    // ── Reconcile and refresh states ──
    onSuccess: (updatedMessage, variables) => {
      const queryKey = ["messages", String(variables.conversationId)];

      queryClient.setQueryData<ApiMessage[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map((m) => (m.id === updatedMessage.id ? updatedMessage : m));
      });

      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
