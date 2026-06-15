import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { chatService } from "../services/chatService";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { transformToPersonFolders } from "../utils/transformConversations";
import type { PersonFolder, ApiConversation } from "../chat.types";

/**
 * Fetches all conversations and transforms them into PersonFolder[] for the UI.
 * Also exposes the raw conversations for lookups.
 */
export function useConversations() {
  const { data: currentUser } = useCurrentUser();
  const userId = Number(currentUser?.user?.userId);

  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data, error } = await chatService.getConversations();
      if (error) throw new Error(error);
      return data!.conversations;
    },
    enabled: !!userId,
    staleTime: 1000 * 10, // 10 seconds
    refetchInterval: 1000 * 120, // Fallback polling every 120s (2 minutes)
  });

  const personFolders: PersonFolder[] = useMemo(() => {
    return query.data && userId
      ? transformToPersonFolders(query.data, userId)
      : [];
  }, [query.data, userId]);

  return {
    ...query,
    personFolders,
    conversations: query.data as ApiConversation[] | undefined,
  };
}
