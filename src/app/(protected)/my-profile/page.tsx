"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProfilePage from "@/src/features/profile/components/ProfilePage";
import { ProfileData } from "@/src/features/profile/types";
import { useAuthActions } from "@/src/features/auth/store/useAuthStore";
import { authServices } from "@/src/features/auth/services/authService";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import {
  useUserProfile,
  useUserReviews,
  useWalletHistory,
  useDeleteAccount,
} from "@/src/features/profile/hooks";
import { useSavedPosts, useSaveToggle } from "@/src/features/posts/hooks";
import {
  mapProfileRecentExchangeToContract,
  mapSavedPostToSavedService,
  mapApiReviewToReview,
  mapWalletTransactionToTransaction,
} from "@/src/features/profile/utils/profileMappers";
import DeleteAccountModal from "@/src/features/profile/components/DeleteAccountModal";
import toast from "react-hot-toast";

export default function ProfileRoute() {
  const router = useRouter();
  const { logout } = useAuthActions();

  // Auth & API Queries
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const userId = currentUser?.user?.userId ? Number(currentUser.user.userId) : undefined;

  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile(userId);
  const { data: savedPosts = [], isLoading: isSavedLoading } = useSavedPosts();
  const { data: walletHistory = [], isLoading: isHistoryLoading } = useWalletHistory({ limit: 5 });
  const { data: reviewsData, isLoading: isReviewsLoading } = useUserReviews(userId as number, 5);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteMutation = useDeleteAccount();

  const reviews = useMemo(() => {
    return reviewsData?.pages?.flatMap((page) => page?.reviews || []) ?? [];
  }, [reviewsData]);

  // Unsave post mutation using shared hook
  const saveToggle = useSaveToggle();

  const handleUnsaveService = (id: string) => {
    saveToggle.mutate(
      { postId: Number(id), isSavedBefore: true },
      {
        onSuccess: () => {
          toast.success("تم إزالة الخدمة من المحفوظات");
        },
        onError: (err: Error) => {
          toast.error(err.message || "فشل إزالة الخدمة");
        },
      }
    );
  };

  // Profile data mapper
  const profile: ProfileData | null = useMemo(() => {
    if (!userProfile?.profile) return null;

    const prof = userProfile.profile;

    const stats = {
      rating: prof.trustRating?.average || 0.0,
      servicesReceived: prof.stats?.servicesReceived || 0,
      servicesProvided: prof.stats?.servicesProvided || 0,
    };

    const savedServices = savedPosts.map(mapSavedPostToSavedService);
    const recentContracts = (prof.recentExchanges || []).map(mapProfileRecentExchangeToContract);
    const mappedTransactions = walletHistory.map(mapWalletTransactionToTransaction);
    const hasGift = mappedTransactions.some(t => t.type === "gift" || t.id === "welcome-gift");
    const walletTransactions = [...mappedTransactions];
    if (!hasGift) {
      walletTransactions.push({
        id: "welcome-gift",
        type: "gift" as const,
        description: "هدية ترحيبية: تفعيل الحساب في المنصة",
        hours: 5.0,
        date: "عند التسجيل",
      });
    }
    const mappedReviews = reviews.map(mapApiReviewToReview);

    return {
      name: prof.name || "",
      title: prof.username ? `@${prof.username}` : "",
      bio: prof.bio || "",
      tags: Array.from(
        new Set([
          ...(prof.offeredSkills || []),
          ...(prof.requiredSkills || []),
        ])
      ),
      avatarUrl: prof.profilePicture || undefined,
      timeBalanceHours: prof.stats?.availableTimeCredits || 0,
      stats,
      savedServices,
      reviews: mappedReviews,
      recentContracts,
      walletTransactions,
    };
  }, [userProfile, savedPosts, walletHistory, reviews, userId]);

  const handleEditProfile = () => {
    router.push("/my-profile/edit");
  };

  const handleChangePassword = () => {
    router.push("/my-profile/change-password");
  };

  const handleLogout = async () => {
    try {
      await authServices.logout();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      logout();
    }
  };

  const handleConfirmDelete = async (password: string) => {
    try {
      await deleteMutation.mutateAsync(password);
      toast.success("تم حذف الحساب نهائياً بنجاح");
      setIsDeleteOpen(false);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "حدث خطأ أثناء حذف الحساب");
      throw error;
    }
  };

  const isLoading =
    isUserLoading ||
    isProfileLoading ||
    isSavedLoading ||
    isHistoryLoading ||
    isReviewsLoading;

  return (
    <div className="pb-20 bg-neutral-50">
      <ProfilePage
        profile={profile}
        isLoading={isLoading}
        onEditProfile={handleEditProfile}
        onDeleteAccount={() => setIsDeleteOpen(true)}
        onChangePassword={handleChangePassword}
        onLogout={handleLogout}
        onUnsaveService={handleUnsaveService}
        onViewWalletDetails={() => router.push("/my-profile/wallet")}
        onViewAllContracts={() => router.push("/my-contracts")}
        onViewAllSaved={() => router.push("/my-profile/saved")}
        onViewAllTransactions={() => router.push("/my-profile/wallet")}
        onViewAllReviews={() => router.push("/my-profile/reviews")}
        onContractClick={(id) => router.push(`/my-contracts/${id}`)}
      />

      <DeleteAccountModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
