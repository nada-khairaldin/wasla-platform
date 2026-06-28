"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToSection } from "@/src/utils";
import Logo from "../ui/Logo";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

const Footer = () => {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const platformLinks = [
    { name: "كيف تعمل", href: "how-it-works" },
    { name: "مميزات المنصة", href: "features" },
    { name: "قصص النجاح", href: "success-stories" },
  ];

  const authLinks = [
    { name: "تسجيل الدخول", href: "/login" },
    { name: "انشاء حساب", href: "/signup" },
  ];

  return (
    <footer className="bg-primary-500 text-neutral-50 py-16 px-xl md:px-xl6 lg:px-xl8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 text-center md:text-right items-start">
        <div className="flex flex-col items-center md:items-start gap-6 md:col-span-2">
          <div className="flex items-center gap-4 group">
            <Logo isFooter />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-">
              وصلة
            </h2>
          </div>
          <p className="text-base md:text-lg  w-full max-w-prose">
            منصة مبتكرة لتبادل الخدمات باستخدام الوقت كعملة.
            <br className="hidden lg:block" />
            حول مهاراتك إلى رصيد زمني واستفد من خبرات الآخرين.
            <br className="hidden lg:block" />
            مجتمع تعاوني ينمو بالثقة.
          </p>
        </div>

        <div className="md:col-span-1 pt-4">
          <h3 className="text-xl  font-bold mb-6">عن المنصة</h3>
          <ul className="flex flex-col gap-4 ">
            {platformLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={`/?allowLanding=true#${link.href}`}
                  onClick={(e) => {
                    if (pathname === "/") {
                      scrollToSection(e, link.href);
                    }
                  }}
                  className="inline-block hover:text-primary-hover hover:-translate-x-1.5 transition-all duration-300 cursor-pointer"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-1 pt-4">
          {mounted && isAuthenticated ? (
            <ul className="flex flex-col gap-4">
              <li>
                <Link
                  href="/home"
                  className="inline-block hover:text-primary-hover hover:-translate-x-1.5 transition-all duration-300"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/my-posts"
                  className="inline-block hover:text-primary-hover hover:-translate-x-1.5 transition-all duration-300"
                >
                  منشوراتي
                </Link>
              </li>
              <li>
                <Link
                  href="/my-contracts"
                  className="inline-block hover:text-primary-hover hover:-translate-x-1.5 transition-all duration-300"
                >
                  عقودي
                </Link>
              </li>
              <li>
                <Link
                  href="/messages"
                  className="inline-block hover:text-primary-hover hover:-translate-x-1.5 transition-all duration-300"
                >
                  رسائلي
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="flex flex-col gap-4">
              {authLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="inline-block hover:text-primary-hover hover:-translate-x-1.5 transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-100 mt-xl5 pt-xl2 text-center md:text-right ">
        <p className="text-sm text-neutral-100">
          © {new Date().getFullYear()} منصة وصلة. جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
};

export default Footer;
