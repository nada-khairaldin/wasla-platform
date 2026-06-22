import { useQuery } from "@tanstack/react-query";
import { postServices } from "../services/postService";


export const usePosts = (userId?: number) => {
  return useQuery({
    queryKey: ["feed", userId],
    queryFn: async () => {
      if (userId == null) {
        return {
          posts: [],
          source: "fallback" as const,
          recommenderUnavailable: false,
        };
      }

      const getFallbackFeed = async () => {
        const fallbackResponse = await postServices.getPosts();
        if (fallbackResponse.error) {
          throw new Error(fallbackResponse.error);
        }
        return fallbackResponse.data?.posts ?? [];
      };

      const { data, error } = await postServices.getFeed(userId);

      if (error) {
        const fallbackPosts = await getFallbackFeed();
        return {
          posts: fallbackPosts,
          source: "fallback" as const,
          recommenderUnavailable: true,
        };
      }

      const feedSource =
        typeof data?.source === "string" && data.source.toLowerCase() === "recommender"
          ? "recommender"
          : "fallback";

      if (feedSource === "fallback") {
        const fallbackPosts = await getFallbackFeed();
        return {
          posts: fallbackPosts,
          source: "fallback" as const,
          recommenderUnavailable: true,
        };
      }

      return {
        posts: data?.posts ?? [],
        source: "recommender" as const,
        recommenderUnavailable: false,
      };
    },
    enabled: userId != null,
    staleTime: 60_000,
  });
};
