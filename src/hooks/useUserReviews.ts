import { useInfiniteQuery } from "@tanstack/react-query";
import { userServices } from "../services/userServices";

export const useUserReviews = (userId: number, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["userReviews", userId, limit],
    queryFn: async ({ pageParam }) => {
      const { data, error } = await userServices.getUserReviews(userId, pageParam as number, limit);
      if (error) {
        throw new Error(error);
      }
      return data;
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    enabled: !!userId,
  });
};
