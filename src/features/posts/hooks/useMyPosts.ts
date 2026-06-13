import { useQuery } from "@tanstack/react-query";
import { postServices } from "../services/postService";


export const useMyPosts = () => {
  return useQuery({
    queryKey: ["myPosts"],
    queryFn: async () => {
      const { data, error } = await postServices.getMyPosts();
      if (error) {
        throw new Error(error);
      }
      return data?.posts ?? [];
    },
  });
};
