"use client";

import {
  Clock,
  User,
  Briefcase,
  Hash,
  Check,
  X,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Contract, UserRole } from "../contract.types";
import { ContractInfoItem } from "./ContractInfoItem";

interface ContractCardProps {
  contract: Contract;
  currentUserRole: UserRole;
  onViewDetails: (id: string) => void;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function ContractCard({
  contract,
  currentUserRole,
  onViewDetails,
  onAccept,
  onReject,
}: ContractCardProps) {
  const {
    id,
    title,
    seekerName,
    providerName,
    serviceType,
    deliveryType,
    status,
    stats,
  } = contract;
  const isPending = status === "pending";
  const isProvider = currentUserRole === "provider";
  const isBeneficiary = currentUserRole === "seeker";

  return (
    <div
      className="bg-white rounded-2xl border border-neutral-100/80 p-5 flex flex-col justify-between gap-5 shadow-sm hover:shadow-md hover:border-primary-100 transition-all duration-200 group"
      dir="rtl"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-neutral-50 text-neutral-500 rounded-md">
            <Hash size={12} />
            <span>{id.slice(0, 6)}</span>
          </span>

          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${
              isPending
                ? "bg-warning-50 text-warning-700"
                : "bg-success-50 text-success-700"
            }`}
          >
            {isPending
              ? isProvider
                ? "طلب عقد جديد"
                : "قيد الانتظار"
              : "نشط حالياً"}
          </span>
        </div>

        <h3 className="text-[16px] font-bold text-neutral-900 tracking-normal leading-6 group-hover:text-primary-500 transition-colors">
          {title}
        </h3>
      </div>

      <div className="h-px bg-neutral-50" />

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <ContractInfoItem label="المزود" value={providerName} icon={User} />
        <ContractInfoItem label="المستفيد" value={seekerName} icon={User} />
        <ContractInfoItem
          label="مجال الخدمة"
          value={serviceType}
          icon={Briefcase}
        />

        {isPending ? (
          <>
            <ContractInfoItem
              label="طريقة تقديم الخدمة"
              value={deliveryType || "أونلاين"}
              icon={MapPin}
              iconColorClass="text-primary-400"
            />
            <ContractInfoItem
              label="إجمالي الساعات"
              value={`${stats?.totalHours || 0} ساعة`}
              icon={Clock}
              iconColorClass="text-primary-400"
            />
            <ContractInfoItem
              label="أقصى تاريخ انتهاء"
              value={stats?.endDate || "—"}
              icon={Calendar}
              iconColorClass="text-secondary-500"
            />
          </>
        ) : (
          <ContractInfoItem
            label="الساعات الكلية"
            value={`${stats?.totalHours || 0} ساعة`}
            icon={Clock}
            iconColorClass="text-primary-400"
          />
        )}
      </div>

      {isPending && isBeneficiary && (
        <>
          <div className="h-px bg-neutral-50" />
          <div className="flex items-center gap-2 bg-warning-50/60 border border-warning-100 rounded-xl p-3 text-[12px] text-warning-700">
            <AlertCircle size={16} className="shrink-0" />
            <span className="font-semibold">
              بانتظار موافقة مزود الخدمة
            </span>
          </div>
        </>
      )}

      {isPending && isProvider && (
        <>
          <div className="h-px bg-neutral-50" />
          <div className="flex items-center gap-3 mt-1">
          <button
            onClick={() => onReject?.(id)}
            className="flex-1 py-2.5 px-3 rounded-xl border border-error-200 bg-error-50 text-error-600 text-[13px] font-bold hover:bg-error-100 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1"
          >
            <X size={15} />
            <span>رفض العقد</span>
          </button>

          <button
            onClick={() => onAccept?.(id)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-primary-500 text-white text-[13px] font-bold hover:bg-primary-600 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1 shadow-sm"
          >
            <Check size={15} />
            <span>قبول العقد</span>
          </button>
        </div>
        </>
      )}

      {!isPending && (
        <button
          onClick={() => onViewDetails(id)}
          className="w-full py-2.5 rounded-xl bg-primary-500 text-white text-[13px] font-bold hover:bg-primary-600 active:bg-primary-700 active:scale-[0.99] transition-all duration-150 shadow-sm mt-1"
        >
          عرض التفاصيل
        </button>
      )}
    </div>
  );
}
