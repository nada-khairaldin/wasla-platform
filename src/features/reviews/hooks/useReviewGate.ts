import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { useAuthStore } from "@/src/features/auth/store/useAuthStore";
import { contractService } from "@/src/features/contracts/api/contractService";

export interface ReviewGateEngineParams {
  pendingReviewContracts: number[];
}

/**
 * Deterministic Review Gate Engine (Pure Business Logic)
 */
export function shouldShowReviewModal({
  pendingReviewContracts,
}: ReviewGateEngineParams): boolean {
  return pendingReviewContracts && pendingReviewContracts.length > 0;
}

/**
 * useReviewGate React Hook (Centralized State Coordinator)
 */
export function useReviewGate() {
  const { data: currentUser } = useCurrentUser();
  const currentUserId = currentUser?.user?.userId ? Number(currentUser.user.userId) : undefined;

  const pendingReviewContracts = useAuthStore((state) => state.pendingReviewContracts);
  const setPendingReviewContracts = useAuthStore((state) => state.actions.setPendingReviewContracts);

  const firstContractId = pendingReviewContracts && pendingReviewContracts.length > 0 ? pendingReviewContracts[0] : undefined;

  // Query details for the first contract in the queue
  const { data: contractData, isLoading: isContractLoading } = useQuery({
    queryKey: ["reviewContractDetails", firstContractId],
    queryFn: () => contractService.getContractById(firstContractId!),
    enabled: !!firstContractId,
    staleTime: 0,
  });

  const eligibleExchange = contractData?.exchange || null;
  const shouldShow = pendingReviewContracts.length > 0 && !!eligibleExchange;

  const markAsReviewed = useCallback((exchangeId: number) => {
    setPendingReviewContracts((prev) => prev.filter((id) => id !== exchangeId));
  }, [setPendingReviewContracts]);

  // Listen to the window "review-submitted" custom event for instant reaction
  useEffect(() => {
    const handleReviewSubmitted = (e: Event) => {
      const customEvent = e as CustomEvent<{ contractId: number }>;
      if (customEvent.detail?.contractId) {
        markAsReviewed(customEvent.detail.contractId);
      }
    };
    window.addEventListener("review-submitted", handleReviewSubmitted);
    return () => {
      window.removeEventListener("review-submitted", handleReviewSubmitted);
    };
  }, [markAsReviewed]);

  const reviewResolved = !firstContractId || !isContractLoading;

  return {
    shouldShow,
    eligibleExchange,
    markAsReviewed,
    currentUserId,
    reviewResolved,
  };
}
