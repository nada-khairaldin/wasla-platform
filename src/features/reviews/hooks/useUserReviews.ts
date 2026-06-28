import { useInfiniteQuery } from "@tanstack/react-query";
import { reviewService } from "../services/reviewService";

export const useUserReviews = (userId: number, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["userReviews", userId, limit],
    queryFn: async ({ pageParam }) => {
      return reviewService.getUserReviews(userId, pageParam as number, limit);
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    enabled: !!userId,
  });
};
