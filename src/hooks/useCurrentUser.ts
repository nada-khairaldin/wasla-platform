import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import { authServices } from "../features/auth/services/authService";

// const getCurrentUser = async () => {
//   const { data, error } = await authServices.getCurrentUser();

//   if (error) {
//     throw new Error(error);
//   }

//   return data;
// };

const getCurrentUser =  async () => {
return {
    Username: "Nada",
    points: 120,
  };
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
