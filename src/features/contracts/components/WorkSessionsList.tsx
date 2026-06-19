import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Filter, Check } from "lucide-react";
import { WorkSession } from "../contract.types";

interface WorkSessionsListProps {
  sessions: WorkSession[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  contractId: string;
}

const TABS = ["الكل", "المؤكدة", "غير مؤكدة", "قيد الانتظار"];
const ITEMS_PER_PAGE = 4;

export function WorkSessionsList({ sessions, activeTab, onTabChange, contractId }: WorkSessionsListProps) {
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

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToPage = (page: number) => setCurrentPage(page);

  // Determine styles for status
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "مؤكدة":
        return "text-[#079455] bg-[#ebfbf3]";
      case "غير مؤكدة":
        return "text-[#d92d20] bg-[#fef3f2]";
      case "قيد الانتظار":
        return "text-[#f79009] bg-[#fff8ea]";
      default:
        return "text-neutral-500 bg-neutral-100";
    }
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
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => { handleTabChange(tab); setIsFilterOpen(false); }}
                    className={`px-4 py-3 text-sm font-bold flex items-center justify-between text-right transition-colors ${
                      isActive ? "text-[#215077] bg-blue-50/40" : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {tab}
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
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? "bg-[#215077] text-white shadow-sm"
                    : "text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                {tab}
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
                <th className="py-4 px-6 text-sm text-neutral-500 font-bold w-1/4">رقم العقد</th>
                <th className="py-4 px-6 text-sm text-neutral-500 font-bold w-1/4">حالة الجلسة</th>
                <th className="py-4 px-6 text-sm text-neutral-500 font-bold w-1/4">الساعات المتفق عليها</th>
                <th className="py-4 px-6 text-sm text-neutral-500 font-bold w-1/4 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSessions.map((session) => {
                const isPending = session.status === "قيد الانتظار";
                
                // Using contract id with a prefix
                const displayContractId = `#W-20240${contractId.padStart(2, '0')}`;

                return (
                  <tr key={session.id} className="border-b border-neutral-50 last:border-b-0 hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6 text-base font-bold text-neutral-800">
                      {displayContractId}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold ${getStatusStyles(session.status)}`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-base text-neutral-800 font-black">
                      {session.hours} <span className="text-sm font-medium text-neutral-500">ساعات</span>
                    </td>
                    <td className="py-4 px-6 text-left">
                      {isPending ? (
                        <button className="px-6 py-2 bg-[#215077] text-white rounded-lg text-xs font-bold shadow-sm hover:bg-[#1c4464] active:scale-95 transition-all">
                          تأكيد
                        </button>
                      ) : (
                        <div className="w-full h-8"></div>
                      )}
                    </td>
                  </tr>
                );
              })}
              
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 px-6 text-center text-neutral-400 font-medium bg-neutral-50/30">
                    لا توجد جلسات عمل مطابقة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {sessions.length > 0 && (
          <div className="flex items-center justify-between border-t border-neutral-100 p-4 bg-neutral-50/50 shrink-0">
            <div className="flex items-center gap-1.5">
              <button 
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => {
                const page = idx + 1;
                const isActive = page === currentPage;
                return (
                  <button 
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                      isActive 
                        ? "bg-[#215077] text-white shadow-sm" 
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button 
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
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
