import { useQuery } from "@tanstack/react-query";
import { profileServices, WalletTransaction } from "../services/profileServices";

export const useWalletHistory = (params?: { page?: number; limit?: number; type?: string; status?: string }) => {
  return useQuery<WalletTransaction[]>({
    queryKey: ["walletHistory", params],
    queryFn: async () => {
      const { data, error } = await profileServices.getWalletHistory(params);
      if (error) throw new Error(error);
      return data?.data || [];
    },
  });
};
