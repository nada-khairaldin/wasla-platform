import { useRouter } from "next/navigation";
import { useCurrentUser } from "./useCurrentUser";

export const useUserActions = (targetUserId?: number | string) => {
  const router = useRouter();
  const { data: currentUser, isLoading } = useCurrentUser();
  const currentUserId = currentUser?.user?.userId;

  const safeTargetId = targetUserId ? Number(targetUserId) : undefined;
  const safeCurrentId = currentUserId ? Number(currentUserId) : undefined;

  const isSelf = 
    safeTargetId !== undefined && 
    safeCurrentId !== undefined && 
    safeTargetId === safeCurrentId;

  const profileUrl = isSelf ? "/my-profile" : `/users/${safeTargetId}`;
  
  // Do not allow messaging if still loading, or if it's the current user
  const canMessage = safeTargetId !== undefined && !isLoading && !isSelf;

  const navigateToProfile = (overrideId?: number | string) => {
    const idToUse = overrideId ? Number(overrideId) : safeTargetId;
    if (!idToUse) return;
    const targetIsSelf = safeCurrentId === idToUse;
    router.push(targetIsSelf ? "/my-profile" : `/users/${idToUse}`);
  };

  const resolveProfileRoute = (id: number | string) => {
    return safeCurrentId === Number(id) ? "/my-profile" : `/users/${id}`;
  };

  return {
    isSelf,
    profileUrl,
    canMessage,
    navigateToProfile,
    resolveProfileRoute,
    currentUserId: safeCurrentId,
    isLoading,
  };
};
