import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contractService } from "../services/contractService";
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
    },
    onSettled: () => {
      if (exchangeId) {
        queryClient.invalidateQueries({ queryKey: ["contractDetails", String(exchangeId)] });
        queryClient.invalidateQueries({ queryKey: ["userExchanges"] });
      }
    },
  });
};
