"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileX, PlusCircle, Loader2, HelpCircle } from "lucide-react";
import { ContractStatus } from "@/src/features/contracts/contract.types";
import { ContractStatusTabs } from "@/src/features/contracts/components/ContractStatusTabs";
import { ContractCard } from "@/src/features/contracts/components/ContractCard";
import { ContractsHowItWorksReferenceSheet } from "@/src/features/contracts/components/ContractsHowItWorksReferenceSheet";
import { useInfiniteUserExchanges } from "@/src/features/profile/hooks/useInfiniteUserExchanges";
import { useIntersectionObserver } from "@/src/hooks/useIntersectionObserver";
import { CompletedContractsHeader } from "@/src/features/contracts/components/completed/CompletedContractsHeader";
import { CompletedStatsRow } from "@/src/features/contracts/components/completed/CompletedStatsRow";
import { CompletedContractCard } from "@/src/features/contracts/components/completed/CompletedContractCard";
import { useAcceptContract } from "@/src/features/contracts/hooks/useAcceptContract";
import { useRejectContract } from "@/src/features/contracts/hooks/useRejectContract";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { Exchange } from "@/src/features/profile/services/profileServices";
import toast from "react-hot-toast";

interface ContractsPageProps {
  onViewDetails?: (id: string) => void;
  onStatusChange?: (status: ContractStatus) => void;
}

function ContractsPageContent({
  onViewDetails,
  onStatusChange,
}: ContractsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const statusParam = searchParams.get("status");

  const [isReferenceOpen, setIsReferenceOpen] = useState(false);

  const activeTab = (tabParam === "pending" || tabParam === "active" || tabParam === "completed")
    ? (tabParam as ContractStatus)
    : "active";

  const [completedFilter, setCompletedFilter] = useState<string>("الكل");
  const [prevParams, setPrevParams] = useState({ activeTab, statusParam });

  if (prevParams.activeTab !== activeTab || prevParams.statusParam !== statusParam) {
    setPrevParams({ activeTab, statusParam });
    if (activeTab === "completed" && statusParam === "rejected") {
      setCompletedFilter("مرفوض");
    } else if (activeTab === "completed" && !statusParam) {
      setCompletedFilter("الكل");
    }
  }

  function handleTabChange(status: string) {
    router.push(`/my-contracts?tab=${status}`);
    onStatusChange?.(status as ContractStatus);
  }

  function handleViewDetails(id: string) {
    if (onViewDetails) {
      onViewDetails(id);
    } else {
      router.push(`/my-contracts/${id}`);
    }
  }

  const { data: currentUser } = useCurrentUser();
  const currentUserId = currentUser?.user?.userId;

  const { 
    data: infiniteData, 
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteUserExchanges();

  const userExchanges = useMemo(() => {
    if (!infiniteData) return [];
    return infiniteData.pages.flatMap((page) => page?.data || []);
  }, [infiniteData]);

  const [loadMoreRef, isIntersecting] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const acceptMutation = useAcceptContract();
  const rejectMutation = useRejectContract();

  const handleAcceptContract = async (id: string) => {
    try {
      await acceptMutation.mutateAsync(Number(id));
      toast.success("تم تفعيل العقد بنجاح!");
    } catch (error: unknown) {
      const err = error as Error & { response?: { status: number, data?: { message?: string } } };
      if (err?.response?.status === 400 && err?.response?.data?.message === "Requester no longer has enough time credits") {
        toast.error("لا يمكن تفعيل العقد لأن رصيد المستفيد غير كافي حالياً");
      } else {
        toast.error(err?.response?.data?.message || err?.message || "حدث خطأ غير متوقع");
      }
    }
  };

  const handleRejectContract = async (id: string) => {
    try {
      await rejectMutation.mutateAsync(Number(id));
      toast.success("تم رفض العقد.");
    } catch (error: unknown) {
      const err = error as Error & { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || err?.message || "حدث خطأ غير متوقع");
    }
  };

  const mappedContracts = useMemo(() => {
    if (!userExchanges) return [];
    return userExchanges.map((ex: Exchange) => ({
      id: ex.id.toString(),
      title: ex.post.title || "عقد خدمة",
      seekerName: ex.requester.full_name || ex.requester.username,
      providerName: ex.provider.full_name || ex.provider.username,
      serviceType: ex.post.category || "غير محدد",
      deliveryType: (ex.post.service_mode === "ONLINE" ? "أونلاين" : "حضوري") as "أونلاين" | "أوفلاين" | "حضوري",
      status: ex.status.toLowerCase() as ContractStatus,
      stats: {
        totalHours: ex.duration,
        completedHours: 0,
        remainingHours: ex.duration,
        endDate: new Date(ex.contractEndDate || ex.createdAt).toLocaleDateString("ar-EG", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        }),
      },
      providerId: ex.providerId,
      requesterId: ex.requesterId
    }));
  }, [userExchanges]);

  const filtered = useMemo(() => {
    if (activeTab === "pending") {
      return mappedContracts.filter((c) => c.status === "pending");
    }
    if (activeTab === "active") {
      return mappedContracts.filter((c) =>
        ["accepted", "in_progress", "waiting_confirmation"].includes(c.status)
      );
    }
    return [];
  }, [mappedContracts, activeTab]);

  const completedList = useMemo(() => {
    return mappedContracts.filter((c) => ["completed", "cancelled", "rejected", "disputed"].includes(c.status));
  }, [mappedContracts]);

  const filteredCompleted = useMemo(() => {
    if (completedFilter === "الكل") return completedList;

    let targetStatus = "";
    if (completedFilter === "انتهى بنجاح") targetStatus = "completed";
    else if (completedFilter === "انتهى بنزاع") targetStatus = "disputed";
    else if (completedFilter === "مرفوض") targetStatus = "rejected";
    else if (completedFilter === "ملغي") targetStatus = "cancelled";

    return completedList.filter(c => c.status === targetStatus);
  }, [completedList, completedFilter]);

  return (
    <div
      className="min-h-screen bg-neutral-50/40 px-4 md:px-8 lg:px-16 py-8"
      dir="rtl"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-neutral-900">ادارة العقود</h1>
          <button 
            onClick={() => setIsReferenceOpen(true)}
            className="flex items-center gap-2 text-sm font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 px-4 py-2.5 rounded-xl transition-colors w-fit"
          >
            <HelpCircle size={18} />
            <span>كيف يعمل نظام العقود في Wasla؟</span>
          </button>
        </div>
        <ContractStatusTabs active={activeTab} onChange={handleTabChange} />

        {activeTab === "completed" ? (
          <div className="mt-2 flex flex-col gap-8 animate-fade-in">
            <CompletedContractsHeader
              activeFilter={completedFilter}
              onFilterChange={setCompletedFilter}
            />
            <CompletedStatsRow contracts={completedList} />
            <div className="flex flex-col gap-6">
              {filteredCompleted.map((contract) => {
                const isProvider = String(currentUserId) === String(contract.providerId);
                const otherPartyName = isProvider ? contract.seekerName : contract.providerName;

                let mappedStatus: import("@/src/features/contracts/contract.types").CompletedContractStatus = "انتهى بنجاح";
                if (contract.status === "rejected") mappedStatus = "مرفوض";
                else if (contract.status === "cancelled") mappedStatus = "ملغي";
                else if (contract.status === "disputed") mappedStatus = "انتهى بنزاع";

                const completedContract: import("@/src/features/contracts/contract.types").CompletedContract = {
                  id: contract.id,
                  title: contract.title,
                  serviceDescription: isProvider ? "أنت مقدم الخدمة" : "أنت طالب الخدمة",
                  date: contract.stats?.endDate || "—",
                  durationText: `${contract.stats?.totalHours || 0} ساعة`,
                  otherPartyName,
                  otherPartyInitials: otherPartyName.substring(0, 2),
                  status: mappedStatus,
                  iconType: "code" as const,
                };

                return (
                  <CompletedContractCard
                    key={completedContract.id}
                    contract={completedContract}
                    onViewDetails={handleViewDetails}
                  />
                );
              })}
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
                    currentUserRole={String(currentUserId) === String(contract.providerId) ? "provider" : "seeker"}
                    onViewDetails={handleViewDetails}
                    onAccept={handleAcceptContract}
                    onReject={handleRejectContract}
                  />
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Infinite Scroll Sentinel */}
        <div ref={loadMoreRef} className="w-full py-8 flex flex-col items-center justify-center">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-neutral-500 text-sm font-bold animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
              <span>جاري تحميل المزيد من العقود...</span>
            </div>
          )}
        </div>
        
        <ContractsHowItWorksReferenceSheet 
          isOpen={isReferenceOpen} 
          onClose={() => setIsReferenceOpen(false)} 
        />
      </div>
    </div>
  );
}

export default function ContractsPage(props: ContractsPageProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ContractsPageContent {...props} />
    </Suspense>
  );
}