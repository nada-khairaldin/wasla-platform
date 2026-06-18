"use client";
import { useRouter } from "next/navigation";
import { ArrowRight, Star, MessageSquare, ChevronDown, Loader2 } from "lucide-react";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { useUserReviews } from "@/src/features/profile/hooks/useUserReviews";
import { getInitials } from "@/src/utils";
import { Skeleton } from "@/src/components/ui/Skeleton";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-secondary-500 text-secondary-500" : "fill-neutral-200 text-neutral-200"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const router = useRouter();
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const userId = currentUser?.user?.userId ? Number(currentUser.user.userId) : undefined;

  const {
    data,
    isLoading: isReviewsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useUserReviews(userId as number);

  const displayReviews = data?.pages.flatMap((page) => page?.reviews || []) ?? [];

  // Calculate average rating and total counts
  const totalReviews = displayReviews.length;
  const averageRating = totalReviews > 0
    ? (displayReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  const isLoading = (isUserLoading || isReviewsLoading) && displayReviews.length === 0 && !error;

  return (
    <div className="min-h-screen bg-neutral-50 px-4 md:px-8 lg:px-16 py-8" dir="rtl">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        
        {/* Header Block */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/my-profile")}
            className="w-10 h-10 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-primary-500 hover:bg-neutral-50 hover:shadow-sm transition-all"
            title="رجوع للملف الشخصي"
          >
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">آراء وتقييمات الأعضاء</h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">التقييمات التي حصلت عليها من خلال تقديم الخدمات للمجتمع</p>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex flex-col gap-6">
            {/* Rating Summary Card Skeleton */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-around gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-12 w-16 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-3 w-28 rounded" />
              </div>
              <div className="h-px sm:h-16 w-16 sm:w-px bg-neutral-100"></div>
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-10 w-12 rounded" />
                <Skeleton className="h-3 w-36 rounded" />
              </div>
            </div>

            {/* List of Reviews Skeleton */}
            <div className="flex flex-col gap-4 mt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-neutral-100 p-5 sm:p-6 shadow-sm flex flex-col gap-3">
                  {/* Header: Reviewer Info, Rating, Date */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                      <div className="text-right flex flex-col gap-1.5 w-32">
                        <Skeleton className="h-3.5 w-3/4 rounded" />
                        <Skeleton className="h-2.5 w-1/2 rounded" />
                        <Skeleton className="h-3 w-20 rounded mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-20 rounded shrink-0" />
                  </div>
                  {/* Review text */}
                  <div className="space-y-2 mt-1">
                    <Skeleton className="h-3.5 w-full rounded" />
                    <Skeleton className="h-3.5 w-5/6 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-neutral-100 rounded-2xl text-center w-full">
            <p className="text-error-600 font-bold mb-2">عذراً، فشل تحميل التقييمات</p>
            <p className="text-neutral-400 text-sm">يرجى المحاولة مرة أخرى لاحقاً.</p>
          </div>
        ) : displayReviews.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white border border-neutral-100 rounded-2xl w-full mt-4">
            <div className="p-4 bg-neutral-50 rounded-full text-neutral-400 mb-4">
              <MessageSquare size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 mb-1">لا توجد تقييمات بعد</h3>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              لم تحصل على أي تقييمات بعد. قدّم خدمات متميزة لأعضاء المنصة لتبدأ في بناء سمعتك هنا.
            </p>
          </div>
        ) : (
          <>
            {/* Rating Summary Card */}
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-around gap-6 text-center">
              <div>
                <p className="text-5xl font-black text-primary-500">{averageRating}</p>
                <div className="flex justify-center mt-2">
                  <StarRating rating={Math.round(Number(averageRating))} />
                </div>
                <p className="text-xs text-neutral-400 mt-2">متوسط التقييم العام</p>
              </div>
              <div className="h-px sm:h-16 w-16 sm:w-px bg-neutral-100"></div>
              <div>
                <p className="text-4xl font-bold text-neutral-800">{totalReviews}</p>
                <p className="text-xs text-neutral-400 mt-2">إجمالي التقييمات المستلمة</p>
              </div>
            </div>

            {/* List of Reviews */}
            <div className="flex flex-col gap-4 mt-2">
              {displayReviews.map((review) => {
                const initials = getInitials(review.reviewer?.name || review.reviewer?.username || "م");
                  
                const formattedDate = new Date(review.createdAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                return (
                  <div key={review.id} className="bg-white rounded-2xl border border-neutral-100 p-5 sm:p-6 shadow-sm flex flex-col gap-3">
                    {/* Header: Reviewer Info, Rating, Date */}
                    <div className="flex items-center justify-between gap-3">
                      {/* Right side: Avatar, Name/Username, and Rating */}
                      <div className="flex items-center gap-3">
                        {review.reviewer?.profilePicture ? (
                          <img
                            src={review.reviewer?.profilePicture}
                            alt={review.reviewer?.name || "صورة المقيم"}
                            className="w-10 h-10 rounded-full object-cover border border-neutral-100 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {initials}
                          </div>
                        )}
                        <div className="text-right flex flex-col">
                          <span className="text-xs sm:text-sm font-bold text-neutral-850 block">
                            {review.reviewer?.name || "مستخدم وصلة"}
                          </span>
                          <span className="text-[10px] sm:text-xs text-neutral-400 mt-1 block">
                            @{review.reviewer?.username || "user"}
                          </span>
                          <div className="mt-3">
                            <StarRating rating={review.rating} />
                          </div>
                        </div>
                      </div>

                      {/* Left side: Date */}
                      <span className="text-[11px] sm:text-xs text-neutral-400 shrink-0">{formattedDate}</span>
                    </div>

                    {/* Review text */}
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pr-0 text-right mt-1">
                      &quot;{review.comment}&quot;
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="mt-4 py-3 px-6 bg-white border border-neutral-100 hover:bg-neutral-50 active:scale-98 rounded-xl text-sm font-bold text-primary-500 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {isFetchingNextPage ? (
                  <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
                ) : (
                  <>
                    <span>تحميل المزيد من التقييمات</span>
                    <ChevronDown size={16} />
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
