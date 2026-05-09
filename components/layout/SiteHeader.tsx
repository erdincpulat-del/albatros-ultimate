"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Anchor, ChevronDown, MessageCircle } from "lucide-react";

const navItems = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Simülatör", href: "/simulator" },
  { label: "Eğitim Modülleri", href: "/guide" },
  { label: "Navigation Academy", href: "/guide/navigation" },
  { label: "Bridge Tools", href: "/guide/navigation/formulas" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-300/15 bg-[#020817]/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_35px_rgba(34,211,238,0.16)]">
            <Anchor className="h-6 w-6 text-cyan-300" />
          </div>

          <div className="leading-tight">
            <div className="text-lg font-black tracking-wider text-white">
              ALBATROS
            </div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
              Sailing Academy
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-black md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-1 transition ${
                  active ? "text-cyan-300" : "text-white/90 hover:text-cyan-300"
                }`}
              >
                {item.label}

                {(item.label === "Eğitim Modülleri" ||
                  item.label === "Navigation Academy") && (
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                )}

                <span
                  className={`absolute -bottom-2 left-0 h-[2px] rounded-full bg-cyan-300 transition-all ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <Link
          href="https://wa.me/"
          className="inline-flex items-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-black text-white shadow-[0_0_35px_rgba(34,211,238,0.14)] transition hover:bg-cyan-300/20"
        >
          <MessageCircle className="h-4 w-4 text-cyan-300" />
          WhatsApp
        </Link>
      </div>
    </header>
  );
}