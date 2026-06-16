// components/profile/TimeBalanceCard.tsx
import Link from "next/link";

interface TimeBalanceCardProps {
  hours: number;
  onViewDetails?: () => void;
}

export default function TimeBalanceCard(props: TimeBalanceCardProps) {
  const { hours, onViewDetails } = props;

  return (
    <div className="rounded-2xl bg-primary-500 text-white p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 h-full" dir="rtl">
      <p className="text-xs sm:text-sm text-white/70">رصيد الوقت الحالي</p>
      <div className="flex items-baseline gap-2 sm:block">
        {/* Mobile: inline, sm+: stacked */}
        <span className="text-4xl sm:text-5xl font-bold">{hours}</span>
        <span className="text-base sm:text-lg text-white/80 sm:mr-2">ساعات</span>
      </div>
      {/* Route to the new wallet page */}
      <Link
        href="/my-profile/wallet"
        className="mt-auto w-full text-center py-2 sm:py-2.5 border border-white/40 text-white rounded-full text-xs sm:text-sm hover:bg-white/10 transition-all block"
      >
        عرض التفاصيل
      </Link>
    </div>
  );
}
