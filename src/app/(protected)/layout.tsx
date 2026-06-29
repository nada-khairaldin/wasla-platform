"use client";
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

  const { shouldShow, eligibleExchange, currentUserId } = useReviewGate();

  return (
    <div className="flex flex-col min-h-screen">
      <UserBootstrap />
      <AppNavbar />
      <main className="flex-grow relative">{children}</main>
      {!isChatPage && <Footer />}

      {shouldShow && eligibleExchange && currentUserId && (
        <RatingModal
          key={eligibleExchange.id}
          open
          contract={eligibleExchange}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}
