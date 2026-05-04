import { apiRequest } from "@/src/services/api";
import {
  SignupFormData,
  LoginFormData,
  ForgotPasswordFormData,
} from "../schemas/authSchema";
import { AuthResponse } from "../types";

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
};
