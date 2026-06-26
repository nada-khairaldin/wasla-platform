"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FileX, PlusCircle } from "lucide-react"; 
import { ContractStatus } from "@/src/features/contracts/contract.types";
import { ContractStatusTabs } from "@/src/features/contracts/components/ContractStatusTabs";
import { ContractCard } from "@/src/features/contracts/components/ContractCard";
import { MOCK_CONTRACTS } from "@/src/features/contracts/data/contracts.data";
import { CompletedContractsHeader } from "@/src/features/contracts/components/completed/CompletedContractsHeader";
import { CompletedStatsRow } from "@/src/features/contracts/components/completed/CompletedStatsRow";
import { CompletedContractCard } from "@/src/features/contracts/components/completed/CompletedContractCard";
import { COMPLETED_MOCK_CONTRACTS } from "@/src/features/contracts/data/completed-contracts.data";

interface ContractsPageProps {
  contracts?: typeof MOCK_CONTRACTS;
  onViewDetails?: (id: string) => void;
  onStatusChange?: (status: ContractStatus) => void;
}

export default function ContractsPage({
  contracts = MOCK_CONTRACTS,
  onViewDetails,
  onStatusChange,
}: ContractsPageProps) {
  const router = useRouter(); 
  const [activeTab, setActiveTab] = useState<ContractStatus>("active");
  const [completedFilter, setCompletedFilter] = useState<string>("الكل");

  function handleTabChange(status: string) {
    setActiveTab(status as ContractStatus);
    onStatusChange?.(status as ContractStatus);
  }

  function handleViewDetails(id: string) {
    if (onViewDetails) {
      onViewDetails(id);
    } else {
      router.push(`/my-contracts/${id}`);
    }
  }

  const handleAcceptContract = (id: string) => {
    console.log("Contract Accepted:", id);
  };

  const handleRejectContract = (id: string) => {
    console.log("Contract Rejected:", id);
  };

  const filtered = useMemo(
    () => contracts.filter((c) => c.status === activeTab),
    [contracts, activeTab],
  );

  const filteredCompleted = useMemo(() => {
    if (completedFilter === "الكل") return COMPLETED_MOCK_CONTRACTS;
    return COMPLETED_MOCK_CONTRACTS.filter(c => c.status === completedFilter);
  }, [completedFilter]);

  return (
    <div
      className="min-h-screen bg-neutral-50/40 px-4 md:px-8 lg:px-16 py-8"
      dir="rtl"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-neutral-900">ادارة العقود</h1>
        <ContractStatusTabs active={activeTab} onChange={handleTabChange} />

        {activeTab === "completed" ? (
          <div className="mt-2 flex flex-col gap-8 animate-fade-in">
            <CompletedContractsHeader 
              activeFilter={completedFilter} 
              onFilterChange={setCompletedFilter} 
            />
            <CompletedStatsRow />
            <div className="flex flex-col gap-6">
              {filteredCompleted.map((contract) => (
                <CompletedContractCard 
                  key={contract.id} 
                  contract={contract} 
                  onViewDetails={handleViewDetails}
                />
              ))}
              {filteredCompleted.length === 0 && (
                <div className="text-center py-12 text-neutral-400 font-medium bg-white rounded-2xl border border-neutral-100/50 shadow-sm">
                  لا توجد عقود مطابقة للفلتر المحدد.
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {filtered.length === 0 ? (
              /* ─── Empty State UI ─── */
              <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white border border-neutral-100/80 rounded-2xl shadow-sm max-w-2xl mx-auto w-full mt-4 animate-fade-in">
                <div className="p-4 bg-neutral-50 rounded-full text-neutral-400 mb-4 group-hover:scale-110 transition-transform duration-200">
                  <FileX size={40} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-lg font-bold text-neutral-800 mb-1">
                  {activeTab === "active" ? "لا توجد عقود نشطة حالياً" : "قائمة الانتظار فارغة"}
                </h3>
                
                <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                  {activeTab === "active" 
                    ? "لم تقم ببدء أي عقد بعد. يمكنك تصفح المنشورات والخدمات المتاحة لبدء تبادل الساعات الفعلي."
                    : "كل الطلبات الحالية تمت معالجتها بنجاح! لا توجد عقود معلقة بانتظار الإجراء."
                  }
                </p>

                <button
                  onClick={() => router.push("/home")}
                  className="flex items-center gap-2 py-2.5 px-5 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600 active:scale-[0.98] transition-all duration-150 shadow-sm"
                >
                  <PlusCircle size={16} />
                  <span>تصفح الخدمات والمنشورات</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-fade-in">
                {filtered.map((contract) => (
                  <ContractCard
                    key={contract.id}
                    contract={contract}
                    currentUserRole="provider"
                    onViewDetails={handleViewDetails}
                    onAccept={handleAcceptContract}
                    onReject={handleRejectContract}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div> 
    </div>
  );
}