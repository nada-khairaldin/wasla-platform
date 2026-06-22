import { apiRequest } from "@/src/services/api";
import {
  SkillsResponse,
  CreateSkillPayload,
  CreateSkillResponse,
  GetSkillsPayload,
} from "../types";

export const skillsService = {
  getSkills: (payload?: GetSkillsPayload) => {
    return apiRequest<SkillsResponse>({
      method: "GET",
      url: "/skills",
      payload,
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
