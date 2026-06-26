import { useRouter } from "next/navigation";
import { useCurrentUser } from "./useCurrentUser";

export const useProfileNavigation = () => {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();

  const navigateToProfile = (targetUserId: number | string) => {
    const currentId = currentUser?.user?.userId;
    if (currentId !== undefined && Number(currentId) === Number(targetUserId)) {
      router.push("/my-profile");
    } else {
      router.push(`/users/${targetUserId}`);
    }
  };

  return { navigateToProfile };
};
