import { useQuery } from "@tanstack/react-query";
import { sessionService } from "../services/sessionService";

export const useContractSessions = (exchangeId: string | number | undefined) => {
  return useQuery({
    queryKey: ["contractSessions", exchangeId],
    queryFn: () => sessionService.getSessions(exchangeId!),
    enabled: !!exchangeId && !isNaN(Number(exchangeId)),
  });
};
