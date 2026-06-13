"use client";
import Image from "next/image";
import { Compass } from "lucide-react";
import { Skeleton } from "@/src/components/ui/Skeleton";
import Button from "../../../components/ui/Button";
import { CreateServiceTrigger } from "../../posts/components/CreateServiceTrigger";
import { scrollToSection } from "../../../utils";

interface HeroSectionProps {
  user?: string | null;
  isLoading: boolean;
}

export default function HeroSection({ user, isLoading }: HeroSectionProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-sm h-full w-full">
        <div className="w-full max-w-[140px] md:max-w-[160px] lg:max-w-none lg:w-1/3 order-1 md:order-2 shrink-0">
          <Skeleton className="w-full aspect-square rounded-2xl" />
        </div>
        <div className="flex-1 space-y-4 w-full text-center md:text-right order-2 md:order-1">
          <Skeleton className="w-1/2 h-8 mx-auto md:ml-auto md:mr-0" />
          <Skeleton className="w-1/3 h-6 mx-auto md:ml-auto md:mr-0" />
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 pt-2">
            <Skeleton className="w-full sm:w-32 h-11 rounded-full" />
            <Skeleton className="w-full sm:w-32 h-11 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 shadow-sm relative overflow-hidden h-full group w-full">
      <div className="w-full max-w-[130px] sm:max-w-[150px] md:w-1/2 md:max-w-[220px] lg:w-1/3 lg:max-w-none flex justify-center items-center z-10 transition-transform duration-700 group-hover:scale-105 order-1 md:order-2 shrink-0">
        <Image
          src="/images/features/home/homeHero_handshake.png"
          alt="وصلة Hero"
          width={520}
          height={520}
          className="w-full h-auto object-contain"
          priority
        />
      </div>

      <div className="flex-1 md:w-1/2 space-y-3 md:space-y-4 text-center md:text-right z-10 w-full order-2 md:order-1 min-w-0">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-neutral-800 leading-tight truncate">
          مرحباً، {user || "بك"} 👋
        </h1>
        <h2 className="text-base md:text-lg lg:text-xl font-bold text-primary-500">
          تعلّم، شارك، وتواصل
        </h2>

        <p className="hidden lg:block text-neutral-500 text-sm leading-relaxed max-w-[500px] mr-0">
          انشر ما تستطيع تقديمه واكتشف أشخاصًا يمكنهم مساعدتك في رحلتك. مكان
          واحد لتبادل المهارات والخبرات، وبناء مجتمع قوي من المتعلمين والمبدعين.
          انضم إلينا اليوم وابدأ في مشاركة مهاراتك واكتساب مهارات جديدة!
        </p>

        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center justify-center md:items-stretch lg:items-center gap-3 pt-2 md:pt-3 w-full">
          <div className="w-full sm:w-auto md:w-full lg:w-auto [&>button]:w-full shrink-0">
            <CreateServiceTrigger />
          </div>

          <Button
            onClick={(e) => scrollToSection(e, "latest-posts-section", 100)}
            variant="outline"
            size="md"
            className="flex gap-2 rounded-full w-full sm:w-auto md:w-full lg:w-auto justify-center whitespace-nowrap shrink-0"
          >
            <Compass size={18} />
            <span>استكشف المنشورات</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
