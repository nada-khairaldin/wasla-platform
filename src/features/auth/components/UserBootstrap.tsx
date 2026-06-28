"use client";

import { useEffect } from "react";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { useAuthStore } from "../store/useAuthStore";

export default function UserBootstrap() {
  const { data: currentUser } = useCurrentUser();
  const setPendingReviewContracts = useAuthStore((state) => state.actions.setPendingReviewContracts);

  useEffect(() => {
    if (currentUser) {
      const pending = (currentUser as unknown as { pendingReviewContracts?: number[] }).pendingReviewContracts || [];
      const timer = setTimeout(() => {
        setPendingReviewContracts(pending);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentUser, setPendingReviewContracts]);

  return null;
}