import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { postServices } from "../services/postService";
import { Post } from "../type";

interface PostsPageData {
  recommendedPosts: Post[];
  regularPosts: Post[];
  recommenderUnavailable: boolean;
  nextCursor: string | number | null;
}

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const { error } = await postServices.deletePost(postId);
      if (error) {
        throw new Error(error);
      }
    },
    onSuccess: (_data, postId) => {
      queryClient.setQueryData<Post[]>(["myPosts"], (old) =>
        old ? old.filter((post) => post.id !== postId) : old,
      );

      queryClient.setQueriesData<InfiniteData<PostsPageData>>(
        { queryKey: ["posts_and_feed"] },
        (old) => {
          if (!old?.pages.length) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              recommendedPosts: page.recommendedPosts.filter(
                (post) => post.id !== postId,
              ),
              regularPosts: page.regularPosts.filter(
                (post) => post.id !== postId,
              ),
            })),
          };
        },
      );

      queryClient.removeQueries({ queryKey: ["post", postId] });
    },
  });
};
