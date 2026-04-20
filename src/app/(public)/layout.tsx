import "@/src/globals.css";
import PublicNav from "@/src/components/layout/PublicNav";
import Footer from "../../components/layout/Footer";

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
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <PublicNav />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
