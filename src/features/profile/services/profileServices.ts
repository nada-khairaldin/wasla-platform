import { apiRequest } from "@/src/services/api";
import { UserProfile } from "@/src/types";

export interface BasicProfileResponse {
  profile: {
    name: string;
    bio: string;
    profilePicture?: string;
  };
}


export interface ApiReview {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    id: number;
    username: string;
    name: string;
    profilePicture: string;
  };
}

export interface ReviewsResponse {
  reviews: ApiReview[];
  nextCursor: number | null;
}

export interface Exchange {
  id: number;
  postId: number;
  requesterId: number;
  providerId: number;
  duration: number;
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "WAITING_CONFIRMATION" | "COMPLETED" | "CANCELED" | "REJECTED" | "DISPUTED";
  escrowStatus: string;
  acceptedAt: string | null;
  deliveredAt: string | null;
  completedAt: string | null;
  canceledAt: string | null;
  createdAt: string;
  updatedAt: string;
  requester: {
    id: number;
    username: string;
    full_name: string;
    profile_image: string;
  };
  provider: {
    id: number;
    username: string;
    full_name: string;
    profile_image: string;
  };
  post: {
    id: number;
    title: string;
    category: "OFFER" | "REQUEST";
    service_mode: "ONLINE" | "OFFLINE";
  };
}

export interface ExchangesResponse {
  data: Exchange[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface WalletTransaction {
  transactionId: string;
  amount: number;
  type: "earned" | "spent" | "credit" | "debit";
  counterparty: {
    id: string;
    name: string;
  } | null;
  relatedServiceOrRequest: {
    id: string;
    title: string;
  } | null;
  status: "completed" | "pending" | "cancelled";
  timestamp: string;
}

export interface WalletHistoryResponse {
  success: boolean;
  metadata: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  data: WalletTransaction[];
}

export const profileServices = {
  getUserProfile: (userId: number) => {
    return apiRequest<UserProfile>({
      method: "GET",
      url: `/users/${userId}/profile`,
    });
  },

  updateUserProfile: (
    userId: number,
    payload: {
      name: string;
      bio: string;
      profilePicture?: string;
      offeredSkills?: string[];
      requiredSkills?: string[];
    },
  ) => {
    return apiRequest<BasicProfileResponse>({
      method: "PUT",
      url: `/users/profile`,
      payload: payload,
    });
  },

  getUserReviews: (userId: number, cursor?: number, limit = 20) => {
    return apiRequest<ReviewsResponse>({
      method: "GET",
      url: `/users/${userId}/reviews`,
      payload: { cursor, limit },
    });
  },

  getUserExchanges: (params?: { status?: string; role?: string }) => {
    return apiRequest<ExchangesResponse>({
      method: "GET",
      url: "/exchanges",
      payload: params,
    });
  },

  getWalletHistory: (params?: { page?: number; limit?: number; type?: string; status?: string }) => {
    return apiRequest<WalletHistoryResponse>({
      method: "GET",
      url: "/api/v1/wallet/history",
      payload: params,
    });
  },

  deleteAccount: (password: string) => {
    return apiRequest<void>({
      method: "DELETE",
      url: "/users/account",
      payload: { password },
    });
  },
};
