"use client";
import AppNavbar from "../../components/layout/AppNavbar";
import Footer from "../../components/layout/Footer";
import UserBootstrap from "@/src/features/auth/components/UserBootstrap";
import { usePathname } from 'next/navigation';



export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatPage = pathname.startsWith("/messages");

  return (
    <div className="flex flex-col min-h-screen">
      <UserBootstrap />
      <AppNavbar /> 
      <main className="flex-grow relative">
        {children}
      </main>
      {!isChatPage && <Footer />}
    </div>
  );
}

