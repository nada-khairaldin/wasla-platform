import { SavedPost } from "@/src/features/posts/type";
import { Exchange, ApiReview, WalletTransaction } from "../services/profileServices";
import { UserProfile } from "@/src/types";
import { Transaction, Contract, Review, SavedService } from "../types";

// Extract the recent exchange type from UserProfile
type ProfileRecentExchange = UserProfile["profile"]["recentExchanges"][number];

export const mapExchangeToTransaction = (
  exc: Exchange,
  userId: number | undefined,
): Transaction => {
  const isProvider = exc.providerId === userId;
  return {
    id: exc.id.toString(),
    type: isProvider ? "deposit" : "withdrawal",
    description: isProvider
      ? `تقديم خدمة: ${exc.post?.title || "خدمة"}`
      : `استلام خدمة: ${exc.post?.title || "خدمة"}`,
    hours: exc.duration,
    date: new Date(exc.completedAt || exc.createdAt).toLocaleDateString("ar-EG"),
  };
};

export const mapProfileRecentExchangeToContract = (
  exc: ProfileRecentExchange,
): Contract => {
  const isProvider = exc.role === "PROVIDER";
  return {
    id: exc.id.toString(),
    title: exc.post?.title || "تبادل خدمة",
    partnerName:
      exc.counterparty?.name || exc.counterparty?.username || "عضو وصلة",
    date: new Date(exc.completedAt).toLocaleDateString("ar-EG"),
    durationHours: exc.timeCredits,
    iconBg: isProvider
      ? "bg-success-50 text-success-600"
      : "bg-warning-50 text-warning-600",
  };
};

export const mapSavedPostToSavedService = (saved: SavedPost): SavedService => {
  return {
    id: saved.post.id.toString(),
    title: saved.post.title,
    providerName:
      saved.post.user?.full_name || saved.post.user?.username || "عضو وصلة",
    durationHours: saved.post.assignedTimeCredits,
  };
};

export const mapApiReviewToReview = (rev: ApiReview): Review => {
  return {
    id: rev.id.toString(),
    reviewerName: rev.reviewer?.name || rev.reviewer?.username || "عضو وصلة",
    reviewerInitial: (
      rev.reviewer?.name ||
      rev.reviewer?.username ||
      "ع"
    )[0],
    rating: rev.rating,
    comment: rev.comment,
  };
};

export const mapWalletTransactionToTransaction = (tx: WalletTransaction): Transaction => {
  const isIncoming = tx.type === "credit" || tx.type === "earned";
  let type: "deposit" | "withdrawal" | "gift" = isIncoming ? "deposit" : "withdrawal";

  let description = "";
  if (tx.counterparty) {
    if (isIncoming) {
      description = `تقديم خدمة إلى ${tx.counterparty.name} (عنوان الخدمة: "${tx.relatedServiceOrRequest?.title || ""}")`;
    } else {
      description = `استلام خدمة من ${tx.counterparty.name} (عنوان الخدمة: "${tx.relatedServiceOrRequest?.title || ""}")`;
    }
  } else {
    description = tx.relatedServiceOrRequest?.title || "عملية محفظة";
    const lowerDesc = description.toLowerCase();
    if (
      lowerDesc.includes("welcome") ||
      lowerDesc.includes("gift") ||
      description.includes("هدية") ||
      description.includes("ترحيب")
    ) {
      type = "gift";
      description = "هدية ترحيبية: تفعيل الحساب في المنصة";
    }
  }

  return {
    id: tx.transactionId,
    type,
    description,
    hours: tx.amount,
    date: new Date(tx.timestamp).toLocaleDateString("ar-EG"),
  };
};
