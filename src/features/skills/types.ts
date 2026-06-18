export interface Skill {
  id: number;
  name: string;
  category: "TECHNICAL" | "GENERAL";
  isApproved: boolean;
}

export interface SkillsResponse {
  skills: Skill[];
}

export interface CreateSkillPayload {
  name: string;
  category: "TECHNICAL" | "GENERAL";
}

export interface CreateSkillResponse {
  skill: Skill;
}
