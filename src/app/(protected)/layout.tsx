"use client";
import { useState, useEffect } from "react";
import AppNavbar from "../../components/layout/ProtectedAppNavbar";
import Footer from "../../components/layout/Footer";
import UserBootstrap from "@/src/features/auth/components/UserBootstrap";
import { useGlobalSocket } from "@/src/features/messages/hooks";
import { usePathname } from "next/navigation";
import { useReviewGate } from "@/src/features/reviews/hooks/useReviewGate";
import { RatingModal } from "@/src/features/reviews/components/RatingModal";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatPage = pathname.startsWith("/messages");

  // Connect Socket.IO at the app level — user is "online" on any authenticated page
  useGlobalSocket();

  // Centralized Review Gate hooks
  const { shouldShow, eligibleExchange, currentUserId, reviewResolved } = useReviewGate();

  // Controlled modal open state (initialized to false)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  // Sync state strictly with shouldShow from the gate to avoid duplicate reopen loops
  useEffect(() => {
    if (!reviewResolved) return;
    setTimeout(() => {
      setIsRatingModalOpen(shouldShow);
    }, 0);
  }, [shouldShow, reviewResolved]);

  return (
    <div className="flex flex-col min-h-screen">
      <UserBootstrap />
      <AppNavbar />
      <main className="flex-grow relative">{children}</main>
      {!isChatPage && <Footer />}

      {/* Controlled RatingModal global overlay */}
      {reviewResolved && isRatingModalOpen && eligibleExchange && currentUserId && (
        <RatingModal
          open={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          contract={eligibleExchange}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}
