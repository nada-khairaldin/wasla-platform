"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Gift,
  Search,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Lock,
} from "lucide-react";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { useUserProfile, useWalletHistory } from "@/src/features/profile/hooks";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { mapWalletTransactionToTransaction } from "@/src/features/profile/utils/profileMappers";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "gift";
  description: string;
  hours: number;
  date: string;
}

type FilterType = "all" | "deposit" | "withdrawal" | "gift";

export default function WalletPage() {
  const router = useRouter();

  // API Queries
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  // Safe number coercion for userId to protect against string IDs in tokens
  const userId = currentUser?.user?.userId ? Number(currentUser.user.userId) : undefined;

  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile(userId);
  const { data: walletHistory = [], isLoading: isHistoryLoading } = useWalletHistory();

  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  // Map real Wallet Transactions list
  const transactions: Transaction[] = useMemo(() => {
    return walletHistory.map(mapWalletTransactionToTransaction);
  }, [walletHistory]);

  // Balance and dynamic statistics computation
  const currentBalance = userProfile?.profile?.stats?.availableTimeCredits ?? 0;

  const totalEarned = useMemo(() => {
    return transactions
      .filter((t) => t.type === "deposit")
      .reduce((acc, t) => acc + t.hours, 0);
  }, [transactions]);

  const totalSpent = useMemo(() => {
    return transactions
      .filter((t) => t.type === "withdrawal")
      .reduce((acc, t) => acc + t.hours, 0);
  }, [transactions]);

  // Gift sum: sum the hours of all gift transactions
  const totalGifts = useMemo(() => {
    return transactions
      .filter((t) => t.type === "gift")
      .reduce((acc, t) => acc + t.hours, 0);
  }, [transactions]);

  // Reserved Balance calculation
  const reservedBalance = useMemo(() => {
    return Math.max(0, (totalEarned + totalGifts) - (currentBalance + totalSpent));
  }, [totalEarned, totalGifts, currentBalance, totalSpent]);

  // Filter and search logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => filter === "all" || t.type === filter)
      .filter((t) => t.description.toLowerCase().includes(search.toLowerCase()));
  }, [transactions, filter, search]);

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const [prevFilter, setPrevFilter] = useState(filter);
  const [prevSearch, setPrevSearch] = useState(search);

  if (filter !== prevFilter || search !== prevSearch) {
    setPrevFilter(filter);
    setPrevSearch(search);
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const isLoading = isUserLoading || isProfileLoading || isHistoryLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 md:px-8 lg:px-16 py-8" dir="rtl">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-48 rounded" />
              <Skeleton className="h-4 w-72 rounded" />
            </div>
          </div>
          {/* Hero Balance Skeleton */}
          <div className="bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 flex justify-between items-center gap-6 shadow-sm">
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-14 w-40 rounded" />
              <Skeleton className="h-3 w-56 rounded mt-2" />
            </div>
            <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shrink-0" />
          </div>
          {/* Stats Skeletons */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl border border-neutral-100 p-4 flex flex-col items-center gap-2 shadow-sm">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-5 w-12 rounded" />
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 p-4 flex flex-col items-center gap-2 shadow-sm">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-5 w-12 rounded" />
            </div>
            <div className="bg-white rounded-2xl border border-neutral-100 p-4 flex flex-col items-center gap-2 shadow-sm">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-5 w-12 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 md:px-8 lg:px-16 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Header Block */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/my-profile")}
              className="w-10 h-10 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-primary-500 hover:bg-neutral-50 hover:shadow-sm transition-all"
              title="رجوع للملف الشخصي"
            >
              <ArrowRight size={20} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">سجل ورصيد المحفظة</h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">إدارة ومتابعة رصيد الساعات الخاص بك والعمليات المنفذة</p>
            </div>
          </div>
        </div>

        {/* Hero Section: Balance Summary */}
        <div className="bg-primary-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-12 -translate-y-12"></div>

          <div className="z-10 text-center sm:text-right">
            <p className="text-sm text-white/70">رصيد الساعات الفعلي الحالي</p>
            <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-2">
              <span className="text-5xl sm:text-6xl font-black">{currentBalance.toFixed(1)}</span>
              <span className="text-lg text-white/80">ساعة</span>
            </div>
            <p className="text-xs text-white/60 mt-3">ساعة التبادل تعادل ساعة عمل حقيقية في أي مهارة</p>
          </div>

          <div className="z-10 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 text-white/95 backdrop-blur-sm shadow-inner shrink-0">
            <Wallet className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-2">
          <div className="bg-white rounded-2xl border border-neutral-100 p-4 sm:p-5 shadow-sm text-center flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-success-50 text-success-600 flex items-center justify-center mb-1">
              <TrendingUp size={20} />
            </div>
            <span className="text-xs text-neutral-400 font-medium h-8 flex items-center justify-center text-center">ساعات مكتسبة</span>
            <span className="text-lg sm:text-xl font-bold text-success-600">+{totalEarned.toFixed(1)} س</span>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 p-4 sm:p-5 shadow-sm text-center flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-error-50 text-error-600 flex items-center justify-center mb-1">
              <TrendingDown size={20} />
            </div>
            <span className="text-xs text-neutral-400 font-medium h-8 flex items-center justify-center text-center">ساعات مستهلكة</span>
            <span className="text-lg sm:text-xl font-bold text-error-600">-{totalSpent.toFixed(1)} س</span>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 p-4 sm:p-5 shadow-sm text-center flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-warning-50 text-warning-600 flex items-center justify-center mb-1">
              <Gift size={20} />
            </div>
            <span className="text-xs text-neutral-400 font-medium h-8 flex items-center justify-center text-center">هدايا ومنح</span>
            <span className="text-lg sm:text-xl font-bold text-warning-600">+{totalGifts.toFixed(1)} س</span>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 p-4 sm:p-5 shadow-sm text-center flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-error-50 text-error-600 flex items-center justify-center mb-1">
              <Lock size={20} />
            </div>
            <span className="text-xs text-neutral-400 font-medium h-8 flex items-center justify-center text-center">الرصيد المحجوز</span>
            <span className="text-lg sm:text-xl font-bold text-error-600">{reservedBalance.toFixed(1)} س</span>
          </div>
        </div>

        {/* Transactions list header, filter, and search */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 sm:p-6 mt-2 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-neutral-800 text-right">سجل العمليات</h2>

            {/* Search Input */}
            <div className="relative w-full sm:w-80 flex-shrink-0">
              <input
                type="text"
                placeholder="البحث في وصف العمليات..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-neutral-100 rounded-xl text-xs sm:text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:border-primary-400 transition-all text-right"
              />
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 z-10 pointer-events-none" />
            </div>
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-neutral-100 pb-3" dir="rtl">
            <button
              onClick={() => setFilter("all")}
              className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${filter === "all" ? "bg-primary-500 text-white shadow-sm" : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100"}`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilter("deposit")}
              className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${filter === "deposit" ? "bg-success-600 text-white shadow-sm" : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100"}`}
            >
              <ArrowUpRight size={13} />
              <span>المكتسبة</span>
            </button>
            <button
              onClick={() => setFilter("withdrawal")}
              className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${filter === "withdrawal" ? "bg-error-600 text-white shadow-sm" : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100"}`}
            >
              <ArrowDownLeft size={13} />
              <span>المستهلكة</span>
            </button>
            <button
              onClick={() => setFilter("gift")}
              className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${filter === "gift" ? "bg-amber-500 text-white shadow-sm" : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100"}`}
            >
              <Gift size={13} />
              <span>الهدايا</span>
            </button>
          </div>

          {/* Table / List */}
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="p-3 bg-neutral-50 rounded-full text-neutral-400">
                <Clock size={32} />
              </div>
              <p className="text-neutral-400 text-sm">لا توجد عمليات تطابق البحث</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col divide-y divide-neutral-100">
                {paginatedTransactions.map((tx) => {
                  const isDeposit = tx.type === "deposit";
                  const isWithdrawal = tx.type === "withdrawal";

                  let badgeClass = "bg-warning-100 text-warning-600";
                  let arrowSign = "+";
                  let typeText = "هدية";

                  if (isDeposit) {
                    badgeClass = "bg-success-100 text-success-600";
                    arrowSign = "+";
                    typeText = "إيداع";
                  } else if (isWithdrawal) {
                    badgeClass = "bg-error-100 text-error-600";
                    arrowSign = "-";
                    typeText = "سحب";
                  }

                  return (
                    <div key={tx.id} className="py-4 flex items-center justify-between gap-4">
                      {/* Hours column */}
                      <div className="text-right flex flex-col items-start gap-0.5">
                        <span className={`text-base font-bold ${isWithdrawal ? "text-error-600" : isDeposit ? "text-success-600" : "text-amber-500"}`}>
                          {arrowSign}
                          {tx.hours.toFixed(1)} س
                        </span>
                        <span className="text-[10px] text-neutral-400">{tx.date}</span>
                      </div>

                      {/* Description column */}
                      <p className="flex-1 text-xs sm:text-sm text-neutral-700 font-medium text-right pr-4 pl-2">
                        {tx.description}
                      </p>

                      {/* Badge column */}
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${badgeClass}`}>
                        {typeText}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100/60" dir="rtl">
                  <span className="text-xs text-neutral-400">
                    الصفحة {currentPage} من {totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border border-neutral-200 hover:bg-neutral-50 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all text-neutral-600 cursor-pointer"
                    >
                      السابق
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-500 text-white hover:bg-primary-600 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all cursor-pointer"
                    >
                      التالي
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
