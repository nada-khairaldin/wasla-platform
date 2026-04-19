import ScrollingCarousel from "./ScrollingCarousel";

import { Testimonial } from "./TestimonialCard";
import { motion, Variants } from "framer-motion";

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "عمر خالد",
    role: "باحث أكاديمي",
    quote:
      "أفضل منصة للتبادل المعرفي، وجدت هنا خبراء في مجالات نادرة لم أكن لأجدهم في أي مكان آخر وبنظام عادل جداً.",
  },

  {
    id: 2,
    name: "سارة حسن",
    role: "مصممة جرافيك",
    quote:
      "وصلة مكنتني من تعلم اللغة الإسبانية مجاناً مقابل تعليم التصميم. المجتمع هنا متعاون جداً والتعامل راقي.",
  },

  {
    id: 3,
    name: "أحمد علي",
    role: "مطور برمجيات",
    quote:
      "علمت شخصاً أساسيات Python وحصلت في المقابل على حصص يوغا ساعدتني كثيراً في تقليل ضغط العمل، فكرة عبقرية!",
  },

  {
    id: 4,
    name: "ليلى محمود",
    role: "مترجمة",
    quote:
      "المنصة غيرت مفهومي عن التعلم، استطعت تطوير مهاراتي في التسويق الرقمي من خلال تبادل المهارات فقط.",
  },

  {
    id: 5,
    name: "ياسين القاضي",
    role: "رائد أعمال",
    quote:
      "شبكة علاقات رائعة، لم أتعلم مهارات جديدة فحسب، بل وجدت شركاء عمل محتملين يشاركونني نفس الشغف.",
  },
];

export default function SuccessStoriesSection() {

  const sectionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };


  const svgVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0, scaleX: 0.8 },
    visible: {
      pathLength: 1,
      opacity: 1,
      scaleX: 1,
      transition: { duration: 1, ease: "easeInOut", delay: 0.1 },
    },
  };

  return (
    <motion.section
      id="success-stories"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      className="relative w-full overflow-hidden py-xl2 md:py-xl"
    >

      <div className="relative z-30 text-center">
        <h2 className="font-bold text-h4 sm:text-h3 md:text-h2 text-primary-500">
          قصص نجاح من مجتمعنا
        </h2>
      </div>

      <div
        className="absolute left-0 right-0 top-xl3 z-0 w-full overflow-hidden"
        aria-hidden="true"
      >
        <motion.div
          variants={svgVariants}
          className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]"
        >
          <svg
            className="absolute inset-0 w-full h-full translate-y-xl"
            viewBox="0 0 1287 490"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M434.835 96.4852C570.426 36.7148 666.789 51.066 817.152 53.9487C927.366 56.0617 1023.28 91.2978 1097.25 86.1105C1171.23 80.9231 1287 0 1287 0V96.4852C1287 96.4852 1238 121.853 1204.55 133.834C1063.6 184.325 940.357 63.9298 789.48 74.1795C625.894 85.2926 552.574 163.308 415.635 245.363C331.051 296.046 333.722 365.68 252.767 420.207C168.196 477.17 0 489.688 0 489.688V445.596C0 445.596 200.812 338.294 252.767 278.416C304.721 218.537 350.81 133.525 434.835 96.4852Z"
              fill="#99B0C1"
            />
          </svg>

          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1287 490"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M434.835 96.4852C570.426 36.7148 666.79 51.066 817.152 53.9487C927.366 56.0617 1023.28 91.2978 1097.25 86.1105C1171.23 80.9231 1287 0 1287 0V96.4852C1287 96.4852 1238 121.853 1204.55 133.834C1063.6 184.325 968.028 123.585 817.152 133.834C653.565 144.947 534.556 104.113 402.082 192.97C320.256 247.855 322.84 323.262 244.524 382.31C162.711 443.995 0 489.688 0 489.688V409.803C0 409.803 194.264 293.606 244.524 228.763C294.785 163.921 350.81 133.525 434.835 96.4852Z"
              fill="#4D7694"
            />
          </svg>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 w-full mt-[100px] md:mt-[180px] mb-[50px]"
      >
        <ScrollingCarousel testimonials={testimonialsData} />
      </motion.div>
    </motion.section>
  );
}
