"use client";

import React, { useMemo } from "react";
import UserProfileHeader from "./components/UserProfileHeader";
import SkillsSection from "./components/SkillsSection";
import PublicStatsSection from "./components/PublicStatsSection";
import PublicReviewsSection from "./components/PublicReviewsSection";
import RecentContracts from "@/src/features/profile/components/RecentContracts";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { useUserProfile } from "@/src/features/profile/hooks/useUserProfile";
import { useUserReviews } from "@/src/features/reviews/hooks";
import { mapProfileRecentExchangeToContract, mapApiReviewToReview } from "@/src/features/profile/utils/profileMappers";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";

interface UserProfilePageProps {
  userId: number;
}

export default function UserProfilePage({ userId }: UserProfilePageProps) {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const isCurrentUser = currentUser?.user?.userId === userId;

  React.useEffect(() => {
    if (isCurrentUser) {
      router.replace('/my-profile');
    }
  }, [isCurrentUser, router]);
  
  const { data: userProfile, isLoading: isProfileLoading, isError: isProfileError } = useUserProfile(userId);
  const { 
    data: reviewsData, 
    isLoading: isReviewsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useUserReviews(userId, 5);

  const reviews = useMemo(() => {
    return reviewsData?.pages?.flatMap((page) => page?.reviews || []).map(mapApiReviewToReview) ?? [];
  }, [reviewsData]);

  const isLoading = isProfileLoading;

  if (isCurrentUser) return null;

  if (isProfileError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-neutral-800 mb-2">تعذر تحميل الملف الشخصي</h2>
        <p className="text-neutral-500 ">لم نتمكن من العثور على هذا المستخدم، ربما تم حذف الحساب أو الرابط غير صحيح.</p>
        <button 
          onClick={() => router.back()}
          className="mt-6 px-6 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors text-sm font-semibold"
        >
          العودة للسابق
        </button>
      </div>
    );
  }

  const profile = userProfile?.profile;
  const contracts = (profile?.recentExchanges || []).map(mapProfileRecentExchangeToContract);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 flex flex-col lg:flex-row gap-4 sm:gap-5" dir="rtl">
        
        {/* Right Side (Main Content) */}
        <div className="flex-1 flex flex-col gap-4 sm:gap-5">
          {/* Header */}
          <div className="w-full">
            {isLoading ? (
              <div className="rounded-2xl bg-white border border-neutral-100 p-4 sm:p-6 flex items-start gap-4 h-[140px]">
                <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shrink-0" />
                <div className="flex-1 flex flex-col gap-3">
                  <Skeleton className="h-6 w-1/3 rounded" />
                  <Skeleton className="h-4 w-1/4 rounded" />
                  <Skeleton className="h-4 w-2/3 rounded mt-2" />
                </div>
              </div>
            ) : (
              profile && <UserProfileHeader profile={profile} userId={userId} />
            )}
          </div>

          {/* Stats */}
          <div>
            {isLoading ? (
              <div className="rounded-2xl bg-white border border-neutral-100 p-4 sm:p-6 flex flex-col gap-4">
                <Skeleton className="h-5 w-36 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex-1 p-5 border border-neutral-50 rounded-2xl flex flex-col items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="h-3.5 w-16 rounded" />
                      <Skeleton className="h-6 w-10 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              profile && (
                <PublicStatsSection
                  timeCredits={profile.stats?.availableTimeCredits || 0}
                  servicesProvided={profile.stats?.servicesProvided || 0}
                  servicesReceived={profile.stats?.servicesReceived || 0}
                  rating={profile.trustRating?.average || 0}
                  ratingCount={profile.trustRating?.count || 0}
                />
              )
            )}
          </div>

          {/* Skills */}
          <div>
            {isLoading ? (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 rounded-2xl bg-white border border-neutral-100 p-4 sm:p-6 h-[200px]">
                  <Skeleton className="h-5 w-32 rounded mb-6" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                  </div>
                </div>
                <div className="flex-1 rounded-2xl bg-white border border-neutral-100 p-4 sm:p-6 h-[200px]">
                  <Skeleton className="h-5 w-32 rounded mb-6" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                  </div>
                </div>
              </div>
            ) : (
              profile && (
                <SkillsSection
                  offeredSkills={profile.offeredSkills || []}
                  requiredSkills={profile.requiredSkills || []}
                />
              )
            )}
          </div>
        </div>

        {/* Left Side (Sidebar) */}
        <div className="lg:w-[320px] xl:w-[360px] flex-shrink-0 flex flex-col gap-4 sm:gap-5 min-w-0">
          {/* Recent Contracts */}
          <div className="shrink-0">
            {isLoading ? (
              <div className="rounded-2xl bg-white border border-neutral-100 p-4 sm:p-6 h-[300px]">
                <Skeleton className="h-5 w-40 rounded mb-6" />
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-12 w-full rounded" />
                  <Skeleton className="h-12 w-full rounded" />
                  <Skeleton className="h-12 w-full rounded" />
                </div>
              </div>
            ) : (
              <RecentContracts isPublicView={true} contracts={contracts} />
            )}
          </div>

          {/* Reviews */}
          <div className="flex-1 relative min-h-[400px] lg:min-h-0">
            <div className="lg:absolute lg:inset-0 h-full flex flex-col">
              <PublicReviewsSection
                reviews={reviews}
                isLoading={isReviewsLoading && !reviews.length}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                onLoadMore={() => fetchNextPage()}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
