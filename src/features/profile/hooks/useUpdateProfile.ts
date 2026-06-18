import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileServices, BasicProfileResponse } from "../services/profileServices";
import { skillsService } from "@/src/features/skills/services/skillsService";
import { UserProfile } from "@/src/types";

export interface UpdateProfilePayload {
  name: string;
  bio: string;
  servicesNeeded: string[];
  servicesOffered: string[];
}

export interface UseUpdateProfileOptions {
  onSuccess?: (data: BasicProfileResponse) => void;
  onError?: (error: Error) => void;
}

export const useUpdateProfile = (
  userId: number | undefined,
  options?: UseUpdateProfileOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      if (!userId) throw new Error("لم يتم العثور على معرّف المستخدم");
      const backendPayload = {
        name: payload.name,
        bio: payload.bio,
        offeredSkills: payload.servicesOffered,
        requiredSkills: payload.servicesNeeded,
      };
      const { data, error } = await profileServices.updateUserProfile(userId, backendPayload);
      if (error) throw new Error(error);

      // Register custom skills sequentially after successful profile update
      try {
        const { data: skillsData } = await skillsService.getSkills();
        const existingSkills = skillsData?.skills || [];
        const existingNamesLower = existingSkills.map((s) => s.name.toLowerCase());

        const allUniqueSelected = Array.from(
          new Set([...payload.servicesOffered, ...payload.servicesNeeded])
        );

        for (const skillName of allUniqueSelected) {
          if (!existingNamesLower.includes(skillName.toLowerCase())) {
            await skillsService.createSkill({ name: skillName, category: "GENERAL" });
          }
        }
      } catch (err) {
        console.error("Failed to register custom skills in catalog:", err);
      }

      return data;
    },
    onSuccess: (data, variables) => {
      if (userId) {
        queryClient.setQueryData<UserProfile>(["userProfile", userId], (oldData) => {
          if (!oldData?.profile) return oldData;
          return {
            ...oldData,
            profile: {
              ...oldData.profile,
              name: data?.profile?.name ?? oldData.profile.name,
              bio: data?.profile?.bio ?? oldData.profile.bio,
              offeredSkills: variables.servicesOffered,
              requiredSkills: variables.servicesNeeded,
            },
          };
        });
      }
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      if (data) {
        options?.onSuccess?.(data);
      }
    },
    onError: (err: Error) => {
      options?.onError?.(err);
    },
  });
};
