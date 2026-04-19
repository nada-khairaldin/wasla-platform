"use client";
import {
  Scale,
  ShieldCheck,
  Eye,
  Network,
  BadgeCheck,
  BrainCircuit,
} from "lucide-react";
import FeatureCard from "./FeatureCard";
import type { Feature } from "../../../../types";

const features: Feature[] = [
  {
    title: "تبادل متساوي القيمة",
    description:
      "كل ساعة متساوية. ساعة من الاستشارة الطبية = ساعة من السباكة الأساسية. لا هرمية هنا.",
    icon: <Scale size={36} strokeWidth={1.5} />,
  },

  {
    title: "مطابقة ذكية بالذكاء الاصطناعي",
    description: " تربط خوارزميتنا الأشخاص بناءً على توافق المهارات.",
    icon: <BrainCircuit size={30} strokeWidth={1.5} />,
  },

  {
    title: "تصميم مخصص لغزة",
    description:
      "صمم لاحتياجات الأوقات الصعبة والمتغيرة وسياسات القطاع الخدمية المتاحة.",

    icon: <BadgeCheck size={30} strokeWidth={1.5} />,
  },

  {
    title: "نظام ثقة موثّق",
    description:
      "أنظمة توثيق وتقييم يقودها المجتمع لضمان السلامة والجودة لجميع المستخدمين.",

    icon: <ShieldCheck size={30} strokeWidth={1.5} />,
  },

  {
    title: "شبكة مهارات",
    description:
      " اكتشف أشخاص يملكون مهارات مختلفة وتواصل معهم بسهولة لتبادل الخبرات والخدمات.",

    icon: <Network size={30} strokeWidth={1.5} />,
  },

  {
    title: "سجل شفاف",
    description:
      " تتبع ساعاتك المكتسبة والمستهلكة بسهولة من خلال محفظتنا الرقمية الآمنة.",

    icon: <Eye size={30} strokeWidth={1.5} />,
  },
];

function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-xl4 md:py-xl6 px-base md:px-xl4 flex flex-col items-center gap-xl3 bg-neutral-50 overflow-hidden"
    >
      <div className="text-center space-y-sm">
        <h2 className="font-bold text-h3 sm:text-h3 md:text-h2 text-primary-500">
          مميزات المنصة الأساسية
        </h2>

        <p className="text-label-1 font-semibold text-neutral-400">
          مصممة خصيصاً لتلبية الاحتياجات الفريدة لمجتمع غزة
        </p>
      </div>

      <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-md md:gap-lg w-full max-w-5xl pb-4 snap-x snap-mandatory scrollbar-hide">
        {features.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;
