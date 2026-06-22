import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postServices } from "../services/postService";
import { CreatePostRequest } from "../type";


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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
    },
  });
};
