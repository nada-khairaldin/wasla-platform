import { UserProfile } from "../types";
import { apiRequest } from "./api";

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

export const userServices = {
  getUserProfile: (userId: number) => {
    return apiRequest<UserProfile>({
      method: "GET",
      url: `/users/${userId}/profile`,
    });
  },

  getUserReviews: (userId: number, cursor?: number, limit = 20) => {
    return apiRequest<ReviewsResponse>({
      method: "GET",
      url: `/users/${userId}/reviews`,
      payload: { cursor, limit },
    });
  },

  updateUserProfile: (
    userId: number,
    payload: {
      name: string;
      bio: string;
      servicesNeeded: string[];
      servicesOffered: string[];
    },
  ) => {
    return apiRequest<UserProfile>({
      method: "PUT",
      url: `/users/${userId}/profile`,
      payload: payload,
    });
  },
};
