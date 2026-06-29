import { PendingReviewContract } from "@/src/features/auth/types";
import { Exchange } from "@/src/features/profile/services/profileServices";

interface CurrentUserInfo {
  userId: number;
  username?: string;
  full_name?: string;
}

function toExchangeParty(
  id: number,
  username: string,
  name: string,
  profilePicture: string | null,
) {
  return {
    id,
    username,
    full_name: name,
    profile_image: profilePicture || "",
  };
}

export function mapPendingReviewContractToExchange(
  contract: PendingReviewContract,
  currentUser: CurrentUserInfo,
): Exchange {
  const isRequester = contract.role === "requester";
  const reviewee = toExchangeParty(
    contract.reviewee.id,
    contract.reviewee.username,
    contract.reviewee.name,
    contract.reviewee.profilePicture,
  );
  const self = toExchangeParty(
    currentUser.userId,
    currentUser.username || "",
    currentUser.full_name || "",
    null,
  );

  return {
    id: contract.id,
    postId: contract.postId,
    requesterId: isRequester ? currentUser.userId : contract.reviewee.id,
    providerId: isRequester ? contract.reviewee.id : currentUser.userId,
    duration: 0,
    status: contract.status,
    escrowStatus: "",
    acceptedAt: null,
    deliveredAt: null,
    completedAt: contract.completedAt,
    canceledAt: null,
    createdAt: "",
    updatedAt: "",
    requester: isRequester ? self : reviewee,
    provider: isRequester ? reviewee : self,
    post: {
      id: contract.postId,
      title: contract.postTitle,
      category: "",
      service_mode: "ONLINE",
    },
  };
}
