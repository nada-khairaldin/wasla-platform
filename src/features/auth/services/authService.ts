import { apiRequest } from "@/src/services/api";
import {
  SignupFormData,
  LoginFormData,
} from "../schemas/authSchema";
import { AuthResponse } from "../types";

export interface ChangePasswordPayload {
  oldPassword?: string;
  newPassword?: string;
}

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

  forgotPassword: (email: string) => {
    return apiRequest<void, { email: string }>({
      method: "POST",
      url: "/auth/forget-password",
      payload: { email },
    });
  },

  getCurrentUser: () => {
    return apiRequest({
      method: "GET",
      url: "/me",
    });
  },

  changePassword: (passwordData: ChangePasswordPayload) => {
    return apiRequest<void, ChangePasswordPayload>({
      method: "POST",
      url: "/auth/change-password",
      payload: passwordData,
    });
  },

  logout: () => {
    return apiRequest<void, void>({
      method: "POST",
      url: "/auth/logout",
    });
  },
};
