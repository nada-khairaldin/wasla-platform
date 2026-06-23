import { useQuery } from "@tanstack/react-query";
import { postServices } from "../services/postService";
import { Post } from "../type";

export const usePosts = (userId?: number) => {
  return useQuery({
    queryKey: ["posts_and_feed", userId],
    queryFn: async () => {
      const getRegularPosts = async (): Promise<Post[]> => {
        const response = await postServices.getPosts();
        if (response.error) throw new Error(response.error);
        return response.data?.posts ?? [];
      };

      if (userId == null) {
        const regularPosts = await getRegularPosts();
        return {
          recommendedPosts: [] as Post[],
          regularPosts,
          recommenderUnavailable: false,
        };
      }

      const [regularResponse, feedResponse] = await Promise.allSettled([
        getRegularPosts(),
        postServices.getFeed(userId),
      ]);

      if (regularResponse.status === "rejected") {
        throw new Error(regularResponse.reason?.message || "Failed to fetch regular posts");
      }

      const regularPosts = regularResponse.value;
      let recommendedPosts: Post[] = [];
      let recommenderUnavailable = true;

      if (feedResponse.status === "fulfilled" && !feedResponse.value.error) {
        const data = feedResponse.value.data;
        if (typeof data?.source === "string" && data.source.toLowerCase() === "recommender") {
          recommendedPosts = data.posts ?? [];
          recommenderUnavailable = false;
        } else if (data?.source === "fallback") {
          recommenderUnavailable = true;
        }
      }

      // Filter out recommended posts from regular posts
      const recommendedPostIds = new Set(recommendedPosts.map(p => p.id));
      const filteredRegularPosts = regularPosts.filter(p => !recommendedPostIds.has(p.id));

      return {
        recommendedPosts,
        regularPosts: filteredRegularPosts,
        recommenderUnavailable,
      };
    },
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
};
