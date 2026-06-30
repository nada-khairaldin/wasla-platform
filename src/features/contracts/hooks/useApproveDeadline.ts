import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contractService } from "../services/contractService";
import { Exchange } from "@/src/features/profile/services/profileServices";
import {
  syncDeadlineApproachingNotifications,
} from "@/src/features/notifications/utils/deadlineNotifications";
import toast from "react-hot-toast";

export const useApproveDeadline = (exchangeId: string | number | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!exchangeId) throw new Error("Exchange ID is required");
      return contractService.approveDeadline(Number(exchangeId));
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const message = error?.response?.data?.message || error.message || "حدث خطأ أثناء قبول المقترح";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("تم قبول المقترح وتحديث تاريخ الانتهاء");

      if (!exchangeId) return;

      const contractId = String(exchangeId);

      queryClient.setQueryData<{ exchange: Exchange }>(
        ["contractDetails", contractId],
        (old) => {
          if (!old?.exchange) return old;

          const approvedEndDate =
            old.exchange.proposedEndDate ?? old.exchange.contractEndDate;

          return {
            ...old,
            exchange: {
              ...old.exchange,
              contractEndDate: approvedEndDate,
              proposedEndDate: null,
            },
          };
        }
      );

      const updatedEndDate = queryClient.getQueryData<{ exchange: Exchange }>([
        "contractDetails",
        contractId,
      ])?.exchange?.contractEndDate;

      syncDeadlineApproachingNotifications(queryClient, contractId, updatedEndDate);
    },
    onSettled: () => {
      if (exchangeId) {
        const contractId = String(exchangeId);
        queryClient.invalidateQueries({ queryKey: ["contractDetails", contractId] });
        queryClient.invalidateQueries({ queryKey: ["userExchanges"] });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }
    },
  });
};
