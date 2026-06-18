import { useQuery } from "@tanstack/react-query";
import { profileServices } from "../services/profileServices";

export const useUserProfile = (userId: number | undefined) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const { data, error } = await profileServices.getUserProfile(userId!);
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    enabled: !!userId,
  });
};
