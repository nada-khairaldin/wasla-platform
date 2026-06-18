import { useQuery } from "@tanstack/react-query";
import { skillsService } from "../services/skillsService";

export const useSkills = (category?: "TECHNICAL" | "GENERAL") => {
  return useQuery({
    queryKey: ["skills", category],
    queryFn: async () => {
      const { data, error } = await skillsService.getSkills(category);
      if (error) throw new Error(error);
      return data?.skills || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};
