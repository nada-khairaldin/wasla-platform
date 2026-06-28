import React, { useMemo } from "react";
import { Loader2, MessageSquare, ChevronDown } from "lucide-react";
import { useUserReviews } from "../hooks/useUserReviews";
import { ReviewCard } from "./ReviewCard";
import { mapApiReviewToReview } from "@/src/features/profile/utils/profileMappers";
import { Skeleton } from "@/src/components/ui/Skeleton";

interface ReviewsListProps {
  userId: number;
  limit?: number;
}

export function ReviewsList({ userId, limit = 10 }: ReviewsListProps) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    refetch,
  } = useUserReviews(userId, limit);

  const reviews = useMemo(() => {
    return data?.pages.flatMap((page) => page?.reviews || []).map(mapApiReviewToReview) ?? [];
  }, [data]);

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating > 5 ? r.rating / 2 : r.rating), 0) / totalReviews).toFixed(1)
    : "0.0";

  if (isLoading && totalReviews === 0) {
    return (
      <div className="flex flex-col gap-4 mt-2" dir="rtl">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-neutral-100 p-5 sm:p-6 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="text-right flex flex-col gap-1.5 w-32">
                  <Skeleton className="h-3.5 w-3/4 rounded" />
                  <Skeleton className="h-2.5 w-1/2 rounded" />
                </div>
              </div>
              <Skeleton className="h-3 w-20 rounded shrink-0" />
            </div>
            <div className="space-y-2 mt-1">
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-5/6 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-white border border-neutral-100 rounded-2xl text-center w-full" dir="rtl">
        <p className="text-red-500 font-bold mb-2">عذراً، فشل تحميل التقييمات</p>
        <p className="text-neutral-450 text-sm mb-4">{(error as Error).message || "حدث خطأ غير متوقع"}</p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white border border-neutral-100 rounded-2xl w-full mt-4" dir="rtl">
        <div className="p-4 bg-neutral-50 rounded-full text-neutral-400 mb-4">
          <MessageSquare size={36} strokeWidth={1.5} />
        </div>
        <h3 className="text-base font-bold text-neutral-800 mb-1">لا توجد تقييمات بعد</h3>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-[280px] leading-relaxed">
          لم يتم تلقي أي تقييمات لهذا العضو حتى الآن.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5" dir="rtl">
      {/* Average rating banner */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-[0_2px_12px_rgb(0,0,0,0.02)] flex items-center justify-around gap-6 text-center">
        <div>
          <p className="text-4xl sm:text-5xl font-black text-amber-500">{averageRating}</p>
          <p className="text-[10px] sm:text-xs text-neutral-400 mt-1 font-semibold">متوسط التقييم العام (من 5)</p>
        </div>
        <div className="h-12 w-px bg-neutral-150/60"></div>
        <div>
          <p className="text-3xl sm:text-4xl font-bold text-neutral-800">{totalReviews}</p>
          <p className="text-[10px] sm:text-xs text-neutral-400 mt-1 font-semibold">إجمالي الآراء المستلمة</p>
        </div>
      </div>

      {/* Review List */}
      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="py-3 px-6 bg-white border border-neutral-100 hover:bg-neutral-50 active:scale-98 rounded-xl text-xs sm:text-sm font-bold text-primary-600 flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
        >
          {isFetchingNextPage ? (
            <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
          ) : (
            <>
              <span>تحميل المزيد من التقييمات</span>
              <ChevronDown size={14} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
