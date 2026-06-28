import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contractService, CreateContractResponse } from "../services/contractService";

export function useAcceptContract() {
  const queryClient = useQueryClient();

  return useMutation<CreateContractResponse, unknown, number>({
    mutationFn: contractService.acceptContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userExchanges"] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["posts_and_feed"] });
    },
  });
}
