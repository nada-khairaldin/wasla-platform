import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contractService } from "../services/contractService";
import { CreateContractRequest } from "../types/contract.types";

export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateContractRequest) => {
      const response = await contractService.createContract(data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      // Invalidate specific chat or exchange queries if they exist
    },
  });
}
