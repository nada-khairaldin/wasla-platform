import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../services/reviewService";
import { SubmitReviewPayload } from "../types";

export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitReviewPayload) => {
      return reviewService.submitReview(payload);
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh user profile data, stats, and reviews list
      queryClient.invalidateQueries({ queryKey: ["userReviews"] });
      queryClient.invalidateQueries({ queryKey: ["userExchanges"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["contractDetails"] });
    },
  });
};
