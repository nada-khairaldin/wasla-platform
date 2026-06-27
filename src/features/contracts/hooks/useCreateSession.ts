import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionService, CreateSessionPayload } from "../services/sessionService";
import toast from "react-hot-toast";

export const useCreateSession = (exchangeId: string | number | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSessionPayload) => {
      if (!exchangeId) throw new Error("Exchange ID is required");
      return sessionService.createSession(exchangeId, payload);
    },
    onSuccess: () => {
      if (exchangeId) {
        queryClient.invalidateQueries({ queryKey: ["contractSessions", exchangeId] });
      }
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const message = error?.response?.data?.message || error.message || "حدث خطأ أثناء إنشاء الجلسة";
      toast.error(message);
    }
  });
};
