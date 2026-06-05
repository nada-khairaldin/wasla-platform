"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
type ContractModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function ContractModal({
  isOpen,
  onClose,
  children,
}: ContractModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (typeof window === "undefined") return null;

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      y: 10,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto custom-scrollbar-container">
          <motion.div
            className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          <motion.div
            className="relative bg-white rounded-[28px] w-full max-w-2xl shadow-2xl z-10 overflow-hidden my-auto text-right dir-rtl"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute left-6 top-6 p-2 text-neutral-400 hover:text-neutral-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer z-20"
            >
              <X size={20} />
            </button>

            <div className="max-h-[90vh] overflow-y-auto custom-scrollbar p-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
