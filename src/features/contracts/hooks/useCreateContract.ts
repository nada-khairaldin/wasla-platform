import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contractService, CreateContractPayload, CreateContractResponse } from "../services/contractService";

export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation<CreateContractResponse, unknown, CreateContractPayload>({
    mutationFn: contractService.createContract,
    onSuccess: () => {
      // Invalidate relevant queries like messages or conversations if needed
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["userExchanges"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
