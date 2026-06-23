import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services/chatService";
import type { ApiConversation } from "../chat.types";

/**
 * Mutation to create a new conversation (or reuse existing) for a post or a direct conversation.
 * Returns the conversation so the caller can navigate to it.
 */
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: number | { recipientId: number }): Promise<ApiConversation> => {
      if (typeof args === "number") {
        const { data, error } = await chatService.createConversation(args);
        if (error) throw new Error(error);
        return data!.conversation;
      } else {
        const { data, error } = await chatService.createDirectConversation(args.recipientId);
        if (error) throw new Error(error);
        return data!.conversation;
      }
    },
    onSuccess: () => {
      // Refresh conversations list
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
