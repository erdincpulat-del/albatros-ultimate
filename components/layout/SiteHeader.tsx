"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { Anchor, ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";

const WHATSAPP_NUMBER = "905324873813";

const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

type MenuItem = {
  label: string;
  href: string;
};

type NavGroup = {
  key: string;
  label: string;
  href: string;
  items?: MenuItem[];
};

export default function SiteHeader() {
  const pathname = usePathname();
  const { locale, setLocale } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  const tr = locale === "tr";

  const navGroups = useMemo<NavGroup[]>(
    () => [
      {
        key: "home",
        label: tr ? "Ana Sayfa" : "Home",
        href: "/",
      },
      {
        key: "education",
        label: tr ? "Eğitim" : "Education",
        href: "/guide",
        items: [
          { label: tr ? "Eğitim Modülleri" : "Training Modules", href: "/guide" },
          { label: "COLREG", href: "/guide/colreg" },
          { label: "Buoyage", href: "/guide/buoyage" },
          { label: tr ? "Gece Fenerleri" : "Night Lights", href: "/guide/night-lights" },
          { label: tr ? "Meteoroloji" : "Weather", href: "/guide/weather" },
          { label: tr ? "Demirleme" : "Anchoring", href: "/guide/seamanship/anchoring" },
        ],
      },
      {
        key: "charter",
        label: "Charter",
        href: "/charter",
        items: [
          { label: tr ? "Charter Ana Sayfa" : "Charter Home", href: "/charter" },
          { label: tr ? "Rezervasyon" : "Reservation", href: "/reserve/charter" },
        ],
      },
      {
        key: "navigation",
        label: "Navigation",
        href: "/guide/navigation",
        items: [
          { label: "Navigation Academy", href: "/guide/navigation" },
          { label: "Chart Plotter", href: "/guide/navigation/chart-plotter" },
          { label: "DR / EP / Fix", href: "/guide/navigation/dr-ep-fix" },
          { label: "Passage Planning", href: "/guide/navigation/passage-planning" },
          { label: "Radar", href: "/guide/navigation/radar" },
          { label: "Bridge Tools", href: "/guide/navigation/formulas" },
          {label: "Marina Simulator",href: "/simulator/marina"},
        ],
      },
      {
        key: "verify",
        label: tr ? "Doğrulama" : "Verify",
        href: "/verify",
        items: [
          { label: tr ? "Sertifika Doğrula" : "Verify Certificate", href: "/verify" },
          { label: "Registry", href: "/registry" },
          { label: tr ? "Kart Sistemi" : "Card System", href: "/card" },
        ],
      },
    ],
    [tr]
  );

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-[1000] w-full border-b backdrop-blur-2xl transition-all duration-300 ${
          scrolled
            ? "border-cyan-300/15 bg-[#020617]/95 shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
            : "border-white/10 bg-[#020617]/78"
        }`}
      >
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-5 px-5 py-4">
          <Link href="/" className="group flex items-center gap-3 no-underline">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/35 bg-cyan-300/10 shadow-[0_0_34px_rgba(34,211,238,0.22)]">
              <Anchor className="h-6 w-6 text-cyan-200" />
              <div className="absolute inset-0 rounded-2xl bg-cyan-300/10 blur-xl" />
            </div>

            <div className="leading-tight">
              <div className="text-[13px] font-black uppercase tracking-[0.28em] text-white">
                Albatros Sailing
              </div>
              <div className="text-[12px] font-semibold tracking-[0.08em] text-cyan-200/90">
                Premium Sailing Academy
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 xl:flex">
            {navGroups.map((group) => {
              const active = isActive(pathname, group);

              return (
                <div
                  key={group.key}
                  className="relative -mb-4 pb-4"
                  onMouseEnter={() => setOpenMenu(group.key)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link
                    href={group.href}
                    className={`inline-flex items-center gap-1 text-sm font-black no-underline transition ${
                      active ? "text-cyan-300" : "text-slate-100 hover:text-cyan-200"
                    }`}
                  >
                    {group.label}
                    {group.items?.length ? <ChevronDown className="h-3.5 w-3.5" /> : null}
                  </Link>

                  {group.items?.length && openMenu === group.key ? (
                    <div className="absolute left-1/2 top-full w-[300px] -translate-x-1/2 rounded-[1.5rem] border border-white/10 bg-slate-950/95 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                      {group.items.map((item) => (
                        <Link
                          key={item.href + item.label}
                          href={item.href}
                          className="block rounded-2xl px-4 py-3 text-sm font-bold text-slate-100 no-underline transition hover:bg-cyan-300/10 hover:text-cyan-200"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            <Link
              href="/admin"
              className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-black text-white no-underline transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100"
            >
              Admin
            </Link>

            <a
              href={waLink(
                tr
                  ? "Merhaba, Albatros Sailing hakkında bilgi almak istiyorum."
                  : "Hello, I would like information about Albatros Sailing."
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/12 px-4 py-2 text-sm font-black text-cyan-100 no-underline shadow-[0_0_26px_rgba(34,211,238,0.22)] transition hover:bg-cyan-300/20"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>

            <button type="button" onClick={() => setLocale("tr")} style={langBtn(locale === "tr")}>
              TR
            </button>
            <button type="button" onClick={() => setLocale("en")} style={langBtn(locale === "en")}>
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-white xl:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[999] overflow-y-auto bg-slate-950/96 px-4 pb-8 pt-24 backdrop-blur-xl xl:hidden">
          <div className="mx-auto grid max-w-xl gap-3 rounded-3xl border border-cyan-300/15 bg-white/[0.03] p-4">
            {navGroups.map((group) => (
              <div key={group.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-2">
                <Link
                  href={group.href}
                  className="block rounded-xl px-3 py-3 text-base font-black text-cyan-100 no-underline"
                >
                  {group.label}
                </Link>

                {group.items?.length ? (
                  <div className="grid gap-1 px-2 pb-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        className="rounded-xl px-3 py-2 text-sm font-bold text-slate-300 no-underline hover:bg-cyan-300/10"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            <Link
              href="/admin"
              className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-4 text-center text-sm font-black text-white no-underline"
            >
              Admin
            </Link>

            <a
              href={waLink("Merhaba, Albatros Sailing hakkında bilgi almak istiyorum.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-4 text-sm font-black text-cyan-100 no-underline"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setLocale("tr")} style={langBtn(locale === "tr")}>
                TR
              </button>
              <button type="button" onClick={() => setLocale("en")} style={langBtn(locale === "en")}>
                EN
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function isActive(pathname: string, group: NavGroup) {
  if (pathname === group.href) return true;
  return group.items?.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"));
}

function langBtn(active: boolean): CSSProperties {
  return {
    minHeight: 36,
    padding: "7px 11px",
    borderRadius: 999,
    border: active
      ? "1px solid rgba(103,211,255,0.55)"
      : "1px solid rgba(255,255,255,0.16)",
    background: active ? "#bff3ff" : "rgba(255,255,255,0.04)",
    color: active ? "#082032" : "#ffffff",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
  };
}