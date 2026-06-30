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
    const { data, error, status } = await apiRequest<
      { review: ApiReview },
      SubmitReviewPayload
    >({
      method: "POST",
      url: "/reviews",
      payload,
    });

    if (error) {
      switch (status) {
        case 409:
          throw new Error("لقد قمت بتقييم هذا العقد مسبقاً");

        case 404:
          throw new Error("العقد غير موجود");

        case 403:
          throw new Error("غير مصرح لك بإجراء هذا التقييم");

        case 401:
          throw new Error("يجب تسجيل الدخول من جديد");

        case 400: {
          const backendMessage = (error as any)?.errors?.[0]?.message;

          throw new Error(backendMessage || "البيانات المدخلة غير صحيحة");
        }

        default:
          throw new Error("حدث خطأ غير متوقع");
      }
    }

    return data;
  },
};
