import { Toaster } from "sonner";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f8f8f8]" suppressHydrationWarning> 
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}