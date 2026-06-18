import { useQuery } from "@tanstack/react-query";
import { profileServices, Exchange } from "../services/profileServices";

export const useUserExchanges = (params?: { status?: string; role?: string }) => {
  return useQuery<Exchange[]>({
    queryKey: ["userExchanges", params],
    queryFn: async () => {
      const { data, error } = await profileServices.getUserExchanges(params);
      if (error) throw new Error(error);
      return data?.data || [];
    },
  });
};
