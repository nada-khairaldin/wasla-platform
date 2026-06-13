import { useQuery } from "@tanstack/react-query";
import { userServices } from "../services/userServices";

export const useUserProfile = (userId:  number | undefined) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const { data, error } = await userServices.getUserProfile(userId!);
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: true, 
    enabled: !!userId,
  });
};