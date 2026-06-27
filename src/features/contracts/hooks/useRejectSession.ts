import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionService } from "../services/sessionService";
import { WorkSession } from "../contract.types";
import toast from "react-hot-toast";

export const useRejectSession = (exchangeId: string | number | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string | number) => {
      if (!exchangeId) throw new Error("Exchange ID is required");
      return sessionService.rejectSession(exchangeId, sessionId);
    },
    onMutate: async (sessionId: string | number) => {
      await queryClient.cancelQueries({ queryKey: ["contractSessions", exchangeId] });
      const previousSessions = queryClient.getQueryData<WorkSession[]>(["contractSessions", exchangeId]);

      if (previousSessions) {
        queryClient.setQueryData<WorkSession[]>(
          ["contractSessions", exchangeId],
          previousSessions.map((session) =>
            String(session.id) === String(sessionId) ? { ...session, status: "REJECTED" } : session
          )
        );
      }

      return { previousSessions };
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }, sessionId, context) => {
      if (context?.previousSessions) {
        queryClient.setQueryData(["contractSessions", exchangeId], context.previousSessions);
      }
      const message = error?.response?.data?.message || error.message || "حدث خطأ أثناء رفض الجلسة";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("تم رفض الجلسة");
    },
    onSettled: () => {
      if (exchangeId) {
        queryClient.invalidateQueries({ queryKey: ["contractSessions", exchangeId] });
        queryClient.invalidateQueries({ queryKey: ["contractDetails", exchangeId] });
      }
    },
  });
};
