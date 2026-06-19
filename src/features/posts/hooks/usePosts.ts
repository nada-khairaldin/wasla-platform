import { useQuery } from "@tanstack/react-query";
import { postServices } from "../services/postService";


export const usePosts = (userId?: number) => {
  return useQuery({
    queryKey: ["posts", "feed", userId],
    queryFn: async () => {
      const { data, error } = await postServices.getFeed(userId);
      if (error) {
        throw new Error(error);
      }
      return {
        posts: data?.posts ?? [],
        source: data?.source ?? "fallback",
      };
    },
  });
};
