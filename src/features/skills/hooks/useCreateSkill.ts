import { useMutation, useQueryClient } from "@tanstack/react-query";
import { skillsService } from "../services/skillsService";
import { CreateSkillPayload } from "../types";

export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSkillPayload) => {
      const { data, error } = await skillsService.createSkill(payload);
      if (error) throw new Error(error);
      return data?.skill;
    },
    onSuccess: () => {
      // Invalidate skills cache
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
};
