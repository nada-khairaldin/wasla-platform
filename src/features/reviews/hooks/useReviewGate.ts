import { useState, useEffect, useCallback } from "react";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { useUserExchanges } from "@/src/features/profile/hooks/useUserExchanges";
import { Exchange } from "@/src/features/profile/services/profileServices";

export interface ReviewGateEngineParams {
  exchanges: Exchange[] | undefined;
  userId: number | undefined;
  reviewedCache: Set<number>;
}

export interface ReviewGateResult {
  shouldShow: boolean;
  eligibleExchange: Exchange | null;
}

// Memory cache mirrored in module scope to prevent re-triggering across layout mounts
const memoryCache = new Set<number>();

/**
 * Deterministic Review Gate Engine (Pure Business Logic)
 */
export function shouldShowReviewModal({
  exchanges,
  userId,
  reviewedCache,
}: ReviewGateEngineParams): ReviewGateResult {
  if (!exchanges || !userId) {
    return { shouldShow: false, eligibleExchange: null };
  }

  const eligible = exchanges.find((ex) => {
    // The modal must ONLY appear if: Exchange status is COMPLETED
    if (ex.status !== "COMPLETED") return false;

    // Check memory/local storage cache
    if (reviewedCache.has(ex.id) || reviewedCache.has(Number(ex.id))) {
      return false;
    }

    // Check if user has already reviewed via the reviews array (backend data)
    const alreadyReviewedInBackend = ex.reviews?.some((r) => {
      const rRecord = r as unknown as Record<string, unknown>;
      const reviewerObj = rRecord.reviewer as Record<string, unknown> | undefined;
      const rId = rRecord.reviewerId || reviewerObj?.id || (typeof rRecord.reviewer === "number" ? rRecord.reviewer : undefined);
      return Number(rId) === userId;
    });

    return !alreadyReviewedInBackend;
  });

  return {
    shouldShow: !!eligible,
    eligibleExchange: eligible || null,
  };
}

/**
 * useReviewGate React Hook (Centralized State Coordinator)
 */
export function useReviewGate() {
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const currentUserId = currentUser?.user?.userId ? Number(currentUser.user.userId) : undefined;
  const { data: userExchanges, isLoading: isExchangesLoading } = useUserExchanges();

  const [localCache, setLocalCache] = useState<Set<number>>(() => new Set(memoryCache));
  
  // 1. Introduce "Review Resolution Phase"
  const [reviewResolved, setReviewResolved] = useState(false);

  // 3. Resolve review state BEFORE any render decision
  useEffect(() => {
    if (isExchangesLoading || isUserLoading) return;

    if (currentUserId) {
      const cacheKey = `reviewed_exchanges_${currentUserId}`;
      try {
        const cachedString = localStorage.getItem(cacheKey);
        if (cachedString) {
          const cachedArray = JSON.parse(cachedString);
          if (Array.isArray(cachedArray)) {
            setTimeout(() => {
              setLocalCache((prev) => {
                const newCache = new Set<number>(prev);
                cachedArray.forEach((id) => {
                  newCache.add(Number(id));
                  memoryCache.add(Number(id));
                });
                return newCache;
              });
            }, 0);
          }
        }
      } catch (e) {
        console.error("Failed to load reviewed cache from localStorage:", e);
      }
    }

    setTimeout(() => {
      setReviewResolved(true);
    }, 0);
  }, [isExchangesLoading, isUserLoading, currentUserId]);

  // Expose function to mark an exchange as reviewed
  const markAsReviewed = useCallback((exchangeId: number) => {
    if (!currentUserId) return;

    const cacheKey = `reviewed_exchanges_${currentUserId}`;
    memoryCache.add(exchangeId);
    
    setLocalCache((prev) => {
      const next = new Set(prev);
      next.add(exchangeId);
      
      try {
        localStorage.setItem(cacheKey, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error("Failed to save reviewed cache to localStorage:", e);
      }
      
      return next;
    });
  }, [currentUserId]);

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

  // 4. ONLY AFTER resolution: compute modal visibility
  const { shouldShow, eligibleExchange } = reviewResolved
    ? shouldShowReviewModal({
        exchanges: userExchanges,
        userId: currentUserId,
        reviewedCache: localCache,
      })
    : { shouldShow: false, eligibleExchange: null };

  return {
    shouldShow,
    eligibleExchange,
    markAsReviewed,
    currentUserId,
    reviewResolved,
  };
}
