import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contractService } from "../services/contractService";
import { ApiDateString } from "@/src/utils/date";
import toast from "react-hot-toast";

export const useProposeDeadline = (exchangeId: string | number | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposedEndDate: ApiDateString) => {
      if (!exchangeId) throw new Error("Exchange ID is required");
      return contractService.proposeDeadline(Number(exchangeId), proposedEndDate);
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const message = error?.response?.data?.message || error.message || "حدث خطأ أثناء إرسال مقترح التعديل";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("تم إرسال مقترح التعديل بنجاح");
    },
    onSettled: () => {
      if (exchangeId) {
        queryClient.invalidateQueries({ queryKey: ["contractDetails", String(exchangeId)] });
        queryClient.invalidateQueries({ queryKey: ["userExchanges"] });
      }
    },
  });
};
