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
  serviceExchangeId?: number;
}

export interface ReviewsResponse {
  reviews: ApiReview[];
  nextCursor: number | null;
}

export interface Review {
  id: string;
  reviewerId?: number;
  reviewerName: string;
  reviewerInitial: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface SubmitReviewPayload {
  serviceExchangeId: number;
  rating: number; // 1-5
  comment?: string;
}
