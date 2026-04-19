"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo, Variants } from "framer-motion";

const galleryImages = [
  { id: 1, url: "/images/landing/medical.jpg" },
  { id: 2, url: "/images/landing/repair.png" },
  { id: 3, url: "/images/landing/planting.png" },
  { id: 4, url: "/images/landing/onlineService.png" },
  { id: 5, url: "/images/landing/teaching.jpg" },
];

const gridPositions: Record<number, React.CSSProperties> = {
  1: { gridColumn: "1", gridRow: "1" },
  2: { gridColumn: "1", gridRow: "2" },
  3: { gridColumn: "2", gridRow: "1" },
  4: { gridColumn: "2", gridRow: "2" },
  5: { gridColumn: "3", gridRow: "1 / span 2" },
};

export default function SuccessGrid() {
  const [cards, setCards] = useState(galleryImages);
  const [isMobile, setIsMobile] = useState(false);
  const [dragDirection, setDragDirection] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setCards(galleryImages);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDragEnd = (info: PanInfo) => {
    if (isMobile && Math.abs(info.offset.x) > 80) {
      setDragDirection(info.offset.x);
      setCards((prev) => {
        const [movedCard, ...remaining] = prev;
        return [...remaining, movedCard];
      });
    }
  };


  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="w-full px-base py-xl3 md:py-xl5 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`
            ${
              isMobile
                ? "relative h-[480px] max-w-[320px] mx-auto flex items-center justify-center"
                : "grid grid-cols-3 grid-rows-2 gap-4 h-[600px]"
            } 
          `}
        >
          <AnimatePresence mode="popLayout">
            {cards.map((img, index) => (
              <motion.div
                key={img.id}
                variants={!isMobile ? itemVariants : undefined}
                layout
                className={`
                  ${isMobile ? "absolute inset-0" : "relative"}
                  rounded-3xl overflow-hidden shadow-lg bg-white border border-neutral-100
                `}
                style={{
                  zIndex: isMobile ? cards.length - index : 1,
                  ...(!isMobile ? gridPositions[img.id] : {}),
                }}
                initial={isMobile ? { scale: 0.9, opacity: 0 } : "hidden"}
                animate={{
                  opacity: 1,
                  scale: isMobile ? 1 - index * 0.05 : 1,
                  y: isMobile ? index * 12 : 0,
                  rotate: isMobile ? index * -2 : 0,
                }}
                exit={
                  isMobile
                    ? {
                        x: dragDirection > 0 ? 500 : -500,
                        opacity: 0,
                        transition: { duration: 0.4 },
                      }
                    : { opacity: 0 }
                }
                drag={isMobile && index === 0}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                onDragEnd={(_, info) => handleDragEnd(info)}
                whileDrag={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-110"
                  style={{ backgroundImage: `url(${img.url})` }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center mt-12 gap-3"
          >
            <div className="flex gap-1.5">
              {galleryImages.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    cards[0].id === galleryImages[i].id
                      ? "bg-primary-500 w-6"
                      : "bg-neutral-200 w-1.5"
                  }`}
                />
              ))}
            </div>
            <p className="text-neutral-400 text-[10px] font-bold tracking-widest uppercase">
              اسحبي البطاقة لليسار أو اليمين
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
