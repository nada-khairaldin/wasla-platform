import { useQuery } from "@tanstack/react-query";
import { skillsService } from "../services/skillsService";

export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await skillsService.getSkills();
      if (error) throw new Error(error);
      return data?.skills || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};
