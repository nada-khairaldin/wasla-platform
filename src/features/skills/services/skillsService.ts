import { apiRequest } from "@/src/services/api";
import { SkillsResponse, CreateSkillPayload, CreateSkillResponse } from "../types";

export const skillsService = {
  getSkills: (category?: "TECHNICAL" | "GENERAL") => {
    return apiRequest<SkillsResponse>({
      method: "GET",
      url: "/skills",
      payload: category ? { category } : undefined,
    });
  },

  createSkill: (payload: CreateSkillPayload) => {
    return apiRequest<CreateSkillResponse>({
      method: "POST",
      url: "/skills",
      payload: payload,
    });
  },
};
