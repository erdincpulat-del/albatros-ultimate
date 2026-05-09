import Link from "next/link";
import {
  Anchor,
  BookOpen,
  CheckCircle2,
  Compass,
  Lock,
  Map,
  Navigation,
  Radar,
  Route,
  ShieldCheck,
  Waves,
  CloudSun,
} from "lucide-react";
const modules = [
  {
    step: "01",
    title: "Chart Symbols",
    desc: "Harita sembolleri, derinlik eğrileri, batıklar, obstruction ve chart reading temeli.",
    href: "/guide/chart-symbols",
    status: "READY",
    icon: Map,
  },
  {
    step: "02",
    title: "Buoyage",
    desc: "IALA şamandıra sistemi, lateral işaretler ve güvenli geçiş mantığı.",
    href: "/guide/buoyage",
    status: "NEXT",
    icon: Anchor,
  },
  {
    step: "03",
    title: "Sector Lights",
    desc: "Fener sektörleri, güvenli yaklaşma hattı ve gece seyri okuması.",
    href: "/guide/navigation/sector-lights",
    status: "NEXT",
    icon: Waves,
  },
  {
    step: "04",
    title: "Compass Rose",
    desc: "True north, magnetic north, variation ve rota dönüşümleri.",
    href: "/guide/navigation/compass-rose",
    status: "NEXT",
    icon: Compass,
  },
  {
    step: "05",
    title: "DR / EP / FIX",
    desc: "Dead Reckoning, Estimated Position, Fix ve plotting mantığı.",
    href: "/guide/navigation/dr-ep-fix",
    status: "ACTIVE",
    icon: Navigation,
  },
  {
    step: "06",
    title: "Tidal Stream",
    desc: "Set, drift, CTS, COG ve akıntı düzeltme hesapları.",
    href: "/guide/navigation/tidal-stream",
    status: "ACTIVE",
    icon: Waves,
  },
  {
    step: "07",
    title: "Passage Planning",
    desc: "Waypoint, ETA, alternatif liman, risk analizi ve rota planlama.",
    href: "/guide/navigation/passage-planning",
    status: "NEXT",
    icon: Route,
  },
  {
    step: "08",
    title: "Radar",
    desc: "Radar yorumlama, CPA/TCPA ve collision avoidance eğitimi.",
    href: "/guide/navigation/radar",
    status: "NEXT",
    icon: Radar,
  },
  {
    step: "09",
    title: "COLREG Integration",
    desc: "COLREG karar motoru, geçiş öncelikleri ve çatışma senaryoları.",
    href: "/guide/navigation/colreg-integration",
    status: "NEXT",
    icon: ShieldCheck,
  },
  {
    step: "10",
    title: "Weather & Marine Meteorology",
    desc:
      "Isobar reading, fronts, cloud interpretation, fog, squall prediction, regional winds ve offshore weather kararları.",
    href: "/guide/weather",
    status: "NEXT",
    icon: CloudSun,
  },

  {
    step: "11",
    title: "Final Navigation Assessment",
    desc:
      "Tüm navigation eğitimlerinin final değerlendirme senaryosu.",
    href: "/guide/navigation/final-assessment",
    status: "LOCKED",
    icon: Lock,
  }
];

function statusStyle(status: string) {
  if (status === "READY") {
    return "border-green-300/40 bg-green-300/10 text-green-300";
  }

  if (status === "ACTIVE") {
    return "border-cyan-300/40 bg-cyan-300/10 text-cyan-300";
  }

  if (status === "LOCKED") {
    return "border-slate-500/30 bg-slate-500/10 text-slate-400";
  }

  return "border-amber-300/35 bg-amber-300/10 text-amber-300";
}

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020817] px-6 py-24 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: "url('/images/navigation/hero-premium.jpg')",
          backgroundSize: "85%",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#020817]/90 via-[#020817]/65 to-[#020817]/35" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#020817]/10 via-[#020817]/70 to-[#020817]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(34,211,238,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.18)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
          Albatros Sailing Academy
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-[-0.04em] md:text-7xl">
          Navigation
          <span className="block text-cyan-300 drop-shadow-[0_0_28px_rgba(34,211,238,0.45)]">
            Training Flow
          </span>
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
          Harita okuma ile başlayıp radar, COLREG entegrasyonu ve final
          navigation assessment seviyesine ilerleyen profesyonel eğitim akışı.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-5">
            <BookOpen className="h-6 w-6 text-cyan-300" />
            <div className="mt-3 text-3xl font-black">10</div>
            <div className="text-xs font-black uppercase tracking-wider text-slate-300">
              Eğitim Modülü
            </div>
          </div>

          <div className="rounded-2xl border border-green-300/25 bg-green-300/10 p-5">
            <CheckCircle2 className="h-6 w-6 text-green-300" />
            <div className="mt-3 text-3xl font-black">1</div>
            <div className="text-xs font-black uppercase tracking-wider text-slate-300">
              Hazır Modül
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-5">
            <Navigation className="h-6 w-6 text-cyan-300" />
            <div className="mt-3 text-3xl font-black">2</div>
            <div className="text-xs font-black uppercase tracking-wider text-slate-300">
              Aktif Simülasyon
            </div>
          </div>

          <div className="rounded-2xl border border-amber-300/25 bg-amber-300/10 p-5">
            <Lock className="h-6 w-6 text-amber-300" />
            <div className="mt-3 text-3xl font-black">1</div>
            <div className="text-xs font-black uppercase tracking-wider text-slate-300">
              Final Assessment
            </div>
          </div>
        </div>

        <section className="mt-14 grid gap-5">
          {modules.map((module, index) => {
            const Icon = module.icon;
            const locked = module.status === "LOCKED";

            return (
              <Link
                key={module.title}
                href={locked ? "#" : module.href}
                className={`group relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-slate-950/45 p-5 backdrop-blur-xl transition ${
                  locked
                    ? "cursor-not-allowed opacity-60"
                    : "hover:border-cyan-300/55 hover:bg-cyan-300/10 hover:shadow-[0_0_55px_rgba(34,211,238,0.14)]"
                }`}
              >
                <div className="absolute left-10 top-0 h-full w-px bg-cyan-300/20" />

                {index < modules.length - 1 ? (
                  <div className="absolute left-10 top-16 h-full w-px bg-gradient-to-b from-cyan-300/60 to-transparent" />
                ) : null}

                <div className="relative z-10 grid gap-5 md:grid-cols-[90px_1fr_160px] md:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-3xl font-black text-cyan-300">
                      {module.step}
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Icon className="h-6 w-6 text-cyan-300" />

                      <h2 className="text-2xl font-black text-white">
                        {module.title}
                      </h2>

                      <span
                        className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${statusStyle(
                          module.status
                        )}`}
                      >
                        {module.status}
                      </span>
                    </div>

                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                      {module.desc}
                    </p>
                  </div>

                  <div className="text-sm font-black uppercase tracking-wider text-cyan-300">
                    {locked ? "Kilitli" : "Modüle Gir →"}
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}