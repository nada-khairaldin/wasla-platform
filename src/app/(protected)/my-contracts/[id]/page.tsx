"use client";

import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  FilePlus, 
  Pencil, 
  Briefcase 
} from "lucide-react";
import { OperationLogEntry } from "@/src/features/contracts/contract.types";
import { ContractStatsRow } from "../../../../features/contracts/components/ContractStatsRow";
import { useContractDetails } from "@/src/features/contracts/hooks/useContractDetails";
import { WorkSessionsList } from "@/src/features/contracts/components/WorkSessionsList";
import { AddSessionModal } from "@/src/features/contracts/components/AddSessionModal";

export default function ContractDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params.id as string;

  const {
    contract,
    isAddSessionModalOpen,
    openAddSessionModal,
    closeAddSessionModal,
    handleAddSession,
    activeTab,
    setActiveTab,
    filteredSessions
  } = useContractDetails(contractId);

  // --- Error Handling: Contract Not Found ---
  if (!contract) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50/40 p-4 text-right">
        <p className="text-lg font-bold text-neutral-500 mb-4">العقد المطلوب غير موجود أو تم حذفه.</p>
        <button 
          onClick={() => router.push("/my-contracts")}
          className="px-6 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-primary-600 active:scale-95 transition-all"
        >
          العودة لقائمة العقود
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white text-right" dir="rtl">
        {/* ─── Main Content Container ─── */}
        <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 space-y-8">
          
          {/* ─── Header Section ─── */}
          <div className="flex flex-col gap-2 items-start">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-primary-500 transition-colors"
            >
              <ChevronLeft size={14} /> العودة لقائمة العقود
            </button>
            <div className="flex flex-col md:flex-row md:items-center justify-between w-full mt-6 gap-4">
              <h1 className="text-3xl md:text-h3 font-black text-neutral-900">تفاصيل العقد</h1>
              <button 
                onClick={openAddSessionModal}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 active:scale-95 transition-all shadow-sm w-full md:w-auto"
              >
                <FilePlus size={16} /> اضافة جلسة عمل
              </button>
            </div>
          </div>

          {/* ─── Contract Overview Banner Card ─── */}
          <div className="bg-neutral-50 rounded-2xl p-6 shadow-sm flex items-center gap-5 justify-between mt-6">
            <div className="flex items-center gap-5 flex-1 min-w-0">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-neutral-900 leading-snug">{contract.title}</h2>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-neutral-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Briefcase size={13} className="text-neutral-300"/> مجال الخدمة:
                    <span className="font-bold text-neutral-600">{contract.serviceType}</span>
                  </span>
                  <span>المزود: <span className="font-bold text-neutral-600">{contract.providerName}</span></span>
                  <span>المستفيد: <span className="font-bold text-neutral-600">{contract.seekerName}</span></span>
                </div>
              </div>
            </div>
            <button className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-all ">
              <Pencil size={16} />
            </button>
          </div>

          {/* ─── Render Extracted Stats Grid Row ─── */}
          <ContractStatsRow stats={contract.stats} />

          {/* ─── Dynamic Log & Sessions Layout Grid ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-6 items-stretch mt-8">
            
            {/* Operation Logs Sidebar Container (Right side in RTL, bottom on mobile) */}
            <div className="order-2 lg:order-1 bg-neutral-50 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
              <h3 className="font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3">سجل العمليات</h3>
              <div className="flex-1 flex flex-col gap-4 max-h-[380px] overflow-y-auto pl-1">
                {contract.operationLogs?.map((log: OperationLogEntry) => (
                  <div key={log.id} className="flex gap-3 relative pb-4 text-right">
                    <div className="w-3.5 h-3.5 rounded-full bg-primary-50 border-2 border-primary-400 mt-0.5 shrink-0 z-10" />
                    <div className="absolute top-4 right-[6.5px] w-px h-[calc(100%-8px)] bg-neutral-100" />
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-bold text-neutral-800 truncate">{log.title}</p>
                      <p className="text-[10px] font-medium text-neutral-400">{log.byLine}</p>
                      {log.description && <p className="text-[11px] text-neutral-500 pt-0.5 leading-relaxed">{log.description}</p>}
                    </div>
                  </div>
                ))}
                
                {(!contract.operationLogs || contract.operationLogs.length === 0) && (
                  <p className="text-center text-sm text-neutral-500 py-4">لا توجد عمليات مسجلة.</p>
                )}
              </div>
            </div>

            {/* Work Sessions Data Table Container (Left side in RTL, top on mobile) */}
          <div className="order-1 lg:order-2 bg-neutral-50 rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[400px]">
            <WorkSessionsList 
              sessions={filteredSessions} 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              contractId={contract.id}
            />
          </div>

          </div>
        </main>
      </div>

      {/* Add Session Modal */}
      <AddSessionModal 
        isOpen={isAddSessionModalOpen}
        onClose={closeAddSessionModal}
        onSubmit={handleAddSession}
      />
    </>
  );
}