import { useState } from "react";
import toast from "react-hot-toast";
import { MOCK_CONTRACTS } from "../data/contracts.data";
import { Contract, WorkSession } from "../contract.types";

export function useContractDetails(contractId: string) {
  // Replace with actual API call later
  const initialContract = MOCK_CONTRACTS.find((c) => c.id === contractId) as Contract | undefined;

  const [contract, setContract] = useState<Contract | undefined>(initialContract);
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("الكل");

  const openAddSessionModal = () => setIsAddSessionModalOpen(true);
  const closeAddSessionModal = () => setIsAddSessionModalOpen(false);

  // Add session logic
  const handleAddSession = (hours: number, notes: string) => {
    if (!contract) return;
    
    // Create new session
    const newSession: WorkSession = {
      id: `ws-${Date.now()}`, // Temporary ID generator
      date: new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
      hours,
      notes,
      status: "قيد الانتظار"
    };

    const updatedContract = {
      ...contract,
      workSessions: contract.workSessions ? [newSession, ...contract.workSessions] : [newSession]
    };
    
    setContract(updatedContract);
    closeAddSessionModal();
    toast.success("تم إنشاء الجلسة بنجاح", { duration: 3000 });
  };

  // Filter sessions based on active tab
  let filteredSessions = contract?.workSessions || [];
  if (activeTab !== "الكل") {
    filteredSessions = filteredSessions.filter(session => session.status === activeTab);
  }

  return {
    contract,
    isAddSessionModalOpen,
    openAddSessionModal,
    closeAddSessionModal,
    handleAddSession,
    activeTab,
    setActiveTab,
    filteredSessions
  };
}
