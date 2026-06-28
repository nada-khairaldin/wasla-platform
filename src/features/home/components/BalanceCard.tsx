"use client";
import { Wallet } from "lucide-react";
import { Skeleton } from "@/src/components/ui/Skeleton";
import Link from "next/link";

export const BalanceCard = ({ points, isLoading }: { points?: number; isLoading: boolean }) => {
  return (
    <div className="bg-secondary-50/30 rounded-xl p-base md:p-7 shadow-sm flex flex-col md:justify-between h-full border border-secondary-300 transition-all hover:shadow-md font-cairo">
      
      <div className="flex justify-between items-center text-neutral-700 w-full">
        <div className="flex flex-col md:block text-right">
          <span className="text-sm md:text-xl font-bold block md:inline text-neutral-500 md:text-neutral-700">رصيدك الحالي</span>
          
          <div className="flex items-baseline gap-1 md:hidden mt-1">
            {isLoading ? (
              <Skeleton className="w-xl4 h-6" />
            ) : (
              <>
                <span className="text-2xl font-black text-neutral-900 leading-none">
                  {points || 0}
                </span>
                <span className="text-xs font-bold text-neutral-400">ساعة</span>
              </>
            )}
          </div>
        </div>

        <div className="bg-secondary-50 p-2 md:p-2.5 rounded-xl md:rounded-2xl text-secondary-500 shrink-0">
          <Wallet size={22} className="md:w-[35px] md:h-[35px] text-primary-hover" />
        </div>
      </div>

  
      <div className="hidden md:block text-center py-6">
        {isLoading ? (
          <Skeleton className="w-20 h-12 mx-auto" />
        ) : (
          <div className="space-y-1">
            <span className="text-5xl font-bold text-neutral-900 leading-none">
              {points || 0}
            </span>
            <p className="text-xl font-bold text-neutral-400 mt-2">ساعة</p>
          </div>
        )}
      </div>


      <div className="mt-3 md:mt-0 space-y-4 w-full flex flex-row md:flex-col justify-between items-center md:items-stretch gap-4 md:gap-0">
        <p className="hidden md:block text-[11px] text-neutral-400 text-center leading-relaxed px-2">
          يمكنك متابعة تفاصيل الساعات المكتسبة والمستهلكة من خلال محفظتك.
        </p>

        <Link 
          href="/my-profile/wallet" 
          className="w-full md:w-full bg-secondary-100 text-primary-hover py-2 md:py-3.5 rounded-xl font-bold text-xs md:text-sm border border-secondary-300 hover:bg-secondary-200 transition-all active:scale-95 flex items-center justify-center gap-2 text-center"
        >
          عرض السجل
        </Link>
      </div>

    </div>
  );
};