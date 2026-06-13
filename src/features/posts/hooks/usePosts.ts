import { useQuery } from "@tanstack/react-query";
import { postServices } from "../services/postService";


export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await postServices.getPosts();
      if (error) {
        throw new Error(error);
      }
      return data?.posts ?? [];
    },
  });
};
