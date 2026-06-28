import React, { useState, useEffect } from "react";
import { Star, Briefcase, Loader2, AlertCircle } from "lucide-react";
import { Exchange } from "@/src/features/profile/services/profileServices";
import { useSubmitReview } from "../hooks/useSubmitReview";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface RatingModalProps {
  contract: Exchange;
  currentUserId: number;
  open?: boolean;
  onClose?: () => void;
}

export function RatingModal({ contract, currentUserId, open = true, onClose }: RatingModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const submitMutation = useSubmitReview();
  const queryClient = useQueryClient();

  // ─── Preconditions & Context Extraction ───
  const isProvider = contract.providerId === currentUserId;
  const otherParty = isProvider ? contract.requester : contract.provider;
  const otherPartyName = otherParty?.full_name || otherParty?.username || "عضو وصلة";
  const otherPartyAvatar = otherParty?.profile_image;
  const otherPartyInitials = otherPartyName.substring(0, 2);
  const categoryText = contract.post?.category === "OFFER" ? "عرض خدمة" : "طلب خدمة";
  const providerName = contract.provider?.full_name || contract.provider?.username || "مزود الخدمة";
  const requesterName = contract.requester?.full_name || contract.requester?.username || "مستفيد الخدمة";

  // ─── Enforce Navigation & Close Block (Strict UC-TX-08 Lock) ───
  useEffect(() => {
    // 1. Prevent Escape key close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);

    // 2. Prevent window reload/close warning
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // 3. Prevent browser back navigation
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      toast.error("يرجى تقييم الخدمة للاستمرار في استخدام المنصة", { id: "rate-lock-toast" });
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setErrorMsg("التقييم يجب أن يكون بين 1 و 5");
      return;
    }

    setErrorMsg("");

    try {
      await submitMutation.mutateAsync({
        serviceExchangeId: contract.id,
        rating,
        comment: comment.trim() || undefined,
      });

      // Dispatch a custom event so the global layout can hide the modal instantly
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("review-submitted", {
            detail: { contractId: contract.id },
          })
        );
      }

      // Close the modal instantly
      if (onClose) {
        onClose();
      }

      // Optimistically update query client Exchanges cache
      try {
        queryClient.setQueryData<Exchange[]>(["userExchanges", undefined], (old) => {
          if (!old) return old;
          return old.map((ex) => {
            if (ex.id === contract.id) {
              return {
                ...ex,
                reviews: [...(ex.reviews || []), { reviewerId: currentUserId, reviewer: { id: currentUserId } }]
              } as Exchange;
            }
            return ex;
          });
        });
      } catch (e) {
        console.error("Failed to update query cache:", e);
      }

      toast.success("تم إرسال تقييمك بنجاح! شكرًا لك.");
    } catch (err) {
      const msg = (err as Error).message || "فشلت عملية إرسال التقييم، يرجى المحاولة مرة أخرى";
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Show a specific warning if the user tries to click outside to dismiss
    if (e.target === e.currentTarget) {
      toast.error("عذرًا، لا يمكنك الاستمرار في استخدام الموقع دون إتمام هذا التقييم أولاً.", {
        id: "rate-lock-toast",
        duration: 4000,
      });
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-md" 
      dir="rtl"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-5 sm:p-6 max-w-[460px] w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-neutral-100 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 custom-scrollbar"
      >
        {/* Decorative top accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary-400 via-primary-600 to-amber-500"></div>

        {/* 1. Avatar of other party */}
        <div className="relative mt-1 mb-2 shrink-0">
          {otherPartyAvatar ? (
            <img
              src={otherPartyAvatar}
              alt={otherPartyName}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-primary-50 shadow-sm"
            />
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-lg font-bold border-4 border-primary-50 shadow-sm shrink-0">
              {otherPartyInitials}
            </div>
          )}
        </div>

        {/* Headline */}
        <h2 className="text-base sm:text-lg font-black text-neutral-900 text-center mb-0.5 leading-tight px-2">
          كيف كانت تجربتك في العمل مع <span className="text-primary-600">{otherPartyName}</span>؟
        </h2>
        <p className="text-[10px] sm:text-xs text-neutral-400 font-bold mb-3">التقييم العام</p>

        {/* 2. Rating Star Component (1-5 stars selector) */}
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-row-reverse gap-1.5 items-center justify-center mb-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const starValue = 5 - i; // 1 to 5 from right to left in RTL
              const isHighlighted = hoverRating >= starValue || (!hoverRating && rating >= starValue);

              return (
                <button
                  type="button"
                  key={i}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(starValue)}
                  className="p-0.5 transition-transform duration-100 hover:scale-120 active:scale-95 focus:outline-none"
                  title={`تقييم ${starValue} من 5`}
                >
                  <Star
                    className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-150 ${isHighlighted
                      ? "fill-amber-400 text-amber-400"
                      : "fill-neutral-50 text-neutral-250"
                      }`}
                  />
                </button>
              );
            })}
          </div>

          <p className="text-xs sm:text-sm font-black text-amber-500 mb-4 min-h-[18px] transition-all">
            {rating > 0 ? `تقييمك: ${rating}.0 / 5` : "اختر تقييماً من 1 إلى 5"}
          </p>
        </div>

        {/* 3. Context section: Contract details card */}
        <div className="bg-neutral-50/70 border border-neutral-100 rounded-2xl p-3 sm:p-4 w-full flex items-start gap-2.5 text-right">
          <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 mt-0.5">
            <Briefcase size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-black text-neutral-800 truncate leading-snug">
              {contract.post?.title || "تبادل خدمة"}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] sm:text-[10px] bg-primary-100/50 text-primary-700 px-2 py-0.5 rounded-full font-bold">
                {categoryText}
              </span>
              <span className="text-[9px] sm:text-[10px] text-neutral-450 font-medium">
                رقم العقد: #{contract.id}
              </span>
            </div>

            {/* Provider and Requester list showing who is the current user (you) */}
            <div className="mt-2.5 pt-2.5 border-t border-neutral-200/40 flex flex-col gap-1.5 text-[11px] sm:text-xs">
              <div className="flex justify-between items-center text-neutral-600">
                <span>مزود الخدمة:</span>
                <span className={`font-semibold ${isProvider ? "text-primary-700 font-bold" : "text-neutral-800"}`}>
                  {providerName}
                  {isProvider && (
                    <span className="text-[9px] sm:text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-md mr-1 font-bold">
                      (أنت)
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center text-neutral-600">
                <span>مستفيد الخدمة:</span>
                <span className={`font-semibold ${!isProvider ? "text-primary-700 font-bold" : "text-neutral-800"}`}>
                  {requesterName}
                  {!isProvider && (
                    <span className="text-[9px] sm:text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-md mr-1 font-bold">
                      (أنت)
                    </span>
                  )}
                </span>
              </div>
            </div>

            <p className="text-[10px] sm:text-[11px] font-bold text-primary-600 mt-2 flex items-center gap-1">
              <AlertCircle size={10} className="shrink-0" />
              <span>هذا التقييم متعلق بالعقد رقم #{contract.id}</span>
            </p>
          </div>
        </div>

        {/* 4. Form for comment and submit */}
        <form onSubmit={handleSubmit} className="w-full mt-3.5 flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] sm:text-xs font-bold text-neutral-600 mr-0.5">
              اكتب ملاحظاتك (اختياري)
            </label>
            <div className="relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                placeholder="شاركنا تجربتك بالتفصيل..."
                maxLength={500}
                className="w-full text-xs sm:text-sm border border-neutral-200 rounded-xl p-2.5 sm:p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none min-h-[70px] resize-none pb-7 text-right"
              />
              <span className="absolute bottom-2 left-3 text-[10px] font-semibold text-neutral-400">
                {comment.length}/500
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="text-xs font-bold text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100 flex items-center gap-1.5">
              <AlertCircle size={12} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={rating === 0 || submitMutation.isPending}
            className="w-full py-2.5 sm:py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all duration-150 active:scale-98 disabled:opacity-50 disabled:pointer-events-none mt-1 flex justify-center items-center gap-2"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span>جاري إرسال التقييم...</span>
              </>
            ) : (
              <span>إرسال التقييم</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
