import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { postServices } from "../services/postService";
import { CreatePostRequest, Post } from "../type";

interface PostsPageData {
  recommendedPosts: Post[];
  regularPosts: Post[];
  recommenderUnavailable: boolean;
  nextCursor: string | number | null;
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: CreatePostRequest) => {
      const { data, error } = await postServices.createPost(postData);
      if (error) {
        throw new Error(error);
      }
      return data;
    },
    onSuccess: (data) => {
      const newPost = data?.post;
      if (!newPost) return;

      queryClient.setQueryData<Post[]>(["myPosts"], (old) => {
        if (!old) return [newPost];
        if (old.some((post) => post.id === newPost.id)) return old;
        return [newPost, ...old];
      });

      if (newPost.status !== "PUBLISHED") return;

      queryClient.setQueriesData<InfiniteData<PostsPageData>>(
        { queryKey: ["posts_and_feed"] },
        (old) => {
          if (!old?.pages.length) return old;

          const [firstPage, ...restPages] = old.pages;
          if (firstPage.regularPosts.some((post) => post.id === newPost.id)) {
            return old;
          }

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                regularPosts: [newPost, ...firstPage.regularPosts],
              },
              ...restPages,
            ],
          };
        },
      );
    },
  });
};
