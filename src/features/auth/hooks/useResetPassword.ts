import { useMutation } from "@tanstack/react-query";
import { authServices } from "../services/authService";
import { ResetPasswordPayload } from "../types";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authServices.resetPassword(payload),
  });
};
