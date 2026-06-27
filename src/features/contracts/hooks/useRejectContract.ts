import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contractService, CreateContractResponse } from "../api/contractService";

export function useRejectContract() {
  const queryClient = useQueryClient();

  return useMutation<CreateContractResponse, unknown, number>({
    mutationFn: contractService.rejectContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userExchanges"] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
