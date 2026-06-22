import { useMutation, useQueryClient } from "@tanstack/react-query";
import { skillsService } from "../services/skillsService";
import { CreateSkillPayload } from "../types";

import { Skill } from "../types";

export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSkillPayload) => {
      try {
        const { data, error } = await skillsService.createSkill(payload);
        if (error) throw new Error(error);
        return data?.skill as Skill;
      } catch (err) {
        // Fallback for unauthorized/unauthenticated users (e.g. during registration)
        console.warn("Optimistic skill creation fallback", err);
        return {
          id: Date.now(),
          name: payload.name,
          category: payload.category,
          isApproved: false,
        } as Skill;
      }
    },
    onSuccess: (newSkill) => {
      // Optimistically update the skills cache
      queryClient.setQueryData<Skill[]>(["skills"], (old) => {
        if (!old) return [newSkill];
        if (old.some((s) => s.name === newSkill.name)) return old;
        return [...old, newSkill];
      });
    },
  });
};
