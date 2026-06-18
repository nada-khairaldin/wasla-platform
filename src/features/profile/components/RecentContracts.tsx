// components/profile/RecentContracts.tsx
import { ChevronLeft } from "lucide-react";
import { Contract } from "../types";
import { getSkillIcon } from "@/src/utils/skillIcons";

interface RecentContractsProps {
  contracts: Contract[];
  onViewAll?: () => void;
  onContractClick?: (id: string) => void;
  isPublicView?: boolean;
}

export default function RecentContracts(props: RecentContractsProps) {
  const { contracts, onViewAll, onContractClick, isPublicView } = props;

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm">
      {/* Header — Title on the right, button on the left */}
      <div className="bg-primary-500 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <h2 className="text-white font-bold text-sm sm:text-base">
          آخر 3 عقود مكتملة
        </h2>
        {!isPublicView && (
          <button
            onClick={onViewAll}
            className="text-white/70 text-xs sm:text-sm hover:text-white hover:underline transition-all"
          >
            عرض الكل
          </button>
        )}
      </div>

      {/* Contract rows — RTL structure */}
      <div className="bg-white divide-y divide-neutral-100">
        {contracts.length > 0 ? (
          contracts.map((contract) => {
            const Wrapper = isPublicView ? "div" : "button";
            return (
            <Wrapper
              key={contract.id}
              onClick={!isPublicView ? () => onContractClick?.(contract.id) : undefined}
              className={`w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 text-right ${
                !isPublicView ? "hover:bg-neutral-50 transition-colors cursor-pointer" : ""
              }`}
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
              {!isPublicView && (
                <ChevronLeft className="w-4 h-4 text-neutral-300 flex-shrink-0" />
              )}
            </Wrapper>
          )})
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div>
              <p className="text-neutral-500 text-sm font-semibold">لا توجد عقود مكتملة حتى الآن</p>
              <p className="text-neutral-400 text-xs mt-1  leading-relaxed">
                لم تقم بإتمام أي عملية تبادل مهارات بعد. تواصل مع الأعضاء وعرّف عن خدماتك لتسجيل عقودك الأولى هنا!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
