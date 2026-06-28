import { useInfiniteQuery } from "@tanstack/react-query";
import { profileServices } from "../services/profileServices";

export const useInfiniteUserExchanges = (params?: { status?: string; role?: string }) => {
  return useInfiniteQuery({
    queryKey: ["userExchanges", "infinite", params],
    queryFn: async ({ pageParam = 1 }) => {
      const { data, error } = await profileServices.getUserExchanges({
        ...params,
        page: pageParam,
        limit: 20,
      });
      if (error) throw new Error(error);
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.meta) return undefined;
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};
