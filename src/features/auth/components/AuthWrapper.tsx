"use client";

import Image from "next/image";
import Logo from "../../../components/ui/Logo";
import { motion } from "framer-motion"; // استيراد المكتبة

interface AuthWrapperProp {
  children: React.ReactNode;
  src: string;
  alt: string;
}

function AuthWrapper({ children, src, alt }: AuthWrapperProp) {
  return (
   <div className="flex min-h-screen lg:pr-xl items-start bg-white">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col w-full p-base md:p-xl3 justify-center items-center lg:w-1/2 lg:items-stretch lg:rounded-l-[50px] lg:rounded-t-[50px] z-10 lg:-ml-[50px] bg-white"
      >
        <div className="mb-xl6 self-start">
          <Logo />
        </div>
        <div className="w-full max-w-[600px] lg:max-w-none mx-auto">
          {children}
        </div>
      </motion.div>

      <div className="hidden lg:block lg:flex-1 relative self-stretch">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-full w-full"
          >
            <Image src={src} alt={alt} fill priority className="object-cover" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AuthWrapper;
