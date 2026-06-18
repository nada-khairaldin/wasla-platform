import { useMutation } from "@tanstack/react-query";
import { profileServices } from "../services/profileServices";
import { useAuthActions } from "@/src/features/auth/store/useAuthStore";
import { authServices } from "../../auth/services/authService";

export const useDeleteAccount = () => {
  const { logout } = useAuthActions();

  return useMutation({
    mutationFn: async (password: string) => {
      const { data, error } = await profileServices.deleteAccount(password);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: async () => {
      try {
        await authServices.logout();
      } catch (err) {
        console.error("Logout during deletion failed:", err);
      } finally {
        logout();
      }
    },
  });
};
