import { useQuery } from "@tanstack/react-query";
import { searchPosts } from "../services/search.service";
import { PostsSearchRequest } from "../types/search.types";

export const usePostSearch = (
  payload: PostsSearchRequest,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["search-posts", payload],
    queryFn: ({ signal }) => searchPosts(payload, signal),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
