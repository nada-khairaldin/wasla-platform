// components/profile/WalletHistory.tsx
"use client";
import Link from "next/link";
import { Transaction, TransactionType } from "../types";

interface WalletHistoryProps {
  transactions: Transaction[];
  onViewAll?: () => void;
}

const typeConfig: Record<TransactionType, { label: string; color: string; bg: string; sign: string; arrow: string }> = {
  deposit:    { label: "إيداع", color: "text-success-600", bg: "bg-success-100", sign: "+", arrow: "↓" },
  withdrawal: { label: "سحب",   color: "text-error-600",   bg: "bg-error-100",   sign: "-", arrow: "↑" },
  gift:       { label: "هدية",  color: "text-warning-600",  bg: "bg-warning-100",  sign: "+", arrow: "🎁" },
};

export default function WalletHistory(props: WalletHistoryProps) {
  const { transactions, onViewAll } = props;

  return (
    <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden" dir="rtl">
      {/* Header — Title on the right, Link on the left */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-100 flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-primary-500">تاريخ المحفظة</h2>
        <Link href="/my-profile/wallet" className="text-xs sm:text-sm text-primary-500 hover:underline">
          عرض الكل
        </Link>
      </div>

      <div className="hidden sm:block">
        <div className="grid grid-cols-4 px-6 py-2 bg-neutral-50 text-xs text-neutral-400 font-semibold">
          <span>النوع</span>
          <span className="text-center">الوصف</span>
          <span className="text-center">الساعات</span>
          <span className="text-left">التاريخ</span>
        </div>
        <div className="divide-y divide-neutral-100">
          {transactions.map((tx) => {
            const c = typeConfig[tx.type];
            return (
              <div key={tx.id} className="grid grid-cols-4 items-center px-6 py-3.5">
                <div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.color}`}>
                    {c.arrow} {c.label}
                  </span>
                </div>
                <span className="text-sm text-neutral-600 text-center">{tx.description}</span>
                <span className={`text-sm font-bold text-center ${c.color}`}>{c.sign}{tx.hours.toFixed(2)}</span>
                <span className="text-sm text-neutral-400 text-left">{tx.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sm:hidden divide-y divide-neutral-100">
        {transactions.map((tx) => {
          const c = typeConfig[tx.type];
          return (
            <div key={tx.id} className="px-4 py-3 flex items-center gap-3">
              {/* Badge (right side) */}
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${c.bg} ${c.color}`}>
                {c.arrow} {c.label}
              </span>
              {/* Description (middle) */}
              <span className="flex-1 text-xs text-neutral-600 min-w-0 truncate text-right pr-2">{tx.description}</span>
              {/* Hours + date stacked (left side) */}
              <div className="flex-shrink-0 text-left flex flex-col items-end gap-0.5">
                <span className={`text-sm font-bold ${c.color}`}>{c.sign}{tx.hours.toFixed(2)}</span>
                <span className="text-xs text-neutral-400">{tx.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
