import { apiRequest } from "@/src/services/api";
import { Exchange } from "@/src/features/profile/services/profileServices";
import { ApiDateString, toApiDateString } from "@/src/utils/date";

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

export interface ProposeDeadlinePayload {
  /** Contract end date in YYYY-MM-DD format (date only, no time or timezone). */
  proposedEndDate: ApiDateString;
}

class ApiError extends Error {
  response: { status?: number; data: { message: string } };

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.response = { status, data: { message } };
  }
}

const throwApiError = (error: string | null, status?: number) => {
  if (error) {
    throw new ApiError(error, status);
  }
};

export const contractService = {
  getContractById: async (id: number): Promise<{ exchange: Exchange }> => {
    const { data, error, status } = await apiRequest<{ exchange: Exchange }>({
      method: "get",
      url: `/exchanges/${id}`,
    });
    throwApiError(error, status);
    return data!;
  },
  createContract: async (payload: CreateContractPayload): Promise<CreateContractResponse> => {
    const { data, error, status } = await apiRequest<CreateContractResponse, CreateContractPayload>({
      method: "post",
      url: "/exchanges/request",
      payload,
    });
    throwApiError(error, status);
    return data!;
  },
  acceptContract: async (id: number): Promise<CreateContractResponse> => {
    const { data, error, status } = await apiRequest<CreateContractResponse>({
      method: "put",
      url: `/exchanges/${id}/accept`,
    });
    throwApiError(error, status);
    return data!;
  },
  rejectContract: async (id: number): Promise<CreateContractResponse> => {
    const { data, error, status } = await apiRequest<CreateContractResponse>({
      method: "put",
      url: `/exchanges/${id}/reject`,
    });
    throwApiError(error, status);
    return data!;
  },
  proposeDeadline: async (id: number, proposedEndDate: string): Promise<unknown> => {
    const payload: ProposeDeadlinePayload = {
      proposedEndDate: toApiDateString(proposedEndDate),
    };
    const { data, error, status } = await apiRequest<unknown, ProposeDeadlinePayload>({
      method: "post",
      url: `/exchanges/${id}/deadline`,
      payload,
    });
    throwApiError(error, status);
    return data!;
  },
  approveDeadline: async (id: number): Promise<unknown> => {
    const { data, error, status } = await apiRequest<unknown>({
      method: "put",
      url: `/exchanges/${id}/deadline/approve`,
    });
    throwApiError(error, status);
    return data!;
  },
  rejectDeadline: async (id: number): Promise<unknown> => {
    const { data, error, status } = await apiRequest<unknown>({
      method: "put",
      url: `/exchanges/${id}/deadline/reject`,
    });
    throwApiError(error, status);
    return data!;
  },
};
