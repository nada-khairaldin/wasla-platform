import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authServices } from "@/src/features/auth/services/authService";
import { ChangePasswordFormData } from "@/src/features/auth/schemas/authSchema";
import { useAuthActions } from "@/src/features/auth/store/useAuthStore";
import toast from "react-hot-toast";

export interface UseChangePasswordOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export const useChangePassword = (options?: UseChangePasswordOptions) => {
  const queryClient = useQueryClient();
  const { logout } = useAuthActions();

  return useMutation({
    mutationFn: async (data: ChangePasswordFormData) => {
      const { error, data: resData } = await authServices.changePassword({
        currentPassword: data.oldPassword,
        newPassword: data.password,
      });
      
      if (error) throw new Error(error);
      return resData;
    },
    onSuccess: (data) => {
      // 1. Show success toast message
      toast.success("تم تغيير كلمة المرور بنجاح. يرجى تسجيل الدخول مرة أخرى باستخدام كلمة المرور الجديدة.", {
        duration: 4000,
      });
      
      // 2. Clear React Query Cache
      queryClient.clear();
      
      // 3. Delay logout to allow user to read the message (approx 1.5s)
      setTimeout(() => {
        // Logout method clears token, state, and redirects to /login
        logout();
      }, 1500);

      options?.onSuccess?.(data);
    },
    onError: (err: Error) => {
      // Show error toast with API message
      toast.error(err.message || "حدث خطأ أثناء تغيير كلمة المرور");
      options?.onError?.(err);
    },
  });
};
