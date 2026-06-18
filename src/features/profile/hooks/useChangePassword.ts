import { useMutation } from "@tanstack/react-query";
import { authServices } from "@/src/features/auth/services/authService";
import { ChangePasswordFormData } from "@/src/features/auth/schemas/authSchema";

export interface UseChangePasswordOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export const useChangePassword = (options?: UseChangePasswordOptions) => {
  return useMutation({
    mutationFn: async (data: ChangePasswordFormData) => {
      const { error, data: resData } = await authServices.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.password,
      });
      if (error) throw new Error(error);
      return resData;
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (err: Error) => {
      options?.onError?.(err);
    },
  });
};
