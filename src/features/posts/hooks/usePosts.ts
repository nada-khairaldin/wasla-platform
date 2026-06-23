import { useInfiniteQuery } from "@tanstack/react-query";
import { postServices } from "../services/postService";
import { Post } from "../type";

interface PostsPageData {
  recommendedPosts: Post[];
  regularPosts: Post[];
  recommenderUnavailable: boolean;
  nextCursor: string | number | null;
}

export const usePosts = (userId?: number) => {
  return useInfiniteQuery<PostsPageData>({
    queryKey: ["posts_and_feed", userId],
    queryFn: async ({ pageParam }) => {
      const cursor = pageParam as string | number | undefined;
      
      const getRegularPosts = async (): Promise<{ posts: Post[]; nextCursor?: string | number | null }> => {
        const response = await postServices.getPosts(cursor);
        if (response.error) {
          if (response.status === 401) {
            return { posts: [] };
          }
          throw new Error(response.error);
        }
        return { posts: response.data?.posts ?? [], nextCursor: response.data?.nextCursor };
      };

      if (userId == null) {
        const regularData = await getRegularPosts();
        return {
          recommendedPosts: [] as Post[],
          regularPosts: regularData.posts,
          recommenderUnavailable: false,
          nextCursor: regularData.nextCursor ?? null,
        };
      }

      const [regularResponse, feedResponse] = await Promise.allSettled([
        getRegularPosts(),
        postServices.getFeed(userId, cursor),
      ]);

      if (regularResponse.status === "rejected") {
        throw new Error(regularResponse.reason?.message || "Failed to fetch regular posts");
      }

      const regularData = regularResponse.value;
      const regularPosts = regularData.posts;
      let recommendedPosts: Post[] = [];
      let recommenderUnavailable = true;
      let nextCursor = regularData.nextCursor ?? null;

      if (feedResponse.status === "fulfilled") {
        if (feedResponse.value.error) {
          if (feedResponse.value.status === 401) {
            // Ignore 401 error silently for feed
          }
        } else {
          const data = feedResponse.value.data;
          if (typeof data?.source === "string" && data.source.toLowerCase() === "recommender") {
            recommendedPosts = data.posts ?? [];
            recommenderUnavailable = false;
            if (data.nextCursor) {
              nextCursor = data.nextCursor;
            }
          } else if (data?.source === "fallback") {
            recommenderUnavailable = true;
          }
        }
      }

      // Filter out recommended posts from regular posts
      const recommendedPostIds = new Set(recommendedPosts.map(p => p.id));
      const filteredRegularPosts = regularPosts.filter(p => !recommendedPostIds.has(p.id));

      return {
        recommendedPosts,
        regularPosts: filteredRegularPosts,
        recommenderUnavailable,
        nextCursor,
      };
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
};
