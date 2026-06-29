import { useCallback, useEffect, useMemo } from "react";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { useAuthStore } from "@/src/features/auth/store/useAuthStore";
import { PendingReviewContract } from "@/src/features/auth/types";
import { mapPendingReviewContractToExchange } from "../utils/mapPendingReviewContract";

export interface ReviewGateEngineParams {
  pendingReviewContracts: PendingReviewContract[];
}

/**
 * Deterministic Review Gate Engine (Pure Business Logic)
 */
export function shouldShowReviewModal({
  pendingReviewContracts,
}: ReviewGateEngineParams): boolean {
  return pendingReviewContracts.length > 0;
}

/**
 * useReviewGate React Hook (Centralized State Coordinator)
 */
export function useReviewGate() {
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const currentUserId = currentUser?.user?.userId
    ? Number(currentUser.user.userId)
    : undefined;

  const pendingReviewContracts = useAuthStore((state) => state.pendingReviewContracts);
  const setPendingReviewContracts = useAuthStore(
    (state) => state.actions.setPendingReviewContracts,
  );

  const currentPendingContract =
    pendingReviewContracts.length > 0 ? pendingReviewContracts[0] : null;

  const eligibleExchange = useMemo(() => {
    if (!currentPendingContract || !currentUserId || !currentUser?.user) {
      return null;
    }

    return mapPendingReviewContractToExchange(currentPendingContract, {
      userId: currentUserId,
      username: currentUser.user.username,
      full_name: currentUser.user.full_name,
    });
  }, [currentPendingContract, currentUser, currentUserId]);

  const shouldShow =
    !isUserLoading &&
    pendingReviewContracts.length > 0 &&
    !!currentUserId &&
    !!eligibleExchange;

  const markAsReviewed = useCallback(
    (contractId: number) => {
      setPendingReviewContracts((prev) =>
        prev.filter((contract) => contract.id !== contractId),
      );
    },
    [setPendingReviewContracts],
  );

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

  return {
    shouldShow,
    eligibleExchange,
    currentPendingContract,
    markAsReviewed,
    currentUserId,
  };
}
