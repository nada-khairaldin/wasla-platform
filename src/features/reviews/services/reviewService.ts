import { apiRequest } from "@/src/services/api";
import { ReviewsResponse, SubmitReviewPayload, ApiReview } from "../types";

export const reviewService = {
  getUserReviews: async (userId: number, cursor?: number, limit = 20) => {
    const { data, error, status } = await apiRequest<ReviewsResponse>({
      method: "GET",
      url: `/users/${userId}/reviews`,
      payload: { cursor, limit },
    });
    if (error) {
      throw new Error(error);
    }
    return data;
  },

  submitReview: async (payload: SubmitReviewPayload) => {
    const { data, error, status } = await apiRequest<{ review: ApiReview }, SubmitReviewPayload>({
      method: "POST",
      url: "/reviews",
      payload,
    });
    if (error) {
      throw new Error(error);
    }
    return data;
  },
};
