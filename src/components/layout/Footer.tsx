"use client";
import Link from "next/link";
import { scrollToSection } from "@/src/utils/scroll";
import Logo from "../ui/Logo";

const Footer = () => {
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
                <a
                  href={`${link.href}`}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="inline-block hover:text-primary-hover hover:-translate-x-1.5 transition-all duration-300 cursor-pointer"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-1 pt-4">
          <h3 className="text-xl  font-bold mb-6">الرئيسية</h3>
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
        </div>
      </div>

      <div className="border-t border-neutral-200 mt-xl5 pt-xl2 text-center md:text-right ">
        <p className="text-sm text-neutral-200">
          © {new Date().getFullYear()} منصة وصلة. جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
};

export default Footer;
