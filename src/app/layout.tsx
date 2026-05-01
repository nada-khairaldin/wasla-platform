import "@/src/globals.css";
import { Toaster } from "react-hot-toast";
export const metadata = {
  title: {
    default: "منصة وصلة | بنك الوقت في غزة",
    template: "%s | منصة وصلة",
  },
  description:
    "وصلة هي منصة رقمية مبتكرة في غزة تهدف لتبادل الخدمات والمهارات بين الأفراد باستخدام الوقت كعملة بديلة.",
  keywords: [
    "وصلة",
    "بنك الوقت",
    "غزة",
    "تبادل مهارات",
    "عمل تطوعي",
    "Palestine",
  ],

  alternates: {
    canonical: "https://wasla-five.vercel.app/",
  },
  openGraph: {
    title: "منصة وصلة | بنك الوقت في غزة",
    description: "استثمر وقتك وشارك مهاراتك مع مجتمعك في غزة.",
    url: "https://wasla-five.vercel.app/",
    siteName: "Wasla",
    locale: "ar_PS",
    type: "website",
  },
};

// src/app/layout.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}