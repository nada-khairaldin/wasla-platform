export interface CreateContractRequest {
  postId: number;
  providerId: number;
  duration: number;
}

export interface ContractExchange {
  id: number;
  postId: number;
  requesterId: number;
  providerId: number;
  duration: number;
  status: string;
  escrowStatus: string;
  acceptedAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractResponse {
  exchange: ContractExchange;
}
