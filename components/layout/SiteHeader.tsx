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
  desc?: string;
  external?: boolean;
};

type NavGroup = {
  key: string;
  label: string;
  href?: string;
  items?: MenuItem[];
};

export default function SiteHeader() {
  const pathname = usePathname();
  const { locale, setLocale } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  const navGroups = useMemo<NavGroup[]>(() => {
    const tr = locale === "tr";

    return [
      {
        key: "home",
        label: tr ? "Ana Sayfa" : "Home",
        href: "/",
      },
      {
        key: "simulator",
        label: tr ? "Simülatör" : "Simulator",
        href: "/simulator",
      },
      {
        key: "education",
        label: tr ? "Eğitim Modülleri" : "Education",
        href: "/guide",
        items: [
          { label: "Training Flow", href: "/guide" },
          { label: "COLREG", href: "/guide/colreg" },
          { label: "Buoyage", href: "/guide/buoyage" },
          { label: "Cardinals", href: "/guide/cardinals" },
          { label: "Night Lights", href: "/guide/night-lights" },
          { label: "Sound Signals", href: "/guide/sound-signals" },
          { label: "Weather", href: "/guide/weather" },
          { label: "Seamanship / Anchoring", href: "/guide/seamanship/anchoring" },
        ],
      },
      {
        key: "navigation",
        label: "Navigation Academy",
        href: "/guide/navigation",
        items: [
          { label: "Navigation Flow", href: "/guide/navigation" },
          { label: "Chart Plotter", href: "/guide/navigation/chart-plotter" },
          { label: "Chart Symbols", href: "/guide/navigation/chart-symbols" },
          { label: "DR / EP / Fix", href: "/guide/navigation/dr-ep-fix" },
          { label: "Formulas", href: "/guide/navigation/formulas" },
          { label: "Passage Planning", href: "/guide/navigation/passage-planning" },
          { label: "Radar", href: "/guide/navigation/radar" },
          { label: "Tidal Stream", href: "/guide/navigation/tidal-stream" },
          { label: "Wind & Current", href: "/guide/navigation/wind-current" },
        ],
      },
      {
        key: "bridge",
        label: "Bridge Tools",
        href: "/guide/bridge-dashboard",
        items: [
          { label: "Bridge Dashboard", href: "/guide/bridge-dashboard" },
          { label: "AIS Engine", href: "/guide/ais-engine" },
          { label: "Autopilot", href: "/guide/autopilot" },
          { label: "Bridge Alerts", href: "/guide/bridge-alerts" },
          { label: "ECDIS", href: "/guide/ecdis" },
          { label: "GMDSS", href: "/guide/gmdss" },
          { label: "COLREG Engine", href: "/guide/colreg-engine" },
        ],
      },
      {
        key: "charter",
        label: "Charter",
        href: "/charter",
        items: [
          { label: tr ? "Charter Ana Sayfa" : "Charter Home", href: "/charter" },
          { label: tr ? "Rezervasyon" : "Reservation", href: "/reserve/charter" },
          { label: tr ? "Charter Admin" : "Charter Admin", href: "/admin/charter/new" },
        ],
      },
      {
        key: "registry",
        label: "Registry",
        href: "/registry",
        items: [
          { label: "Registry", href: "/registry" },
          { label: "Verify", href: "/verify" },
          { label: "Certificate Cards", href: "/admin/cards" },
        ],
      },
      {
        key: "admin",
        label: "Admin",
        href: "/admin",
        items: [
          { label: "Admin Center", href: "/admin" },
          { label: "Certificates", href: "/admin/certificates" },
          { label: "Create Certificate", href: "/admin/certificates/new" },
          { label: "Cards", href: "/admin/cards" },
          { label: "Logs", href: "/admin/logs" },
          { label: "Inquiries", href: "/admin/inquiries" },
        ],
      },
    ];
  }, [locale]);

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-[1000] w-full border-b border-cyan-300/15 backdrop-blur-xl transition-all ${
          scrolled ? "bg-[#020617]/95" : "bg-[#020617]/80"
        }`}
      >
        <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/" className="group flex items-center gap-3 no-underline">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_30px_rgba(34,211,238,0.22)]">
              <Anchor className="h-6 w-6 text-cyan-300" />
            </div>

            <div className="leading-tight">
              <div className="text-[13px] font-black uppercase tracking-[0.24em] text-white">
                Albatros
              </div>
              <div className="text-[12px] font-black uppercase tracking-[0.18em] text-cyan-200">
                Sailing Academy
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 xl:flex">
            {navGroups.map((group) => {
              const active = isActive(pathname, group);

              return (
                <div
                  key={group.key}
                  className="relative pb-4 -mb-4"
                  onMouseEnter={() => setOpenMenu(group.key)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link
                    href={group.href || "#"}
                    className={`inline-flex items-center gap-1 text-[13px] font-black no-underline transition ${
                      active ? "text-cyan-300" : "text-slate-100 hover:text-cyan-200"
                    }`}
                  >
                    {group.label}
                    {group.items?.length ? <ChevronDown className="h-3 w-3" /> : null}
                  </Link>

                  {group.items?.length && openMenu === group.key ? (
                    <div className="absolute left-0 top-full w-[310px] rounded-3xl border border-white/10 bg-slate-950/95 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
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
            <button type="button" onClick={() => setLocale("tr")} style={langBtn(locale === "tr")}>
              TR
            </button>
            <button type="button" onClick={() => setLocale("en")} style={langBtn(locale === "en")}>
              EN
            </button>

            <a
              href={waLink(
                locale === "tr"
                  ? "Merhaba, Albatros Sailing hakkında bilgi almak istiyorum."
                  : "Hello, I would like information about Albatros Sailing."
              )}
              target="_blank"
              rel="noreferrer"
              className="ml-2 inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-100 no-underline shadow-[0_0_24px_rgba(34,211,238,0.22)] transition hover:bg-cyan-300/20"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
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
        <div className="fixed inset-0 z-[999] overflow-y-auto bg-slate-950/95 px-4 pb-8 pt-24 backdrop-blur-xl xl:hidden">
          <div className="mx-auto grid max-w-xl gap-3 rounded-3xl border border-cyan-300/15 bg-white/[0.03] p-4">
            {navGroups.map((group) => (
              <div key={group.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-2">
                <Link
                  href={group.href || "#"}
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

            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setLocale("tr")} style={langBtn(locale === "tr")}>
                TR
              </button>
              <button type="button" onClick={() => setLocale("en")} style={langBtn(locale === "en")}>
                EN
              </button>
            </div>

            <a
              href={waLink("Merhaba, Albatros Sailing hakkında bilgi almak istiyorum.")}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-4 text-sm font-black text-cyan-100 no-underline"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}

function isActive(pathname: string, group: NavGroup) {
  if (group.href && pathname === group.href) return true;
  return group.items?.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"));
}

function langBtn(active: boolean): CSSProperties {
  return {
    minHeight: 36,
    padding: "7px 11px",
    borderRadius: 999,
    border: active ? "1px solid rgba(103,211,255,0.55)" : "1px solid rgba(255,255,255,0.16)",
    background: active ? "#bff3ff" : "rgba(255,255,255,0.04)",
    color: active ? "#082032" : "#ffffff",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
  };
}