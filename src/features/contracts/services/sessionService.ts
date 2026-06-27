import { apiRequest } from "@/src/services/api";
import { WorkSession } from "../contract.types";

export interface CreateSessionPayload {
  hours: number;
  notes: string;
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

export const sessionService = {
  getSessions: async (exchangeId: string | number): Promise<WorkSession[]> => {
    const { data, error, status } = await apiRequest<unknown>({
      method: "get",
      url: `/exchanges/${exchangeId}/sessions`,
    });
    throwApiError(error, status);
    
    // Support if backend returns { sessions: [] } or just an array []
    if (Array.isArray(data)) {
      return data as WorkSession[];
    }
    const dataObj = data as { sessions?: WorkSession[] } | null;
    return dataObj?.sessions || [];
  },

  createSession: async (exchangeId: string | number, payload: CreateSessionPayload): Promise<WorkSession> => {
    const { data, error, status } = await apiRequest<unknown, CreateSessionPayload>({
      method: "post",
      url: `/exchanges/${exchangeId}/sessions`,
      payload,
    });
    throwApiError(error, status);
    
    // Support if backend returns { session: {} } or just the object
    const dataObj = data as { session?: WorkSession } | null;
    return dataObj?.session || (data as WorkSession);
  },

  confirmSession: async (exchangeId: string | number, sessionId: string | number): Promise<unknown> => {
    const { data, error, status } = await apiRequest<unknown>({
      method: "put",
      url: `/exchanges/${exchangeId}/sessions/${sessionId}/confirm`,
    });
    throwApiError(error, status);
    return data;
  },

  rejectSession: async (exchangeId: string | number, sessionId: string | number): Promise<unknown> => {
    const { data, error, status } = await apiRequest<unknown>({
      method: "put",
      url: `/exchanges/${exchangeId}/sessions/${sessionId}/reject`,
    });
    throwApiError(error, status);
    return data;
  },
};
