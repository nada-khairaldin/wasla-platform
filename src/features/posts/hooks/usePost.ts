import { useQuery } from "@tanstack/react-query";
import { postServices } from "../services/postService";


export const usePost = (postId: number) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data, error } = await postServices.getPostById(postId);
      if (error) {
        throw new Error(error);
      }
      return data?.post ?? null;
    },
    enabled: !!postId,
  });
};
