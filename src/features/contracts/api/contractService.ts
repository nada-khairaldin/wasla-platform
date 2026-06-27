import { api as axiosInstance } from "@/src/services/api";

export interface CreateContractPayload {
  postId: number;
  providerId: number;
  duration: number;
  contractEndDate: string;
}

export interface CreateContractResponse {
  exchange: {
    id: number;
    postId: number;
    requesterId: number;
    providerId: number;
    duration: number;
    contractEndDate: string;
    status: string;
  };
}

export const contractService = {
  createContract: async (payload: CreateContractPayload): Promise<CreateContractResponse> => {
    const response = await axiosInstance.post<CreateContractResponse>("/exchanges/request", payload);
    return response.data;
  },
  acceptContract: async (id: number): Promise<CreateContractResponse> => {
    const response = await axiosInstance.put<CreateContractResponse>(`/exchanges/${id}/accept`);
    return response.data;
  },
  rejectContract: async (id: number): Promise<CreateContractResponse> => {
    const response = await axiosInstance.put<CreateContractResponse>(`/exchanges/${id}/reject`);
    return response.data;
  },
};
