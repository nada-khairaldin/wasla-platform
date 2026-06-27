"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ContractStatusTabs } from "@/src/features/contracts/components/ContractStatusTabs";
import { CompletedContractsHeader } from "@/src/features/contracts/components/completed/CompletedContractsHeader";
import { CompletedStatsRow } from "@/src/features/contracts/components/completed/CompletedStatsRow";
import { CompletedContractCard } from "@/src/features/contracts/components/completed/CompletedContractCard";
import { COMPLETED_MOCK_CONTRACTS } from "@/src/features/contracts/data/completed-contracts.data";
import { ContractStatus, Contract } from "@/src/features/contracts/contract.types";

export default function CompletedContractsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContractStatus>("completed");
  const [activeFilter, setActiveFilter] = useState<string>("الكل");

  const handleTabChange = (status: string) => {
    setActiveTab(status as ContractStatus);
  };

  const handleViewDetails = (id: string) => {
    // Navigate to contract details page. Even if completed, they have a details page.
    router.push(`/my-contracts/${id}`);
  };

  const filteredContracts = useMemo(() => {
    if (activeFilter === "الكل") return COMPLETED_MOCK_CONTRACTS;
    return COMPLETED_MOCK_CONTRACTS.filter(c => c.status === activeFilter);
  }, [activeFilter]);

  return (
    <div
      className="min-h-screen bg-neutral-50/40 px-4 md:px-8 lg:px-16 py-8"
      dir="rtl"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-neutral-900">ادارة العقود</h1>
        
        {/* Main Status Tabs */}
        <ContractStatusTabs active={activeTab} onChange={handleTabChange} />

        <div className="mt-4 flex flex-col gap-8">
          {/* Header & Filters */}
          <CompletedContractsHeader 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />

          {/* Stats Row */}
          <CompletedStatsRow contracts={filteredContracts} />

          {/* Contracts List Header */}
          <h2 className="text-xl font-bold text-neutral-800 mt-2">قائمة العقود المنتهية</h2>

          {/* Contracts List */}
          <div className="flex flex-col gap-4">
            {filteredContracts.map((contract) => (
              <CompletedContractCard 
                key={contract.id} 
                contract={contract} 
              />
            ))}

            {filteredContracts.length === 0 && (
              <div className="text-center py-12 text-neutral-400 font-medium bg-white rounded-2xl border border-neutral-100 shadow-sm">
                لا توجد عقود مطابقة للفلتر المحدد.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
