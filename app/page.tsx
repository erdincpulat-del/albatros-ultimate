import Link from "next/link";

const moduleGroups = [
  {
    title: "Elektronik Seyir Sistemleri",
    description:
      "Radar, AIS, ECDIS, ARPA, Autopilot, Bridge AI ve alarm yönetim sistemleri.",
    items: [
      {
        title: "Bridge Dashboard",
        href: "/guide/bridge-dashboard",
        desc: "Tüm bridge sistemlerinin birleşik kontrol merkezi.",
      },
      {
        title: "Radar / ARPA",
        href: "/guide/radar",
        desc: "CPA, TCPA ve hedef takip sistemi.",
      },
      {
        title: "AIS Engine",
        href: "/guide/ais-engine",
        desc: "AIS target tracking ve trafik farkındalığı.",
      },
      {
        title: "ECDIS",
        href: "/guide/ecdis",
        desc: "Elektronik harita ve rota izleme sistemi.",
      },
      {
        title: "Autopilot",
        href: "/guide/autopilot",
        desc: "Track control, XTE ve heading hold sistemi.",
      },
      {
        title: "Bridge Alerts",
        href: "/guide/bridge-alerts",
        desc: "Radar, AIS, ECDIS ve alarm yönetimi.",
      },
      {
        title: "Bridge AI",
        href: "/guide/colreg-engine",
        desc: "COLREG karar destek ve çarpışma önleme motoru.",
      },
    ],
  },
  {
    title: "Denizcilik Kuralları ve İşaretler",
    description:
      "COLREG, gece seyir fenerleri, ses işaretleri ve GMDSS distress prosedürleri.",
    items: [
      {
        title: "COLREG",
        href: "/guide/colreg",
        desc: "Çatışmayı önleme kuralları ve geçiş durumları.",
      },
      {
        title: "Night Lights",
        href: "/guide/night-lights",
        desc: "Gece seyir fenerleri ve gemi tanımlama sistemi.",
      },
      {
        title: "Sound Signals",
        href: "/guide/sound-signals",
        desc: "Düdük, sis ve manevra işaretleri.",
      },
      {
        title: "GMDSS",
        href: "/guide/gmdss",
        desc: "MAYDAY, DSC, EPIRB ve acil durum haberleşmesi.",
      },
    ],
  },
  {
    title: "Navigasyon ve Seyir Bilgisi",
    description:
      "Samandıralar, kardinal işaretler, rota planlama ve seyir emniyeti.",
    items: [
      {
        title: "Buoyage",
        href: "/guide/buoyage",
        desc: "IALA samandıra sistemi ve lateral işaretler.",
      },
      {
        title: "Cardinals",
        href: "/guide/cardinals",
        desc: "Kardinal işaretler ve güvenli geçiş yönleri.",
      },
      {
        title: "Passage Planning",
        href: "/guide/passage-planning",
        desc: "Waypoint, ETA, alternatif rota ve seyir planlama.",
      },
    ],
  },
];

const liveItems = [
  "Radar Tracking",
  "AIS Monitoring",
  "CPA / TCPA",
  "Bridge Alerts",
  "Autopilot",
  "ECDIS",
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <section className="relative px-4 pb-20 pt-24 md:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.2),rgba(2,6,23,1))]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-xs font-black tracking-[0.45em] text-cyan-300">
              ALBATROS SAILING — YYE PLATFORM
            </p>

            <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">
              Gerçek Köprüüstü
              <br />
              Eğitim Ekosistemi
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
              Radar, ARPA, AIS, ECDIS, COLREG, GMDSS, Autopilot, Bridge Alert,
              samandıralar, kardinal işaretler ve navigasyon eğitim sistemlerini
              tek profesyonel denizcilik platformunda birleştiren interaktif YYE
              eğitim altyapısı.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/simulator"
                className="rounded-full bg-cyan-300 px-7 py-4 text-sm font-black text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.35)] transition hover:scale-105"
              >
                Simülatöre Gir
              </Link>

              <Link
                href="#egitim-modulleri"
                className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-7 py-4 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/20"
              >
                Eğitim Modülleri
              </Link>
            </div>
          </div>

          <div className="mt-20 grid gap-6 lg:grid-cols-3">
            <div className="rounded-[34px] border border-cyan-300/20 bg-cyan-300/5 p-7 backdrop-blur-xl lg:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black tracking-[0.3em] text-cyan-300">
                    LIVE STATUS
                  </p>

                  <h2 className="mt-3 text-3xl font-black">
                    Systems Integrated
                  </h2>
                </div>

                <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black text-emerald-300">
                  ACTIVE
                </div>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {moduleGroups[0].items.slice(0, 4).map((module) => (
                  <Link
                    key={module.title}
                    href={module.href}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-300/10"
                  >
                    <h3 className="text-lg font-black">{module.title}</h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {module.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
              <p className="text-xs font-black tracking-[0.3em] text-cyan-300">
                BRIDGE CORE
              </p>

              <h3 className="mt-4 text-3xl font-black">Maritime AI</h3>

              <p className="mt-5 text-sm leading-7 text-slate-300">
                Elektronik seyir sistemleri, denizcilik kuralları ve navigasyon
                bilgisi tek bridge eğitim mantığı altında birleşerek gerçek
                zabit karar mekanizması deneyimi oluşturur.
              </p>

              <div className="mt-8 space-y-3">
                {liveItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-cyan-300/10 bg-cyan-300/5 px-4 py-3 text-sm font-black text-cyan-100"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="egitim-modulleri" className="px-4 pb-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.35em] text-cyan-300">
                TRAINING SYSTEMS
              </p>

              <h2 className="mt-4 text-4xl font-black md:text-5xl">
                Eğitim Modülleri
              </h2>
            </div>

            <div className="w-fit rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-2 text-xs font-black tracking-[0.25em] text-cyan-100">
              BRIDGE READY
            </div>
          </div>

          <div className="mt-12 space-y-10">
            {moduleGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-[34px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl md:p-8"
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-white">
                    {group.title}
                  </h3>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                    {group.description}
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((module) => (
                    <Link
                      key={module.title}
                      href={module.href}
                      className="group rounded-3xl border border-white/10 bg-[#07111f]/90 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-300/[0.08]"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="text-xl font-black text-white">
                          {module.title}
                        </h4>

                        <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black tracking-[0.25em] text-cyan-200">
                          ACTIVE
                        </div>
                      </div>

                      <p className="mt-5 text-sm leading-7 text-slate-300">
                        {module.desc}
                      </p>

                      <div className="mt-8 text-xs font-black tracking-[0.25em] text-cyan-300 transition group-hover:translate-x-1">
                        MODÜLE GİR →
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}