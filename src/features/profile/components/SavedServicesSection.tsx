// components/profile/SavedServicesSection.tsx
import { Bookmark, Clock } from "lucide-react";
import Link from "next/link";
import { SavedService } from "../types";

interface SavedServicesSectionProps {
  services: SavedService[];
  onUnsave?: (id: string) => void;
  onViewAll?: () => void;
}

function EmptySaved() {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3 text-center px-4">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-error-50 flex items-center justify-center">
        <Bookmark className="w-6 h-6 sm:w-7 sm:h-7 text-error-600" />
      </div>
      <p className="text-neutral-800 font-semibold text-sm sm:text-base">لا توجد خدمات محفوظة</p>
      <p className="text-neutral-400 text-xs sm:text-sm">
        هل أعجبتك مهارة معينة؟ احفظها للرجوع إليها لاحقاً بالضغط على أيقونة العلامة المرجعية.
      </p>
    </div>
  );
}

export default function SavedServicesSection(props: SavedServicesSectionProps) {
  const { services, onUnsave, onViewAll } = props;
  const isEmpty = services.length === 0;

  const displayedServices = services.slice(-2);

  return (
    <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 sm:p-6" dir="rtl">
      {/* Header Row — Title on the right, Link on the left */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-sm sm:text-base font-bold text-primary-500 flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-primary-500" />
          <span>الخدمات المحفوظة</span>
        </h2>
        {!isEmpty && (
          <Link href="/my-profile/saved" className="text-xs sm:text-sm text-primary-500 hover:underline">
            مشاهدة الكل
          </Link>
        )}
      </div>

      {isEmpty ? (
        <EmptySaved />
      ) : (
        <div className="flex flex-col">
          {displayedServices.map((service, index) => (
            <div
              key={service.id}
              className={`flex items-center justify-between gap-3 pb-5 sm:pb-6 last:pb-0 ${index > 0 ? "pt-5 sm:pt-6 border-t border-neutral-100/60" : "min-h-[115px] sm:min-h-[125px]"}`}
            >
              {/* Content — on the right side */}
              <div className="flex-1 min-w-0 text-right">
                <p className="font-semibold text-neutral-800 text-xs sm:text-sm truncate">{service.title}</p>
                <p className="text-xs text-neutral-400 mt-0.5">بواسطة: {service.providerName}</p>
                {/* Duration layout: icon first, text second */}
                <div className="flex items-center gap-1 mt-1 text-xs text-neutral-400">
                  <Clock className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                  <span>{service.durationHours === 1 ? "١ ساعة" : `${service.durationHours} ساعات`}</span>
                </div>
              </div>

              {/* Bookmark button — on the left side */}
              <button
                onClick={() => onUnsave?.(service.id)}
                className="flex-shrink-0 text-primary-500 hover:text-error-600 transition-colors p-1"
                title="إلغاء الحفظ"
              >
                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
