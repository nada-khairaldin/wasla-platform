import { useRouter } from "next/navigation";
import { useCurrentUser } from "./useCurrentUser";

export const useUserActions = (targetUserId?: number) => {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const currentUserId = currentUser?.user?.userId;

  const isSelf = targetUserId !== undefined && currentUserId === targetUserId;
  const profileUrl = isSelf ? "/my-profile" : `/users/${targetUserId}`;
  const canMessage = targetUserId !== undefined ? !isSelf : false;

  const navigateToProfile = (overrideId?: number) => {
    const idToUse = overrideId ?? targetUserId;
    if (!idToUse) return;
    const targetIsSelf = currentUserId === idToUse;
    router.push(targetIsSelf ? "/my-profile" : `/users/${idToUse}`);
  };

  const resolveProfileRoute = (id: number) => {
    return currentUserId === id ? "/my-profile" : `/users/${id}`;
  };

  return {
    isSelf,
    profileUrl,
    canMessage,
    navigateToProfile,
    resolveProfileRoute,
    currentUserId,
  };
};
