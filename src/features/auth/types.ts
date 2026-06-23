export interface UserLogin {
  id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  user: UserLogin;
  accessToken: string;
}

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

