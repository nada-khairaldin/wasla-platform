// components/profile/ReviewsSection.tsx
import { Star, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Review } from "../types";

interface ReviewsSectionProps {
  reviews: Review[];
  onViewAll?: () => void;
}

function StarRating(props: { rating: number }) {
  const { rating } = props;
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

export default function ReviewsSection(props: ReviewsSectionProps) {
  const { reviews, onViewAll } = props;

  return (
    <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 sm:p-6" dir="rtl">
      {/* Header Row — Title on the right, Link on the left */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-sm sm:text-base font-bold text-primary-500 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary-500" />
          <span>آراء المستفيدين</span>
        </h2>
        {reviews.length > 0 && (
          <Link href="/my-profile/reviews" className="text-xs sm:text-sm text-primary-500 hover:underline">
            عرض الكل
          </Link>
        )}
      </div>

      <div className="flex flex-col">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className={`flex flex-col pb-5 last:pb-0 ${index > 0 ? "pt-5 border-t border-neutral-100/60" : ""}`}
          >
            {/* Header info: Name/Avatar on the right, Stars on the left */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                  {review.reviewerInitial}
                </div>
                <p className="text-xs sm:text-sm font-semibold text-neutral-800">{review.reviewerName}</p>
              </div>
              <StarRating rating={review.rating} />
            </div>
            {/* Comment text — padding on the right to align with text under avatar */}
            <p className="text-xs sm:text-sm text-neutral-600 font-medium italic leading-relaxed pr-9 sm:pr-10 text-right mt-3">
              &quot;{review.comment}&quot;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
