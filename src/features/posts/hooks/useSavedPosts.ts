import { useQuery } from "@tanstack/react-query";
import { postServices } from "../services/postService";


export const useSavedPosts = () => {
  return useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      const { data, error } = await postServices.getSavedPosts();
      if (error) {
        throw new Error(error);
      }
      return data?.savedPosts ?? [];
    },
  });
};
