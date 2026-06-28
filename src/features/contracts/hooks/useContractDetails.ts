import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { Contract, ContractStatus, WorkSession } from "../contract.types";
import { contractService } from "../services/contractService";

export function useContractDetails(contractId: string) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["contractDetails", contractId],
    queryFn: () => contractService.getContractById(Number(contractId)),
    enabled: !!contractId && !isNaN(Number(contractId)),
  });

  const contract = useMemo(() => {
    if (!data?.exchange) return undefined;
    const ex = data.exchange;
    return {
      id: ex.id.toString(),
      title: ex.post?.title || "عقد خدمة",
      seekerName: ex.requester?.full_name || ex.requester?.username || "المستفيد",
      providerName: ex.provider?.full_name || ex.provider?.username || "المزود",
      serviceType: ex.post?.category || "غير محدد",
      deliveryType: ex.post?.service_mode === "ONLINE" ? "أونلاين" : "حضوري" as "أونلاين" | "أوفلاين",
      status: ex.status?.toLowerCase() as ContractStatus,
      proposedEndDate: ex.proposedEndDate,
      contractEndDate: ex.contractEndDate,
      stats: {
        totalHours: ex.duration || 0,
        completedHours: 0, // Placeholder as required fields may not be present in schema yet
        remainingHours: ex.duration || 0,
        endDate: (ex.contractEndDate || ex.createdAt) 
          ? new Date(ex.contractEndDate || ex.createdAt).toLocaleDateString("ar-EG", {
              day: "2-digit",
              month: "long",
              year: "numeric"
            })
          : "—",
        proposedEndDate: ex.proposedEndDate
          ? new Date(ex.proposedEndDate).toLocaleDateString("ar-EG", {
              day: "2-digit",
              month: "long",
              year: "numeric"
            })
          : null,
      },
      providerId: ex.providerId,
      requesterId: ex.requesterId,
      workSessions: [], // To be extended when API supports sessions
      operationLogs: [], // To be extended when API supports logs
      createdAt: ex.createdAt,
      acceptedAt: ex.acceptedAt,
      deliveredAt: ex.deliveredAt,
      completedAt: ex.completedAt,
      canceledAt: ex.canceledAt,
    } as Contract;
  }, [data]);

  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const openAddSessionModal = () => setIsAddSessionModalOpen(true);
  const closeAddSessionModal = () => setIsAddSessionModalOpen(false);

  // Add session logic
  const handleAddSession = async (hours: number, notes: string) => {
    // This is now passed from page.tsx using the mutation hook directly,
    // or we can remove it from here entirely.
    // Let's remove this mock implementation and rely on useCreateSession in page.tsx.
  };

  // Filter sessions based on active tab
  let filteredSessions = contract?.workSessions || [];
  if (activeTab !== "all") {
    filteredSessions = filteredSessions.filter((session: WorkSession) => {
      const s = session.status.toUpperCase();
      if (activeTab === "pending") {
        return s === "PENDING_CONFIRMATION" || s === "PENDING" || session.status === "قيد الانتظار";
      }
      if (activeTab === "confirmed") {
        return s === "CONFIRMED" || session.status === "مؤكدة";
      }
      if (activeTab === "rejected") {
        return s === "REJECTED" || session.status === "غير مؤكدة";
      }
      return false;
    });
  }

  return {
    contract,
    isLoading,
    isError,
    error,
    refetch,
    isAddSessionModalOpen,
    openAddSessionModal,
    closeAddSessionModal,
    handleAddSession,
    activeTab,
    setActiveTab,
    filteredSessions
  };
}
