import StepCard from "./StepCard";
import { UserPlus, Search, Repeat2 } from "lucide-react";
import type { Step } from "../../../../types";
import { motion, Variants } from "framer-motion";

const steps: Step[] = [
  {
    number: "١",
    title: "أنشئ ملفك الشخصي",
    description:
      "أدرج ما يمكنك تعليمه أو القيام به، من صيانة الطاقة الشمسية إلى البرمجة أو الطبخ.",
    icon: <UserPlus size={48} strokeWidth={1.8} />,
  },
  {
    number: "٢",
    title: "ابحث عن شركاء",
    description:
      "ابحث عن المساعدة التي تحتاجها. يقترح ذكاؤنا الاصطناعي أفضل الشركاء في المجتمع لك.",
    icon: <Search size={48} strokeWidth={1.8} />,
  },
  {
    number: "٣",
    title: "تبادل والتزم",
    description:
      "اكسب أرصدة زمنية بمساعدة الآخرين، ثم استهلكها للحصول على المساعدة التي تحتاجها.",
    icon: <Repeat2 size={48} strokeWidth={1.8} />,
  },
];

function StepsSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.section
      id="how-it-works"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="px-xl4 md:px-xl4 py-base md:py-xl bg-white flex flex-col items-center gap-xl3"
    >
      <div className="flex flex-col items-center justify-center gap-[18px]">
        <h2 className="font-bold text-h4 sm:text-h3 md:text-h2 text-primary-500">
          ثلاث خطوات للنجاح
        </h2>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 96 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="h-2.25 rounded-full bg-primary-500"
        ></motion.div>
      </div>

      <div className="flex flex-col md:flex-row gap-xl3 md:w-full xl:max-w-6xl md:justify-between">
        {steps.map((step) => (
          <motion.div
            key={step.number}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="flex-1"
          >
            <StepCard step={step} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default StepsSection;
