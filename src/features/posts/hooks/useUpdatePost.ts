import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postServices } from "../services/postService";
import { UpdatePostRequest } from "../type";

interface UpdatePostParams {
  postId: number;
  postData: UpdatePostRequest;
}


export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, postData }: UpdatePostParams) => {
      const { data, error } = await postServices.updatePost(postId, postData);
      if (error) {
        throw new Error(error);
      }
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.postId] });
    },
  });
};
