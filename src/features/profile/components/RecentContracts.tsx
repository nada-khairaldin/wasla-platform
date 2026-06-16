// components/profile/RecentContracts.tsx
import { ChevronLeft } from "lucide-react";
import { Contract } from "../types";
import { getSkillIcon } from "@/src/utils/skillIcons";

interface RecentContractsProps {
  contracts: Contract[];
  onViewAll?: () => void;
  onContractClick?: (id: string) => void;
}

export default function RecentContracts(props: RecentContractsProps) {
  const { contracts, onViewAll, onContractClick } = props;

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm">
      {/* Header — Title on the right, button on the left */}
      <div className="bg-primary-500 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <h2 className="text-white font-bold text-sm sm:text-base">
          آخر 3 عقود مكتملة
        </h2>
        <button
          onClick={onViewAll}
          className="text-white/70 text-xs sm:text-sm hover:text-white hover:underline transition-all"
        >
          عرض الكل
        </button>
      </div>

      {/* Contract rows — RTL structure */}
      <div className="bg-white divide-y divide-neutral-100">
        {contracts.map((contract) => (
          <button
            key={contract.id}
            onClick={() => onContractClick?.(contract.id)}
            className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 hover:bg-neutral-50 transition-colors text-right"
          >
            {/* Icon — right side */}
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${contract.iconBg}`}>
              {getSkillIcon(contract.title, { className: "w-5 h-5 shrink-0" })}
            </div>

            {/* Info — center-right */}
            <div className="flex-1 min-w-0 text-right pr-2">
              <p className="font-bold text-neutral-800 text-xs sm:text-sm truncate">
                {contract.title}
              </p>
              <p className="text-xs text-neutral-400 truncate">
                مع: {contract.partnerName}
              </p>
            </div>

            {/* Date + Duration — hidden on xs, visible sm+ */}
            <div className="hidden sm:flex flex-shrink-0 flex-col items-start gap-0.5 text-right pl-2">
              <div className="flex items-center gap-1 text-xs text-neutral-400">
                <span>التاريخ</span>
                <span className="text-neutral-800 font-medium">{contract.date}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-400">
                <span>المدة</span>
                <span className="text-neutral-800 font-medium">
                  {contract.durationHours === 1 ? "١ ساعة" : `${contract.durationHours} ساعات`}
                </span>
              </div>
            </div>

            {/* Mobile: only show duration */}
            <div className="sm:hidden flex-shrink-0 text-xs text-neutral-400">
              {contract.durationHours === 1 ? "١ س" : `${contract.durationHours} س`}
            </div>

            {/* ChevronLeft — left side */}
            <ChevronLeft className="w-4 h-4 text-neutral-300 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
