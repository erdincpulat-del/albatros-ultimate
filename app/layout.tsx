import type { Metadata } from "next";
import "./globals.css";

import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import FloatingContact from "@/components/layout/FloatingContact";
import { LanguageProvider } from "@/contexts/LanguageProvider";

export const metadata: Metadata = {
  title: "Albatros Sailing | YYE Platform",
  description:
    "Albatros Sailing YYE eğitim platformu, bridge simülasyon sistemi ve denizcilik eğitim modülleri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="bg-slate-950 text-white">
        <LanguageProvider>
          <div className="min-h-screen overflow-x-hidden">
            <SiteHeader />

            <main>{children}</main>

            <SiteFooter />
            <FloatingContact />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}