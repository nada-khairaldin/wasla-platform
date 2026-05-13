export interface User {
  id: string;
  email: string;
  Username: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

