import { useMutation } from "@tanstack/react-query";
import { authServices } from "../services/authService";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authServices.requestPasswordReset(email),
  });
};
