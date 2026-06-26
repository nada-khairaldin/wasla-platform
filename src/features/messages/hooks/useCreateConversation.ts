import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services/chatService";
import type { ApiConversation } from "../chat.types";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";

/**
 * Mutation to create a new conversation (or reuse existing) for a post or a direct conversation.
 * Returns the conversation so the caller can navigate to it.
 */
export function useCreateConversation() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  return useMutation({
    mutationFn: async (args: { postId: number; postOwnerId: number } | { recipientId: number }): Promise<ApiConversation> => {
      const currentUserId = currentUser?.user?.userId;
      
      const targetUserId = 'recipientId' in args ? args.recipientId : args.postOwnerId;
      if (currentUserId !== undefined && Number(targetUserId) === Number(currentUserId)) {
        throw new Error("لا يمكنك مراسلة نفسك.");
      }

      if ('postId' in args) {
        const { data, error } = await chatService.createConversation(args.postId);
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
