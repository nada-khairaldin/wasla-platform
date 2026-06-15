import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services/chatService";
import type { ApiConversation } from "../chat.types";

/**
 * Mutation to create a new conversation (or reuse existing) for a post.
 * Returns the conversation so the caller can navigate to it.
 */
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number): Promise<ApiConversation> => {
      const { data, error } = await chatService.createConversation(postId);
      if (error) throw new Error(error);
      return data!.conversation;
    },
    onSuccess: () => {
      // Refresh conversations list
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
