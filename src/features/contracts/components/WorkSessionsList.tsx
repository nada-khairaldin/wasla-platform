import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Filter, Check } from "lucide-react";
import { WorkSession } from "../contract.types";

interface Tab {
  key: string;
  label: string;
}

const TABS: readonly Tab[] = [
  { key: "all", label: "الكل" },
  { key: "confirmed", label: "المؤكدة" },
  { key: "rejected", label: "غير مؤكدة" },
  { key: "pending", label: "قيد الانتظار" },
] as const;

interface WorkSessionsListProps {
  sessions: WorkSession[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  contractId: string;
  isSeeker?: boolean;
  onConfirm?: (sessionId: string | number) => void;
  onReject?: (sessionId: string | number) => void;
  isConfirming?: boolean;
  isRejecting?: boolean;
}
const ITEMS_PER_PAGE = 4;
type PaginationToken = number | "dots";

function getSmartPaginationTokens(currentPage: number, totalPages: number): PaginationToken[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages]);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page > 1 && page < totalPages) {
      pages.add(page);
    }
  }

  if (currentPage <= 3) {
    for (let page = 2; page <= Math.min(4, totalPages - 1); page += 1) {
      pages.add(page);
    }
  }

  if (currentPage >= totalPages - 2) {
    for (let page = Math.max(2, totalPages - 3); page <= totalPages - 1; page += 1) {
      pages.add(page);
    }
  }

  const sortedPages = [...pages].sort((a, b) => a - b);
  const tokens: PaginationToken[] = [];

  sortedPages.forEach((page, index) => {
    if (index > 0 && page - sortedPages[index - 1] > 1) {
      tokens.push("dots");
    }
    tokens.push(page);
  });

  return tokens;
}

export function WorkSessionsList({ 
  sessions, 
  activeTab, 
  onTabChange, 
  contractId, 
  isSeeker, 
  onConfirm, 
  onReject, 
  isConfirming, 
  isRejecting 
}: WorkSessionsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset pagination when tab changes
  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(sessions.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSessions = sessions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const paginationTokens = getSmartPaginationTokens(currentPage, totalPages);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToPage = (page: number) => setCurrentPage(page);

  // Determine styles for status
  const getStatusStyles = (status: string) => {
    const s = status.toUpperCase();
    if (s === "CONFIRMED" || status === "مؤكدة") {
      return "text-[#079455] bg-[#ebfbf3]";
    }
    if (s === "REJECTED" || status === "غير مؤكدة") {
      return "text-[#d92d20] bg-[#fef3f2]";
    }
    if (s === "PENDING_CONFIRMATION" || s === "PENDING" || status === "قيد الانتظار") {
      return "text-[#f79009] bg-[#fff8ea]";
    }
    return "text-neutral-500 bg-neutral-100";
  };

  return (
    <div className="flex flex-col h-full gap-6 w-full text-right" dir="rtl">
      {/* Header section & Mobile Filter */}
      <div className="flex items-start justify-between gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black text-neutral-900">جلسات العمل</h2>
          <p className="text-sm font-medium text-neutral-500">
            إدارة عقود تبادل المهارات وجلسات العمل النشطة
          </p>
        </div>
        
        {/* Mobile Filter Button */}
        <div className="md:hidden relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
              isFilterOpen ? "bg-[#215077] text-white" : "bg-white border border-neutral-200 text-neutral-600 shadow-sm hover:bg-neutral-50"
            }`}
          >
            <Filter size={18} />
          </button>
          
          {isFilterOpen && (
            <div className="absolute top-12 left-0 w-52 bg-white rounded-xl shadow-xl border border-neutral-100 z-20 py-2 flex flex-col overflow-hidden">
              <div className="px-4 py-2.5 text-[11px] font-bold text-neutral-400 border-b border-neutral-50 mb-1">تصفية حسب الحالة</div>
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => { handleTabChange(tab.key); setIsFilterOpen(false); }}
                    className={`px-4 py-3 text-sm font-bold flex items-center justify-between text-right transition-colors ${
                      isActive ? "text-[#215077] bg-blue-50/40" : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {tab.label}
                    {isActive && <Check size={16} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex items-center justify-between gap-4 shrink-0 overflow-hidden">
        <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-neutral-100 w-max">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? "bg-[#215077] text-white shadow-sm"
                    : "text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden min-h-[300px]">
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <table className="w-full text-sm text-right min-w-[600px]">
            <thead className="sticky top-0 bg-neutral-50/90 backdrop-blur-md z-10">
              <tr className="border-b border-neutral-100">
                <th className="py-4 px-6 text-sm text-neutral-500 font-bold">رقم الجلسة</th>
                <th className="py-4 px-6 text-sm text-neutral-500 font-bold">حالة الجلسة</th>
                <th className="py-4 px-6 text-sm text-neutral-500 font-bold">عدد الساعات</th>
                <th className="py-4 px-6 text-sm text-neutral-500 font-bold">الملاحظات</th>
                <th className="py-4 px-6 text-sm text-neutral-500 font-bold text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSessions.map((session) => {
                const s = session.status.toUpperCase();
                const isPending = s === "PENDING_CONFIRMATION" || s === "PENDING" || session.status === "قيد الانتظار";
                const displayStatus = 
                  isPending ? "قيد الانتظار" :
                  (s === "CONFIRMED" || session.status === "مؤكدة") ? "مؤكدة" :
                  (s === "REJECTED" || session.status === "غير مؤكدة") ? "غير مؤكدة" :
                  session.status;
                const sessionNumber = sessions.findIndex(s => s.id === session.id) + 1;
                
                return (
                  <tr key={session.id} className="border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6 text-base font-bold text-neutral-800">
                      جلسة #{sessionNumber}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold ${getStatusStyles(session.status)}`}>
                        {displayStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-base text-neutral-800 font-black">
                      {session.hours} <span className="text-sm font-medium text-neutral-500">ساعات</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-neutral-500 truncate max-w-[200px]">
                      {session.notes || "لا توجد ملاحظات"}
                    </td>
                    <td className="py-4 px-6 text-left">
                      {isPending ? (
                        isSeeker ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onConfirm?.(session.id)}
                              disabled={isConfirming || isRejecting}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                            >
                              تأكيد
                            </button>
                            <button
                              onClick={() => onReject?.(session.id)}
                              disabled={isConfirming || isRejecting}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                            >
                              رفض
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-neutral-400">بانتظار موافقة المستفيد</span>
                        )
                      ) : (
                        <span className="text-neutral-300 font-bold">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center text-neutral-400 font-medium bg-neutral-50/30">
                    لا توجد جلسات عمل مسجلة حتى الآن.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {sessions.length > 0 && (
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-t border-neutral-100 p-4 bg-neutral-50/50 shrink-0">
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="h-9 px-3 rounded-lg border border-neutral-200 bg-white text-neutral-700 text-xs font-bold transition-colors hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                السابق
              </button>
              <select
                value={currentPage}
                onChange={(event) => goToPage(Number(event.target.value))}
                className="h-9 flex-1 rounded-lg border border-neutral-200 bg-white px-2 text-xs font-bold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#215077]/20"
              >
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <option key={page} value={page}>
                    صفحة {page} من {totalPages}
                  </option>
                ))}
              </select>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="h-9 px-3 rounded-lg border border-neutral-200 bg-white text-neutral-700 text-xs font-bold transition-colors hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>

            <div className="hidden md:block w-full max-w-full overflow-x-auto">
              <div className="flex items-center gap-1.5 min-w-max">
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>

                {paginationTokens.map((token, index) =>
                  token === "dots" ? (
                    <span
                      key={`dots-${index}`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 text-sm font-bold select-none"
                      aria-hidden="true"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={token}
                      onClick={() => goToPage(token)}
                      aria-current={token === currentPage ? "page" : undefined}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                        token === currentPage
                          ? "bg-[#215077] text-white shadow-sm"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      {token}
                    </button>
                  ),
                )}

                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
            </div>

            <p className="text-xs font-bold text-neutral-400">
              عرض {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, sessions.length)} من أصل {sessions.length} جلسة
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
