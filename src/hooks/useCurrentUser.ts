import { useQuery } from "@tanstack/react-query";
import { authServices } from "../features/auth/services/authService";
import { CurrentUser } from "../types";

const getCurrentUser = async () => {
  const { data, error } = await authServices.getCurrentUser();
  if (error) throw new Error(error);
  return data as CurrentUser;
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
