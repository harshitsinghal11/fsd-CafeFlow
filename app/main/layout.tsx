import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import FloatingCart from "@/src/components/shared/FloatingCart";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <> {/* <--- Use a Fragment, NOT html/body */}
      <Navbar />
      
      {/* This renders the page content (e.g. Menu, Checkout) */}
      {children}
      
      <Footer />
      <FloatingCart />
    </>
  );
}
