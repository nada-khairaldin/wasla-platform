import { useConversations } from "./useConversations";

/**
 * Checks if a conversation already exists for a given postId.
 * Returns the conversationId if found, or null.
 */
export function useConversationForPost(postId: number | undefined) {
  const { conversations, isLoading } = useConversations();

  const existingConversation = postId
    ? conversations?.find((c) => c.postId === postId)
    : undefined;

  return {
    conversationId: existingConversation?.id ?? null,
    hasConversation: !!existingConversation,
    isLoading,
  };
}
