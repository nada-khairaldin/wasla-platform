import React from "react";
import { Star } from "lucide-react";
import { Review } from "../types";
import { getInitials } from "@/src/utils";

interface ReviewCardProps {
  review: Review;
}

export function StarRating({ rating, maxStars = 5, className = "" }: { rating: number; maxStars?: number; className?: string }) {
  // Scale down legacy ratings (e.g. out of 10) if they exceed the max rating value
  const displayRating = rating > maxStars ? rating / 2 : rating;
  const validRating = Math.max(0, Math.min(displayRating, maxStars));

  return (
    <div className={`flex flex-row-reverse gap-0.5 items-center justify-end ${className}`}>
      <span className="text-xs font-bold text-neutral-500 mr-2" dir="ltr">
        {validRating.toFixed(1)} / {maxStars}
      </span>
      {Array.from({ length: maxStars }).map((_, i) => {
        const starIndex = maxStars - 1 - i; // reverse index for RTL alignment
        const isFilled = starIndex < validRating;
        return (
          <Star
            key={i}
            className={`w-3.5 h-3.5 transition-colors duration-150 ${
              isFilled 
                ? "fill-amber-400 text-amber-400" 
                : "fill-neutral-100 text-neutral-200"
            }`}
          />
        );
      })}
    </div>
  );
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = getInitials(review.reviewerName || "م");
  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-5 sm:p-6 shadow-[0_2px_12px_rgb(0,0,0,0.02)] flex flex-col gap-4 text-right hover:shadow-md transition-shadow duration-200" dir="rtl">
      {/* Header section */}
      <div className="flex items-start justify-between gap-3">
        {/* Right side: Reviewer profile image/initials & name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {review.reviewerInitial || initials}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-black text-neutral-800 leading-tight">
              {review.reviewerName}
            </span>
            <span className="text-[10px] sm:text-xs text-neutral-400 leading-none" dir="ltr">
              {review.reviewerId ? `@user_${review.reviewerId}` : "@member"}
            </span>
          </div>
        </div>

        {/* Left side: Date */}
        {formattedDate && (
          <span className="text-[10px] sm:text-xs text-neutral-400 font-medium shrink-0">
            {formattedDate}
          </span>
        )}
      </div>

      {/* Star rating */}
      <div className="border-t border-neutral-50/50 pt-2">
        <StarRating rating={review.rating} />
      </div>

      {/* Review Comment */}
      {review.comment && (
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium mt-1 bg-neutral-50/50 p-3 rounded-xl border border-neutral-50">
          &quot;{review.comment}&quot;
        </p>
      )}
    </div>
  );
}
