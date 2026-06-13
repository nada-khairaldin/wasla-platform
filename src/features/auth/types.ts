export interface UserLogin {
  id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  user: UserLogin;
  accessToken: string;
}

