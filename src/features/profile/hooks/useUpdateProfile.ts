import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileServices, BasicProfileResponse } from "../services/profileServices";
import { UserProfile } from "@/src/types";

export interface UpdateProfilePayload {
  name: string;
  bio: string;
  requiredSkills: string[];
  offeredSkills: string[];
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
        offeredSkills: payload.offeredSkills,
        requiredSkills: payload.requiredSkills,
      };
      const { data, error } = await profileServices.updateUserProfile(userId, backendPayload);
      if (error) throw new Error(error);

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
              offeredSkills: variables.offeredSkills,
              requiredSkills: variables.requiredSkills,
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
