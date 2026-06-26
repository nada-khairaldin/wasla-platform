import React from "react";
import { Star, MessageSquare, Loader2 } from "lucide-react";
import { Review } from "@/src/features/profile/types";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { useProfileNavigation } from "@/src/hooks/useProfileNavigation";

interface PublicReviewsSectionProps {
  reviews: Review[];
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 justify-end">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 sm:w-4 sm:h-4 ${i < rating ? "fill-secondary-500 text-secondary-500" : "fill-neutral-200 text-neutral-200"}`}
        />
      ))}
    </div>
  );
}

export default function PublicReviewsSection(props: PublicReviewsSectionProps) {
  const { reviews, isLoading, hasNextPage, isFetchingNextPage, onLoadMore } = props;
  const { navigateToProfile } = useProfileNavigation();

  return (
    <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden flex flex-col h-full" dir="rtl">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-neutral-100">
        <h2 className="text-sm sm:text-base font-bold text-primary-500 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary-500" />
          <span>التقييمات</span>
        </h2>
      </div>

      {/* Scrollable Container */}
      <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 min-h-0 flex flex-col">
        {isLoading ? (
          <div className="flex flex-col gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`flex flex-col pb-5 ${i > 0 ? "pt-5 border-t border-neutral-100/60" : ""}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                  <Skeleton className="h-4 w-16 rounded" />
                </div>
                <Skeleton className="h-3 w-full rounded mt-3" />
                <Skeleton className="h-3 w-2/3 rounded mt-2" />
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="flex flex-col">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className={`flex flex-col pb-5 last:pb-0 ${index > 0 ? "pt-5 border-t border-neutral-100/60" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div 
                    className={`flex items-center gap-2.5 ${review.reviewerId ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
                    onClick={() => {
                      if (review.reviewerId) {
                        navigateToProfile(review.reviewerId);
                      }
                    }}
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                      {review.reviewerInitial}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-neutral-800">{review.reviewerName}</p>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 font-medium italic leading-relaxed pr-9 sm:pr-10 text-right mt-3">
                  &quot;{review.comment}&quot;
                </p>
              </div>
            ))}

            {hasNextPage && (
              <div className="flex justify-center mt-4 pt-4 border-t border-neutral-100/60">
                <button
                  onClick={onLoadMore}
                  disabled={isFetchingNextPage}
                  className="text-primary-500 text-xs sm:text-sm font-semibold hover:underline flex items-center gap-2 disabled:opacity-50"
                >
                  {isFetchingNextPage && <Loader2 className="w-3 h-3 animate-spin" />}
                  عرض المزيد
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-8">
            <div className="w-12 h-12 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400">
              <Star className="w-6 h-6 stroke-[1.5] text-neutral-300" />
            </div>
            <div>
              <p className="text-neutral-500 text-sm font-semibold">لا توجد تقييمات بعد</p>
              <p className="text-neutral-400 text-xs mt-1 max-w-[280px] leading-relaxed mx-auto">
                لم يكتب أحد رأياً في هذه الصفحة بعد.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
