import AppNavbar from "../../components/layout/AppNavbar";
import Footer from "../../components/layout/Footer";
import UserBootstrap from "@/src/features/auth/components/UserBootstrap";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UserBootstrap />
      <div className="flex flex-col min-h-screen">
        <AppNavbar />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
      </>
  );
}

export default layout;
