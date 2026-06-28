"use client";
import AppNavbar from "../../components/layout/ProtectedAppNavbar";
import Footer from "../../components/layout/Footer";
import UserBootstrap from "@/src/features/auth/components/UserBootstrap";
import { useGlobalSocket } from "@/src/features/messages/hooks";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { useUserExchanges } from "@/src/features/profile/hooks/useUserExchanges";
import { RatingModal } from "@/src/features/reviews/components/RatingModal";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatPage = pathname.startsWith("/messages");

  // Connect Socket.IO at the app level — user is "online" on any authenticated page
  useGlobalSocket();

  // Query current user and user exchanges to check for contracts that need reviews
  const { data: currentUser } = useCurrentUser();
  const currentUserId = currentUser?.user?.userId ? Number(currentUser.user.userId) : undefined;
  const { data: userExchanges, isLoading: isExchangesLoading } = useUserExchanges();

  // Find the first completed/disputed contract that this user hasn't rated yet
  const eligibleContract = !isExchangesLoading && currentUserId && userExchanges
    ? userExchanges.find((ex) => {
        const isCompleted = ex.status === "COMPLETED";
        const isDisputed = ex.status === "DISPUTED";
        
        // Allowed if COMPLETED, or if DISPUTED with escrow status RELEASED or REFUNDED
        const isEligibleStatus = isCompleted || (isDisputed && (ex.escrowStatus === "RELEASED" || ex.escrowStatus === "REFUNDED"));
        
        if (!isEligibleStatus) return false;

        // Check localStorage first as a local cache of reviewed contract IDs
        let localReviewedIds: (string | number)[] = [];
        try {
          if (typeof window !== "undefined") {
            localReviewedIds = JSON.parse(localStorage.getItem("reviewed_contract_ids") || "[]");
          }
        } catch (e) {
          console.error("Error reading reviewed_contract_ids from localStorage:", e);
        }

        if (localReviewedIds.includes(ex.id) || localReviewedIds.includes(Number(ex.id)) || localReviewedIds.includes(String(ex.id))) {
          return false;
        }

        // Check if the current user has already submitted a review for this contract via API reviews relation
        const exRecord = ex as unknown as Record<string, unknown>;
        const hasRated = 
          !!exRecord.isReviewed || 
          !!exRecord.reviewed || 
          !!exRecord.userReviewed || 
          ex.reviews?.some((r) => {
            const rRecord = r as unknown as Record<string, unknown>;
            const reviewerObj = rRecord.reviewer as Record<string, unknown> | undefined;
            const rId = rRecord.reviewerId || reviewerObj?.id || (typeof rRecord.reviewer === "number" ? rRecord.reviewer : undefined);
            return Number(rId) === currentUserId;
          });

        return !hasRated;
      })
    : undefined;

  return (
    <div className="flex flex-col min-h-screen">
      <UserBootstrap />
      <AppNavbar />
      <main className="flex-grow relative">{children}</main>
      {!isChatPage && <Footer />}

      {/* Render the blocking RatingModal globally if there is an unrated eligible contract */}
      {eligibleContract && currentUserId && (
        <RatingModal
          contract={eligibleContract}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}
