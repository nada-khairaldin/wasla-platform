import { Exchange } from "@/src/features/profile/services/profileServices";

export interface UserLogin {
  id: string;
  email: string;
  username: string;
}

export interface PendingReviewContract {
  id: number;
  postId: number;
  postTitle: string;
  status: Exchange["status"];
  completedAt: string;
  role: "requester" | "provider";
  reviewee: {
    id: number;
    username: string;
    name: string;
    profilePicture: string | null;
  };
}

export interface AuthResponse {
  user: UserLogin;
  accessToken: string;
  pendingReviewContracts?: PendingReviewContract[];
}

export interface RefreshAuthResponse {
  accessToken: string;
  pendingReviewContracts?: PendingReviewContract[];
}

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
