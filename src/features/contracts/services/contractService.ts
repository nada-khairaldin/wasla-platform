import { apiRequest } from "@/src/services/api";
import { CreateContractRequest, CreateContractResponse } from "../types/contract.types";

export const contractService = {
  createContract: async (payload: CreateContractRequest) => {
    return apiRequest<CreateContractResponse, CreateContractRequest>({
      method: "post",
      url: "/exchanges/request",
      payload,
    });
  },
};
