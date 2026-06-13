import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postServices } from "../services/postService";


export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const { error } = await postServices.deletePost(postId);
      if (error) {
        throw new Error(error);
      }
    },
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      queryClient.removeQueries({ queryKey: ["post", postId] });
    },
  });
};
