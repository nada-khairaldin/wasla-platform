"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { 
  ChevronLeft, 
  FilePlus, 
  Pencil, 
  Briefcase,
  AlertCircle,
  RefreshCw,
  Ban
} from "lucide-react";
import { motion } from "framer-motion";
import { OperationLogEntry } from "@/src/features/contracts/contract.types";
import { ContractStatsRow } from "../../../../features/contracts/components/ContractStatsRow";
import { useContractDetails } from "@/src/features/contracts/hooks/useContractDetails";
import { WorkSessionsList } from "@/src/features/contracts/components/WorkSessionsList";
import { AddSessionModal } from "@/src/features/contracts/components/AddSessionModal";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { useContractSessions } from "@/src/features/contracts/hooks/useContractSessions";
import { useCreateSession } from "@/src/features/contracts/hooks/useCreateSession";
import { useConfirmSession } from "@/src/features/contracts/hooks/useConfirmSession";
import { useRejectSession } from "@/src/features/contracts/hooks/useRejectSession";
import { WorkSession } from "@/src/features/contracts/contract.types";
import toast from "react-hot-toast";

export default function ContractDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const contractId = params.id as string;

  const {
    contract,
    isLoading,
    isError,
    error,
    refetch,
    isAddSessionModalOpen,
    openAddSessionModal,
    closeAddSessionModal,
    activeTab,
    setActiveTab,
  } = useContractDetails(contractId);

  const tabParam = searchParams.get("tab");
  const statusParam = searchParams.get("status");
  const sessionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabParam === "sessions" && statusParam === "pending") {
      setActiveTab("pending");
      setTimeout(() => {
        sessionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } else if (tabParam === "active") {
      setActiveTab("all");
    } else if (tabParam === "completed") {
      setActiveTab("confirmed");
    } else if (statusParam === "pending") {
      setActiveTab("pending");
    }
  }, [tabParam, statusParam, setActiveTab]);

  const { data: currentUser } = useCurrentUser();
  const { data: sessionsData, isLoading: isSessionsLoading } = useContractSessions(contract?.id);
  const createSessionMutation = useCreateSession(contract?.id);
  const confirmMutation = useConfirmSession(contract?.id);
  const rejectMutation = useRejectSession(contract?.id);

  const isSeeker = Boolean(
    currentUser?.user?.userId && 
    contract?.requesterId && 
    Number(currentUser.user.userId) === Number(contract.requesterId)
  );

  const handleConfirmSession = async (sessionId: string | number) => {
    const status = contract?.status?.toUpperCase();
    if (status !== "ACTIVE" && status !== "ACCEPTED" && status !== "IN_PROGRESS") {
      toast.error("هذا العقد غير نشط");
      return;
    }

    const sessionsList = sessionsData || [];
    const sessionToConfirm = sessionsList.find((s) => String(s.id) === String(sessionId));
    const confirmedHoursSum = sessionsList
      .filter((s) => s.status.toUpperCase() === "CONFIRMED" || s.status === "مؤكدة")
      .reduce((acc, s) => acc + Number(s.hours), 0);
    const sessionHours = sessionToConfirm ? Number(sessionToConfirm.hours) : 0;
    const contractHours = contract?.stats?.totalHours || 0;

    if (confirmedHoursSum + sessionHours > contractHours) {
      toast.error(
        `لا يمكن تأكيد الجلسة. مجموع ساعات الجلسات المؤكدة مسبقاً (${confirmedHoursSum} ساعة) مع ساعات الجلسة الحالية (${sessionHours} ساعة) يتجاوز الساعات الإجمالية للعقد (${contractHours} ساعة).`
      );
      return;
    }

    try {
      await confirmMutation.mutateAsync(sessionId);
    } catch (e) {
      // Handled inside hook
    }
  };

  const handleRejectSession = async (sessionId: string | number) => {
    const status = contract?.status?.toUpperCase();
    if (status !== "ACTIVE" && status !== "ACCEPTED" && status !== "IN_PROGRESS") {
      toast.error("هذا العقد غير نشط");
      return;
    }
    try {
      await rejectMutation.mutateAsync(sessionId);
    } catch (e) {
      // Handled inside hook
    }
  };

  const isProvider = Boolean(
    currentUser?.user?.userId && 
    contract?.providerId && 
    Number(currentUser.user.userId) === Number(contract.providerId)
  );

  const handleAddSessionSubmit = async (hours: number, notes: string) => {
    const sessionsList = sessionsData || [];
    const confirmedHoursSum = sessionsList
      .filter((s) => s.status.toUpperCase() === "CONFIRMED" || s.status === "مؤكدة")
      .reduce((acc, s) => acc + Number(s.hours), 0);
    const contractHours = contract?.stats?.totalHours || 0;

    if (confirmedHoursSum + hours > contractHours) {
      toast.error(
        `لا يمكن إنشاء الجلسة. مجموع ساعات الجلسات المؤكدة (${confirmedHoursSum} ساعة) مع الجلسة الجديدة (${hours} ساعة) يتجاوز الساعات الإجمالية للعقد (${contractHours} ساعة).`
      );
      return;
    }

    try {
      await createSessionMutation.mutateAsync({ hours, notes });
      toast.success("تم إنشاء الجلسة بنجاح");
      closeAddSessionModal();
    } catch (err) {
      // Error is handled in the mutation hook (toast)
    }
  };

  const sessions: WorkSession[] = sessionsData || [];
  let filteredSessions = sessions;
  if (activeTab !== "all") {
    filteredSessions = sessions.filter((session) => {
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

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-right p-8 animate-pulse" dir="rtl">
        <div className="max-w-[1440px] mx-auto space-y-8">
          <div className="w-48 h-4 bg-neutral-200 rounded"></div>
          <div className="w-1/3 h-10 bg-neutral-200 rounded"></div>
          <div className="w-full h-32 bg-neutral-100 rounded-2xl mt-6"></div>
          <div className="flex gap-6 mt-8">
            <div className="w-1/4 h-32 bg-neutral-100 rounded-2xl"></div>
            <div className="w-1/4 h-32 bg-neutral-100 rounded-2xl"></div>
            <div className="w-1/4 h-32 bg-neutral-100 rounded-2xl"></div>
            <div className="w-1/4 h-32 bg-neutral-100 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // --- Error Handling ---
  if (isError || !contract) {
    const err = error as Error & { response?: { status: number, data?: { message?: string } } };
    const status = err?.response?.status;
    const isNotFound = status === 404 || (!contract && !isError);
    const isForbidden = status === 403;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50/40 p-4 text-center text-right" dir="rtl">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isNotFound ? 'bg-neutral-100 text-neutral-400' : isForbidden ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-500'}`}>
          {isNotFound ? <FilePlus size={32} /> : isForbidden ? <Ban size={32} /> : <AlertCircle size={32} />}
        </div>
        <h3 className={`text-xl font-black mb-2 ${isNotFound ? 'text-neutral-700' : isForbidden ? 'text-orange-600' : 'text-red-600'}`}>
          {isNotFound ? "العقد المطلوب غير موجود" : isForbidden ? "غير مصرح لك بالوصول" : "تعذر تحميل بيانات العقد"}
        </h3>
        <p className="text-neutral-500 text-sm mb-6 max-w-[300px]">
          {isNotFound 
            ? "يبدو أن العقد قد تم حذفه أو أن الرابط غير صحيح." 
            : isForbidden 
            ? "ليس لديك صلاحية لمشاهدة تفاصيل هذا العقد." 
            : "حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى."}
        </p>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/my-contracts")}
            className="px-6 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-sm font-bold hover:bg-neutral-200 active:scale-95 transition-all"
          >
            العودة لقائمة العقود
          </button>
          {!isNotFound && !isForbidden && (
            <button 
              onClick={() => refetch()}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-primary-600 active:scale-95 transition-all"
            >
              <RefreshCw size={16} />
              إعادة المحاولة
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white text-right" dir="rtl">
        {/* ─── Main Content Container ─── */}
        <motion.main 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 space-y-8"
        >
          
          {/* ─── Header Section ─── */}
          <div className="flex flex-col gap-2 items-start">
            <button 
              onClick={() => router.push("/my-contracts")} 
              className="flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-primary-500 transition-colors"
            >
              <ChevronLeft size={14} /> العودة لقائمة العقود
            </button>
            <div className="flex flex-col md:flex-row md:items-center justify-between w-full mt-6 gap-4">
              <h1 className="text-3xl md:text-h3 font-black text-neutral-900">تفاصيل العقد</h1>
              {isProvider && (
                <button 
                  onClick={openAddSessionModal}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 active:scale-95 transition-all shadow-sm w-full md:w-auto"
                >
                  <FilePlus size={16} /> اضافة جلسة عمل
                </button>
              )}
            </div>
          </div>

          {/* ─── Contract Overview Banner Card ─── */}
          <div className="bg-neutral-50 rounded-2xl p-6 shadow-sm flex items-center gap-5 justify-between mt-6 hover:shadow-md transition-shadow">
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
            <button className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 shadow-sm active:scale-95 transition-all ">
              <Pencil size={16} />
            </button>
          </div>

          {/* ─── Render Extracted Stats Grid Row ─── */}
          <ContractStatsRow stats={contract.stats} />

          {/* ─── Dynamic Log & Sessions Layout Grid ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-6 items-stretch mt-8">
            
            {/* Operation Logs Sidebar Container (Right side in RTL, bottom on mobile) */}
            <div className="order-2 lg:order-1 bg-neutral-50 rounded-2xl p-6 shadow-sm flex flex-col gap-5 hover:shadow-md transition-shadow">
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
          <div ref={sessionsRef} className="order-1 lg:order-2 bg-neutral-50 rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[400px] hover:shadow-md transition-shadow">
            {isSessionsLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="w-1/3 h-8 bg-neutral-200 rounded"></div>
                <div className="w-full h-12 bg-neutral-200 rounded mt-6"></div>
                <div className="w-full h-12 bg-neutral-200 rounded"></div>
              </div>
            ) : (
              <WorkSessionsList 
                sessions={filteredSessions} 
                activeTab={activeTab} 
                onTabChange={setActiveTab}
                contractId={contract.id}
                isSeeker={isSeeker}
                onConfirm={handleConfirmSession}
                onReject={handleRejectSession}
                isConfirming={confirmMutation.isPending}
                isRejecting={rejectMutation.isPending}
              />
            )}
          </div>

          </div>
        </motion.main>
      </div>

      {/* Add Session Modal */}
      {contract && (
        <AddSessionModal 
          isOpen={isAddSessionModalOpen}
          onClose={closeAddSessionModal}
          onSubmit={handleAddSessionSubmit}
          isSubmitting={createSessionMutation.isPending}
          remainingHours={contract.stats?.remainingHours || 0}
          contractStatus={contract.status}
        />
      )}
    </>
  );
}