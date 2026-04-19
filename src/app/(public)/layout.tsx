import '@/src/globals.css'
import PublicNav from '@/src/components/layout/PublicNav';
import Footer from '../../components/layout/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <PublicNav/>
        {children}
        <Footer/>
        </body>
    </html>
  );
}