"use client";

import HeroSlider from "./HeroSlider";
import Button from "../../ui/Button";
import AvatarContainer from "../../ui/AvatarContainer";
import { MoveLeft } from "lucide-react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { scrollToSection } from "@/src/utils/scroll";

function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.section
      id="hero"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="flex flex-col gap-xl2 md:gap-xl3 mt-sm md:mt-[28px]"
    >
      <motion.div
        variants={itemVariants}
        className="px-base sm:px-xl4 md:px-xl6 lg:px-xl8 rounded-5xl"
      >
        <HeroSlider />
      </motion.div>

      <div className="flex flex-col justify-center items-center gap-md px-base text-center">
        <motion.h2
          variants={itemVariants}
          className="text-h4 sm:text-h3 md:text-h2 lg:text-title-3 font-bold leading-tight"
        >
          تبادل المهارات،
          <span className="text-primary-700"> و استثمر وقتك</span>
        </motion.h2>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-md"
        >
          <div className="text-body-3 sm:text-body-2 md:text-h6 max-w-[620px] font-regular text-neutral-500 leading-relaxed">
            <p>
              في وصلة، الوقت هو العملة الوحيدة. ساعة من البرمجة تساوي ساعة من
              التصميم.  <br />انضم إلى مجتمع أكاديمي يتبادل المعرفة بلا قيود مالية.
            </p>
          </div>
          <AvatarContainer />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center sm:flex-row gap-sm sm:gap-xl2 w-full"
        >
          <Link href="/signup">
            <Button size="lg" variant="filled" aria-label="انضم إلينا الآن مجاناً لبدء تبادل المهارات">
              ابدأ مجانًا
            </Button>
          </Link>

          <Button
            size="lg"
            variant="outline"
            className="group flex items-center gap-sm justify-center"
            onClick={(e) => scrollToSection(e, "how-it-works")}
            aria-label="تعرف على كيفية البدء"
          >
            اكتشف كيف تبدأ
            <motion.span
              className="inline-block"
              variants={{
                initial: { x: 0 },
                hover: { x: -5 },
              }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.6,
              }}
            >
              <MoveLeft className="group-hover:-translate-x-1.5 transition-transform duration-300" />
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default Hero;
