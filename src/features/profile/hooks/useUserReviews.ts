import { useInfiniteQuery } from "@tanstack/react-query";
import { profileServices } from "../services/profileServices";

export const useUserReviews = (userId: number, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["userReviews", userId, limit],
    queryFn: async ({ pageParam }) => {
      const { data, error } = await profileServices.getUserReviews(userId, pageParam as number, limit);
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
