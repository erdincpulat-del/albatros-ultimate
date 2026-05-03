import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import FloatingContact from "@/components/layout/FloatingContact";

export const metadata: Metadata = {
  title: "Albatros Sailing | YYE Platform",
  description:
    "Albatros Sailing YYE eğitim platformu, yelkenli simülasyon, akademi ve premium denizcilik deneyimi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <div className="min-h-screen bg-slate-950 text-white">
          <SiteHeader />
          {children}
          <SiteFooter />
          <FloatingContact />
        </div>
      </body>
    </html>
  );
}