
import PublicNav from "@/src/components/layout/PublicNav";
import Footer from "@/src/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNav />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}