import { apiRequest } from "@/src/services/api";
import {
  SignupFormData,
  LoginFormData,
} from "../schemas/authSchema";
import { AuthResponse, ResetPasswordPayload, ChangePasswordPayload } from "../types";

export const authServices = {
  signup: (userData: SignupFormData) => {
    const { confirmPassword, ...payload } = userData;

    return apiRequest<AuthResponse, Omit<SignupFormData, "confirmPassword">>({
      method: "POST",
      url: "/auth/register",
      payload: payload,
    });
  },

  login: (userData: LoginFormData) => {
    return apiRequest<AuthResponse, LoginFormData>({
      method: "POST",
      url: "/auth/login",
      payload: userData,
    });
  },

  requestPasswordReset: (email: string) => {
    return apiRequest<void, { email: string }>({
      method: "POST",
      url: "/auth/forget-password",
      payload: { email },
    });
  },

  resetPassword: (payload: ResetPasswordPayload) => {
    return apiRequest<void, ResetPasswordPayload>({
      method: "POST",
      url: "/auth/reset-password",
      payload,
    });
  },

  getCurrentUser: () => {
    return apiRequest({
      method: "GET",
      url: "/me",
    });
  },

  changePassword: (payload: ChangePasswordPayload) => {
    return apiRequest<void, ChangePasswordPayload>({
      method: "POST",
      url: "/auth/change-password",
      payload,
    });
  },

  logout: () => {
    return apiRequest<void, void>({
      method: "POST",
      url: "/auth/logout",
    });
  },
};
