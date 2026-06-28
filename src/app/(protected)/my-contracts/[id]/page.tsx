"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";
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
import { ContractStatsRow } from "../../../../features/contracts/components/ContractStatsRow";
import { ContractActivityTimeline, TimelineEvent } from "@/src/features/contracts/components/ContractActivityTimeline";
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
import { useProposeDeadline } from "@/src/features/contracts/hooks/useProposeDeadline";
import { useApproveDeadline } from "@/src/features/contracts/hooks/useApproveDeadline";
import { useRejectDeadline } from "@/src/features/contracts/hooks/useRejectDeadline";
import { ProposeDeadlineModal } from "@/src/features/contracts/components/ProposeDeadlineModal";
import { useNotifications } from "@/src/features/notifications/hooks/useNotifications";

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
  const highlightParam = searchParams.get("highlight");
  const sessionsRef = useRef<HTMLDivElement>(null);
  const deadlineRef = useRef<HTMLDivElement>(null);

  const [isProposeDeadlineModalOpen, setIsProposeDeadlineModalOpen] = useState(false);

  useEffect(() => {
    if (highlightParam === "deadline" && deadlineRef.current) {
      setTimeout(() => {
        if (deadlineRef.current) {
          deadlineRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);
    }
  }, [highlightParam]);

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

  const proposeDeadlineMutation = useProposeDeadline(contract?.id);
  const approveDeadlineMutation = useApproveDeadline(contract?.id);
  const rejectDeadlineMutation = useRejectDeadline(contract?.id);

  const { notifications } = useNotifications();

  const deadlineApproachingNotification = notifications?.find((n) => {
    if (n.type !== "DEADLINE_APPROACHING") return false;

    let payloadData: Record<string, unknown> = {};
    if (typeof n.data === "string") {
      try {
        payloadData = JSON.parse(n.data);
      } catch {}
    } else if (n.data && typeof n.data === "object") {
      payloadData = n.data as Record<string, unknown>;
    }

    return String(payloadData.contractId) === String(contract?.id);
  });

  const sessionsList = sessionsData || [];

  const timelineEvents = useMemo(() => {
    if (!contract) return [];

    const events: TimelineEvent[] = [];
    const notifs = notifications || [];

    // --- 1. Contract Events (Canonical Sources) ---
    if (contract.createdAt) {
      events.push({
        id: `contract-created-${contract.id}`,
        type: "CONTRACT_CREATED",
        title: "تم إنشاء العقد",
        description: `عقد خدمة: ${contract.title}`,
        date: new Date(contract.createdAt)
      });
    }
    if (contract.acceptedAt) {
      events.push({
        id: `contract-accepted-${contract.id}`,
        type: "CONTRACT_ACCEPTED",
        title: "تم قبول العقد",
        description: "تمت الموافقة على بدء العقد من كلا الطرفين",
        date: new Date(contract.acceptedAt)
      });
    }
    if (contract.deliveredAt) {
      events.push({
        id: `contract-delivered-${contract.id}`,
        type: "CONTRACT_DELIVERED",
        title: "تم تسليم العقد",
        description: "تم تسليم الخدمة المطلوبة وإرسالها للمراجعة",
        date: new Date(contract.deliveredAt)
      });
    }
    if (contract.completedAt) {
      events.push({
        id: `contract-completed-${contract.id}`,
        type: "CONTRACT_COMPLETED",
        title: "تم إكمال العقد",
        description: "تم تأكيد اكتمال العقد واستلام الساعات بالكامل",
        date: new Date(contract.completedAt)
      });
    }
    if (contract.canceledAt) {
      events.push({
        id: `contract-canceled-${contract.id}`,
        type: "CONTRACT_CANCELED",
        title: "تم إلغاء العقد",
        description: "تم إلغاء عقد الخدمة",
        date: new Date(contract.canceledAt)
      });
    }

    // --- 2. Session Events ---
    sessionsList.forEach((session) => {
      const sessionNum = session.session_number || sessionsList.findIndex(s => s.id === session.id) + 1;
      const createdAtStr = session.created_at || session.createdAt || session.date;
      const confirmedAtStr = session.confirmed_at || (session as { confirmed_at?: string; confirmedAt?: string }).confirmedAt;

      // Session Recorded event
      if (createdAtStr) {
        events.push({
          id: `session-recorded-${session.id}`,
          type: "SESSION_RECORDED",
          title: `تم تسجيل جلسة عمل #${sessionNum}`,
          description: `تم تسجيل جلسة عمل بمقدار ${session.hours} ساعات. الملاحظات: ${session.notes || "لا توجد"}`,
          date: new Date(createdAtStr)
        });
      }

      // Session Confirmed event (if confirmed_at exists and session is CONFIRMED)
      const isConfirmed = session.status?.toUpperCase() === "CONFIRMED" || session.status === "مؤكدة";
      if (isConfirmed && confirmedAtStr) {
        events.push({
          id: `session-confirmed-${session.id}`,
          type: "SESSION_CONFIRMED",
          title: `تم اعتماد الجلسة #${sessionNum}`,
          description: "تمت الموافقة على الساعات المسجلة وتأكيدها",
          date: new Date(confirmedAtStr)
        });
      }

      // Session Rejected event (sourced from notification timestamp for SESSION_REJECTED)
      const isRejected = session.status?.toUpperCase() === "REJECTED" || session.status === "غير مؤكدة";
      if (isRejected) {
        const rejectNotif = notifs.find((n) => {
          if (n.type !== "SESSION_REJECTED") return false;
          let payloadData: { sessionId?: string | number; contractId?: string | number } = {};
          try {
            const parsed = typeof n.data === "string" ? JSON.parse(n.data) : n.data;
            if (parsed && typeof parsed === "object") {
              payloadData = parsed as { sessionId?: string | number; contractId?: string | number };
            }
          } catch {}
          return String(payloadData?.sessionId) === String(session.id) && String(payloadData?.contractId) === String(contract.id);
        });

        // Only add if we can find a notification timestamp for the rejection
        if (rejectNotif && rejectNotif.createdAt) {
          events.push({
            id: `session-rejected-${session.id}`,
            type: "SESSION_REJECTED",
            title: `تم رفض الجلسة #${sessionNum}`,
            description: rejectNotif.description || "تم رفض الجلسة المسجلة من قبل المستفيد",
            date: new Date(rejectNotif.createdAt)
          });
        }
      }
    });

    // --- 3. Notification-derived Events (Secondary fallback for non-canonical timeline entries) ---
    notifs.forEach((n) => {
      let payloadData: { contractId?: string | number } = {};
      try {
        const parsed = typeof n.data === "string" ? JSON.parse(n.data) : n.data;
        if (parsed && typeof parsed === "object") {
          payloadData = parsed as { contractId?: string | number };
        }
      } catch {}

      // Only match notifications for this specific contract
      if (String(payloadData?.contractId) !== String(contract.id)) return;

      const notifDate = n.createdAt ? new Date(n.createdAt) : null;
      if (!notifDate) return; // Ignore events without timestamps

      if (n.type === "DEADLINE_PROPOSED") {
        events.push({
          id: `deadline-proposed-${n.id}`,
          type: "DEADLINE_PROPOSED",
          title: "تم اقتراح تمديد الموعد النهائي",
          description: n.description || "تم تقديم اقتراح لتغيير تاريخ انتهاء العقد",
          date: notifDate
        });
      } else if (n.type === "DEADLINE_APPROVED") {
        events.push({
          id: `deadline-approved-${n.id}`,
          type: "DEADLINE_APPROVED",
          title: "تمت الموافقة على تمديد الموعد النهائي",
          description: n.description || "تمت الموافقة على تاريخ الانتهاء الجديد للعقد",
          date: notifDate
        });
      } else if (n.type === "DEADLINE_REJECTED") {
        events.push({
          id: `deadline-rejected-${n.id}`,
          type: "DEADLINE_REJECTED",
          title: "تم رفض تمديد الموعد النهائي",
          description: n.description || "تم رفض اقتراح تاريخ الانتهاء الجديد للعقد",
          date: notifDate
        });
      } else if (n.type === "EXCHANGE_REJECTED") {
        events.push({
          id: `contract-rejected-${n.id}`,
          type: "CONTRACT_REJECTED",
          title: "تم رفض العقد",
          description: n.description || "تم رفض العقد من قبل الطرف الآخر",
          date: notifDate
        });
      } else if (n.type === "EXCHANGE_ACCEPTED" && !contract.acceptedAt) {
        events.push({
          id: `contract-accepted-notif-${n.id}`,
          type: "CONTRACT_ACCEPTED",
          title: "تم قبول العقد",
          description: n.description || "تمت الموافقة على بدء العقد من كلا الطرفين",
          date: notifDate
        });
      } else if (n.type === "EXCHANGE_CANCELED" && !contract.canceledAt) {
        events.push({
          id: `contract-canceled-notif-${n.id}`,
          type: "CONTRACT_CANCELED",
          title: "تم إلغاء العقد",
          description: n.description || "تم إلغاء عقد الخدمة",
          date: notifDate
        });
      } else if (n.type === "EXCHANGE_COMPLETED" && !contract.completedAt) {
        events.push({
          id: `contract-completed-notif-${n.id}`,
          type: "CONTRACT_COMPLETED",
          title: "تم إكمال العقد",
          description: n.description || "تم تأكيد اكتمال العقد واستلام الساعات بالكامل",
          date: notifDate
        });
      } else if (n.type === "EXCHANGE_REQUESTED" && !contract.createdAt) {
        events.push({
          id: `contract-created-notif-${n.id}`,
          type: "CONTRACT_CREATED",
          title: "تم إنشاء العقد",
          description: n.description || `عقد خدمة: ${contract.title}`,
          date: notifDate
        });
      }
    });

    // Deduplicate by ID to prevent any duplicate issues
    const uniqueEvents = Array.from(new Map(events.map(item => [item.id, item])).values());

    // Sort descending by event timestamp. Events without timestamps are ignored.
    return uniqueEvents
      .filter(e => e.date instanceof Date && !isNaN(e.date.getTime()))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [contract, sessionsList, notifications]);

  const completedHours = sessionsList
    .filter((s) => s.status.toUpperCase() === "CONFIRMED" || s.status === "مؤكدة")
    .reduce((acc, s) => acc + Number(s.hours), 0);

  const totalHours = contract?.stats?.totalHours || 0;
  const remainingHours = Math.max(0, totalHours - completedHours);

  const computedStats = contract?.stats ? {
    ...contract.stats,
    completedHours,
    remainingHours,
  } : undefined;

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

    const sessionToConfirm = sessionsList.find((s) => String(s.id) === String(sessionId));
    const sessionHours = sessionToConfirm ? Number(sessionToConfirm.hours) : 0;
    const contractHours = contract?.stats?.totalHours || 0;

    if (completedHours + sessionHours > contractHours) {
      toast.error(
        `لا يمكن تأكيد الجلسة. مجموع ساعات الجلسات المؤكدة مسبقاً (${completedHours} ساعة) مع ساعات الجلسة الحالية (${sessionHours} ساعة) يتجاوز الساعات الإجمالية للعقد (${contractHours} ساعة).`
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

  const normalizedStatus = contract?.status?.toUpperCase() || "";
  const isExpired = normalizedStatus === "EXPIRED" || (contract?.status as string) === "منتهي";
  const isArchived = ["COMPLETED", "مكتمل", "مكتملة", "DISPUTED", "انتهى بنزاع", "CANCELED", "ملغي", "REJECTED", "مرفوض", "EXPIRED", "منتهي"].includes(normalizedStatus) || isExpired;
  const hasPendingProposal = 
    (!!contract?.proposedEndDate || proposeDeadlineMutation.isPending) && 
    !isArchived;

  const canEditDeadline = 
    isProvider && 
    (normalizedStatus === "IN_PROGRESS" || normalizedStatus === "WAITING_CONFIRMATION") && 
    !hasPendingProposal && !isArchived;

  const handleProposeDeadlineSubmit = async (proposedEndDate: string) => {
    try {
      await proposeDeadlineMutation.mutateAsync(proposedEndDate);
      setIsProposeDeadlineModalOpen(false);
    } catch (e) {
      // Handled inside hook
    }
  };

  const handleApproveDeadline = async () => {
    try {
      await approveDeadlineMutation.mutateAsync();
    } catch (e) {
      // Handled inside hook
    }
  };

  const handleRejectDeadline = async () => {
    try {
      await rejectDeadlineMutation.mutateAsync();
    } catch (e) {
      // Handled inside hook
    }
  };

  const handleAddSessionSubmit = async (hours: number, notes: string) => {
    const contractHours = contract?.stats?.totalHours || 0;

    if (completedHours + hours > contractHours) {
      toast.error(
        `لا يمكن إنشاء الجلسة. مجموع ساعات الجلسات المؤكدة (${completedHours} ساعة) مع الجلسة الجديدة (${hours} ساعة) يتجاوز الساعات الإجمالية للعقد (${contractHours} ساعة).`
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
              {isProvider && !isArchived && (
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
                <h2 className="text-xl font-bold text-neutral-900 leading-snug flex items-center flex-wrap gap-2">
                  {contract.title}
                  {isArchived && (
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                      {contract.status}
                    </span>
                  )}
                </h2>
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
            {canEditDeadline && (
              <button 
                onClick={() => setIsProposeDeadlineModalOpen(true)}
                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 shadow-sm active:scale-95 transition-all"
                title="تعديل تاريخ الانتهاء"
              >
                <Pencil size={16} />
              </button>
            )}
          </div>

          {/* ─── Warning Banner for Approaching Deadline ─── */}
          {deadlineApproachingNotification && !isArchived && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3 animate-in fade-in duration-300">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <div className="space-y-1">
                <h4 className="font-bold text-red-900 text-sm">
                  {deadlineApproachingNotification.title || "اقترب موعد انتهاء العقد"}
                </h4>
                <p className="text-xs text-red-700 leading-relaxed">
                  {deadlineApproachingNotification.description}
                </p>
              </div>
            </div>
          )}

          {/* ─── Action Banners for Deadline Proposals ─── */}
          {hasPendingProposal && (
            <div className="animate-in fade-in duration-300">
              {isSeeker ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                    <div className="space-y-1">
                      <h4 className="font-bold text-amber-900 text-sm">طلب تعديل تاريخ الانتهاء</h4>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        اقترح مقدم الخدمة (<span className="font-bold">{contract.providerName}</span>) تاريخ انتهاء جديد للعقد:{" "}
                        <span className="font-black text-amber-900">
                          {contract.stats?.proposedEndDate || (proposeDeadlineMutation.isPending ? "قيد المعالجة..." : "")}
                        </span>{" "}
                        بدلاً من التاريخ الحالي: <span className="font-bold">{contract.stats?.endDate}</span>.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                    <button
                      onClick={handleRejectDeadline}
                      disabled={rejectDeadlineMutation.isPending || approveDeadlineMutation.isPending}
                      className="px-5 py-2 border border-red-200 bg-white hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold transition-all disabled:opacity-50 active:scale-95 shrink-0"
                    >
                      {rejectDeadlineMutation.isPending ? "جاري الرفض..." : "رفض المقترح"}
                    </button>
                    <button
                      onClick={handleApproveDeadline}
                      disabled={rejectDeadlineMutation.isPending || approveDeadlineMutation.isPending}
                      className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50 active:scale-95 shrink-0"
                    >
                      {approveDeadlineMutation.isPending ? "جاري القبول..." : "قبول وتحديث التاريخ"}
                    </button>
                  </div>
                </div>
              ) : isProvider ? (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-3">
                  <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                  <div className="space-y-1">
                    <h4 className="font-bold text-blue-900 text-sm">مقترح تعديل تاريخ الانتهاء قيد الانتظار</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      لقد اقترحت تاريخ انتهاء جديد للعقد:{" "}
                      <span className="font-black text-blue-900">
                        {contract.stats?.proposedEndDate || (proposeDeadlineMutation.isPending ? "قيد المعالجة..." : "")}
                      </span>. بانتظار موافقة المستفيد (<span className="font-bold">{contract.seekerName}</span>).
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* ─── Render Extracted Stats Grid Row ─── */}
          <ContractStatsRow 
            stats={computedStats} 
            highlight={highlightParam === "deadline" && hasPendingProposal}
            deadlineRef={deadlineRef}
          />

          {/* ─── Dynamic Log & Sessions Layout Grid ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-6 items-stretch mt-8">
            
            {/* Operation Logs Sidebar Container (Right side in RTL, bottom on mobile) */}
            <div className="order-2 lg:order-1 bg-neutral-50 rounded-2xl p-6 shadow-sm flex flex-col gap-5 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3">سجل العمليات</h3>
              <ContractActivityTimeline events={timelineEvents} />
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
                isArchived={isArchived}
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
          remainingHours={remainingHours}
          contractStatus={contract.status}
        />
      )}

      {/* Propose Deadline Modal */}
      {contract && (
        <ProposeDeadlineModal
          isOpen={isProposeDeadlineModalOpen}
          onClose={() => setIsProposeDeadlineModalOpen(false)}
          onSubmit={handleProposeDeadlineSubmit}
          isSubmitting={proposeDeadlineMutation.isPending}
          currentEndDate={contract.stats?.endDate || ""}
          seekerName={contract.seekerName}
          contractStatus={contract.status}
        />
      )}
    </>
  );
}