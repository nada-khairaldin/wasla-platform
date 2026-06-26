import { useRouter } from "next/navigation";
import { useCurrentUser } from "./useCurrentUser";

export const useProfileNavigation = () => {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();

  const navigateToProfile = (targetUserId: number) => {
    if (currentUser?.user?.userId === targetUserId) {
      router.push("/my-profile");
    } else {
      router.push(`/users/${targetUserId}`);
    }
  };

  return { navigateToProfile };
};
