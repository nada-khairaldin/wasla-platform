import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services/chatService";
import type { ApiMessage } from "../chat.types";
import toast from "react-hot-toast";

/**
 * Mutation to soft-delete a message in a conversation.
 * Hides the message from the cache optimistically before the server confirms.
 */
export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messageId,
      conversationId,
    }: {
      messageId: string;
      conversationId: string;
    }) => {
      const { data, error } = await chatService.deleteMessage(messageId);
      if (error || !data) throw new Error(error || "Failed to delete message");
      return data.message;
    },

    // ── Optimistic update: hide message instantly by setting deletedAt ──
    onMutate: async (variables) => {
      const queryKey = ["messages", String(variables.conversationId)];

      await queryClient.cancelQueries({ queryKey });

      const previousMessages = queryClient.getQueryData<ApiMessage[]>(queryKey);

      queryClient.setQueryData<ApiMessage[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map((m) =>
          m.id === variables.messageId
            ? { ...m, deletedAt: new Date().toISOString() }
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
      toast.error("فشل حذف الرسالة. يرجى المحاولة مرة أخرى.");
    },

    // ── Reconcile and refresh states ──
    onSuccess: (deletedMessage, variables) => {
      const queryKey = ["messages", String(variables.conversationId)];

      queryClient.setQueryData<ApiMessage[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map((m) => (m.id === deletedMessage.id ? deletedMessage : m));
      });

      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
