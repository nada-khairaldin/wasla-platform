import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "../services/search.service";
import { UsersSearchRequest } from "../types/search.types";

export const useUserSearch = (
  payload: UsersSearchRequest,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["search-users", payload],
    queryFn: ({ signal }) => searchUsers(payload, signal),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
