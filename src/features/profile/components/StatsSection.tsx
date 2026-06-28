// components/profile/StatsSection.tsx
import { Star, CheckCircle, FileUp, BarChart2 } from "lucide-react";

interface StatsSectionProps {
  rating: number;
  maxRating?: number;
  servicesReceived: number;
  servicesProvided: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function StatCard(props: StatCardProps) {
  const { icon, label, value } = props;
  return (
    <div className="flex-1 rounded-2xl bg-white border border-neutral-100 shadow-sm p-3 sm:p-5 flex flex-col items-center gap-1.5 sm:gap-2 text-center">
      <div className="text-xl sm:text-2xl">{icon}</div>
      <p className="text-xs sm:text-sm text-neutral-400">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-primary-500">{value}</p>
    </div>
  );
}

export default function StatsSection(props: StatsSectionProps) {
  const { rating, maxRating = 5, servicesReceived, servicesProvided } = props;
  const displayRating = rating > 5 ? rating / 2 : rating;

  return (
    <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 sm:p-6" dir="rtl">
      {/* RTL header with modern icon */}
      <h2 className="text-sm sm:text-base font-bold text-primary-500 mb-3 sm:mb-4 flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-primary-500" />
        <span>إحصائيات الأداء</span>
      </h2>
      
      {/* Mirrored flex list of cards (Provided, Received, Rating) */}
      <div className="flex gap-2 sm:gap-3">
        <StatCard
          icon={<FileUp className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-500" />}
          label="الخدمات المقدمة"
          value={servicesProvided}
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-success-600" />}
          label="الخدمات المستلمة"
          value={servicesReceived}
        />
        <StatCard
          icon={<Star className="w-5 h-5 sm:w-6 sm:h-6 fill-secondary-500 text-secondary-500" />}
          label="التقييم"
          value={rating === 0 ? `0/${maxRating}` : `${displayRating.toFixed(1)}/${maxRating}`}
        />
      </div>
    </div>
  );
}
