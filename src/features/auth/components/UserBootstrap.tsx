"use client";

import { useEffect } from "react";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { PendingReviewContract } from "../types";
import { useAuthStore } from "../store/useAuthStore";

export default function UserBootstrap() {
  const { data: currentUser } = useCurrentUser();
  const setPendingReviewContracts = useAuthStore(
    (state) => state.actions.setPendingReviewContracts,
  );

  useEffect(() => {
    if (!currentUser) return;

    const pending = (
      currentUser as typeof currentUser & {
        pendingReviewContracts?: PendingReviewContract[];
      }
    ).pendingReviewContracts;

    if (pending && pending.length > 0) {
      setPendingReviewContracts(pending);
    }
  }, [currentUser, setPendingReviewContracts]);

  return null;
}