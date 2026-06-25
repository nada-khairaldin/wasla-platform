import React from "react";
import { Star, CheckCircle, FileUp, BarChart2 } from "lucide-react";

interface PublicStatsSectionProps {
  timeCredits: number;
  servicesProvided: number;
  servicesReceived: number;
  rating: number;
  ratingCount: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
}

function StatCard(props: StatCardProps) {
  const { icon, label, value, subValue } = props;
  return (
    <div className="flex-1 rounded-2xl bg-white border border-neutral-100 shadow-sm p-3 sm:p-5 flex flex-col items-center gap-1.5 sm:gap-2 text-center">
      <div className="text-xl sm:text-2xl">{icon}</div>
      <p className="text-xs sm:text-sm text-neutral-400">{label}</p>
      <div className="flex flex-col items-center">
        <p className="text-xl sm:text-2xl font-bold text-primary-500">{value}</p>
        {subValue && <span className="text-xs text-neutral-400">{subValue}</span>}
      </div>
    </div>
  );
}

export default function PublicStatsSection(props: PublicStatsSectionProps) {
  const { servicesProvided, servicesReceived, rating } = props;

  return (
    <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 sm:p-6" dir="rtl">
      <h2 className="text-sm sm:text-base font-bold text-primary-500 mb-3 sm:mb-4 flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-primary-500" />
        <span>إحصائيات الأداء</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
        <StatCard
          icon={<Star className="w-5 h-5 sm:w-6 sm:h-6 fill-secondary-500 text-secondary-500" />}
          label="التقييم"
          value={`${rating.toFixed(1)}/5`}
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-success-600" />}
          label="الخدمات المستلمة"
          value={servicesReceived}
        />
        <StatCard
          icon={<FileUp className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-500" />}
          label="الخدمات المقدمة"
          value={servicesProvided}
        />
      </div>
    </div>
  );
}
