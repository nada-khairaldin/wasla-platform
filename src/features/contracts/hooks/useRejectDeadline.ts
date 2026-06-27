import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contractService } from "../services/contractService";
import toast from "react-hot-toast";

export const useRejectDeadline = (exchangeId: string | number | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!exchangeId) throw new Error("Exchange ID is required");
      return contractService.rejectDeadline(Number(exchangeId));
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const message = error?.response?.data?.message || error.message || "حدث خطأ أثناء رفض مقترح التعديل";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("تم رفض مقترح تعديل تاريخ الانتهاء");
    },
    onSettled: () => {
      if (exchangeId) {
        queryClient.invalidateQueries({ queryKey: ["contractDetails", String(exchangeId)] });
        queryClient.invalidateQueries({ queryKey: ["userExchanges"] });
      }
    },
  });
};
