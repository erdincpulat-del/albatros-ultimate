import Link from "next/link";
import {
  Anchor,
  ArrowRight,
  Binoculars,
  BookOpen,
  Brain,
  Calculator,
  CheckCircle2,
  Compass,
  Gauge,
  MapPinned,
  Megaphone,
  Monitor,
  Radio,
  Radar,
  Route,
  Satellite,
  Shield,
  ShipWheel,
  Siren,
  Waves,
  Wind,
} from "lucide-react";

const levels = [
  {
    yye: "1",
    title: "TEMEL DENİZCİLİK",
    desc: "Denizcilik temelleri ve seyir için gerekli başlangıç bilgileri.",
    modules: [
      { title: "Buoyage", href: "/guide/buoyage", icon: Waves, desc: "Şamandıralar ve deniz işaretleri sistemi." },
      { title: "Cardinal İşaretler", href: "/guide/cardinals", icon: Shield, desc: "Kardinal şamandıralar ve güvenli geçiş." },
      { title: "Sound Signals", href: "/guide/sound-signals", icon: Megaphone, desc: "Ses işaretleri ve manevra kuralları." },
      { title: "Night Lights", href: "/guide/night-lights", icon: Siren, desc: "Fenerler, ışık karakterleri ve tanıma." },
    ],
  },
  {
    yye: "2",
    title: "SEYİR TEMELLERİ",
    desc: "Harita, hesaplama ve mevki bulma yöntemleri.",
    modules: [
      { title: "Navigation", href: "/guide/navigation", icon: Compass, desc: "Temel seyir bilgileri ve prensipler." },
      { title: "Formüller", href: "/guide/navigation/formulas", icon: Calculator, desc: "Seyir hesaplamaları ve formüller." },
      { title: "Passage Planning", href: "/guide/navigation/passage-planning", icon: Route, desc: "Rota planlama ve geçiş planı." },
      { title: "DR / EP / FIX", href: "/guide/navigation/dr-ep-fix", icon: MapPinned, desc: "DR, EP, Fix hesaplama ve plotting." },
    ],
  },
  {
    yye: "3",
    title: "ELEKTRONİK SEYİR",
    desc: "Elektronik seyir sistemleri ve radar teknolojileri.",
    modules: [
      { title: "Radar", href: "/guide/radar", icon: Radar, desc: "Radar kullanımı ve temel radar eğitimi." },
      { title: "AIS Engine", href: "/guide/ais-engine", icon: Satellite, desc: "AIS sistemi kullanımı ve hedef takibi." },
      { title: "ECDIS", href: "/guide/ecdis", icon: Monitor, desc: "Elektronik harita kullanımı." },
      { title: "Autopilot", href: "/guide/autopilot", icon: ShipWheel, desc: "Otomatik dümenleme sistemi." },
      { title: "Bridge Dashboard", href: "/guide/bridge-dashboard", icon: Gauge, desc: "Köprüüstü izleme ve kontrol paneli." },
    ],
  },
  {
    yye: "4",
    title: "PROFESYONEL KÖPRÜÜSTÜ",
    desc: "Çevresel etkiler, risk analizi ve COLREG kararları.",
    modules: [
      { title: "Tidal Stream", href: "/guide/navigation/tidal-stream", icon: Waves, desc: "Akıntı, set ve drift hesaplamaları." },
      { title: "Wind + Current", href: "/guide/navigation/wind-current", icon: Wind, desc: "Rüzgar ve akıntı birlikte vektör hesabı." },
      { title: "CPA / TCPA", href: "/guide/navigation/radar", icon: Compass, desc: "Radar plotting, CPA ve TCPA eğitimi." },
      { title: "COLREG", href: "/guide/colreg", icon: BookOpen, desc: "Çatışmayı önleme kuralları." },
      { title: "COLREG Engine", href: "/guide/colreg-engine", icon: Shield, desc: "COLREG karar motoru ve senaryo çözümü." },
    ],
  },
  {
    yye: "5",
    title: "İLERİ BRIDGE SYSTEMS",
    desc: "İleri seviye bridge sistemleri ve profesyonel uygulamalar.",
    modules: [
      { title: "GMDSS", href: "/guide/gmdss", icon: Radio, desc: "GMDSS iletişim ve acil durum prosedürleri." },
      { title: "Bridge AI", href: "/guide/bridge-alerts", icon: Brain, desc: "Yapay zeka destekli köprüüstü sistemi." },
      { title: "Advanced Planning", href: "/guide/passage-planning", icon: MapPinned, desc: "İleri geçiş planlama metotları." },
      { title: "Watchkeeping", href: "/guide/bridge-dashboard", icon: Binoculars, desc: "Vardiya tutma ve gözcülük prensipleri." },
      { title: "Emergency", href: "/guide/gmdss", icon: Siren, desc: "Acil durum yönetimi ve prosedürler." },
    ],
  },
];

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage: "url('/images/navigation/hero-premium.jpg')",
            backgroundSize: "82%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center -30px",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#020817] via-[#020817]/75 to-[#020817]/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/20 via-transparent to-[#020817]" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_58%)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(34,211,238,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.18)_1px,transparent_1px)] bg-[size:120px_120px]" />

        <div className="relative mx-auto max-w-7xl px-5 pt-24 pb-14 md:px-8 md:pt-32">
          <div className="relative z-10 mt-24 max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
              Albatros Sailing Academy
            </p>

            <h1 className="mt-4 text-6xl font-black leading-[0.88] tracking-[-0.04em] md:text-8xl">
              NAVIGATION
              <br />
              ACADEMY
              <br />
              <span className="text-cyan-300 drop-shadow-[0_0_28px_rgba(34,211,238,0.45)]">
                PRO
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-xl font-black leading-8">
              Haritayı oku. Rotayı çiz. Mevkini bul. Güvenle ilerle.
            </p>

            <p className="mt-4 max-w-2xl leading-8 text-slate-300">
              Harita okuma, rota çizimi, mevki bulma, DR, EP, Fix, Running Fix,
              tidal stream, risk analizi ve profesyonel passage planning için
              premium eğitim modülü.
            </p>

            <div className="mt-8 max-w-xl rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-5 shadow-[0_0_50px_rgba(34,211,238,0.12)] backdrop-blur-xl">
              <div className="flex gap-4">
                <Anchor className="h-7 w-7 shrink-0 text-cyan-300" />
                <p className="text-sm font-semibold leading-7 text-slate-200">
                  Elektronik cihazlar yardımcıdır; gerçek navigator haritayı,
                  pusulayı, zamanı, mesafeyi ve denizi birlikte okuyabilen kişidir.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid overflow-hidden rounded-3xl border border-cyan-300/30 bg-gradient-to-br from-[#0b2236]/80 via-[#071827]/80 to-[#030b14]/90 shadow-[0_0_70px_rgba(34,211,238,0.14)] backdrop-blur-xl md:grid-cols-4">
            {[
              ["7", "Ana Modül", BookOpen],
              ["25+", "Eğitim Konusu", Compass],
              ["40+", "Uygulama Örneği", Route],
              ["100%", "Seyir Emniyeti Odaklı", Shield],
            ].map(([value, label, Icon]) => (
              <div key={label as string} className="border-cyan-300/20 p-6 md:border-r last:border-r-0">
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_30px_rgba(34,211,238,0.10)]">
                    <Icon className="h-7 w-7 text-cyan-300" />
                  </div>
                  <div>
                    <div className="text-3xl font-black">{value as string}</div>
                    <div className="text-xs font-black uppercase tracking-wider text-slate-300">
                      {label as string}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section className="mt-8 space-y-5 pb-16">
            {levels.map((level) => (
              <div
                key={level.yye}
                className="grid gap-5 rounded-3xl border border-cyan-300/30 bg-gradient-to-br from-[#081827]/85 via-[#061421]/80 to-[#020817]/90 p-5 shadow-[0_0_70px_rgba(34,211,238,0.10)] backdrop-blur-xl lg:grid-cols-[285px_1fr]"
              >
                <div className="flex items-center gap-5 border-cyan-300/15 lg:border-r lg:pr-5">
                  <div className="rounded-3xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-4 text-center shadow-[0_0_40px_rgba(34,211,238,0.12)]">
                    <div className="text-sm font-black uppercase tracking-wider text-cyan-300">
                      YYE
                    </div>
                    <div className="text-7xl font-black leading-none text-cyan-300 drop-shadow-[0_0_18px_rgba(34,211,238,0.35)]">
                      {level.yye}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-black">{level.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {level.desc}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  {level.modules.map((module) => {
                    const Icon = module.icon;

                    return (
                      <Link
                        key={`${level.yye}-${module.title}-${module.href}`}
                        href={module.href}
                        className="group relative min-h-[210px] overflow-hidden rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-[#0b2236]/95 via-[#081520]/95 to-[#041018]/95 p-5 shadow-[0_0_30px_rgba(34,211,238,0.08)] transition duration-500 hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-cyan-300/10 hover:shadow-[0_0_40px_rgba(34,211,238,0.18)]"
                      >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_52%)] opacity-0 transition duration-500 group-hover:opacity-100" />
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent opacity-60" />

                        <div className="relative z-10">
                          <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_24px_rgba(34,211,238,0.12)]">
                            <Icon className="h-9 w-9 text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.28)]" />
                          </div>

                          <h3 className="mt-5 font-black text-white">
                            {module.title}
                          </h3>

                          <p className="mt-2 min-h-[48px] text-xs leading-5 text-slate-300">
                            {module.desc}
                          </p>

                          <div className="mt-5 flex items-center gap-2 text-sm font-black text-cyan-300">
                            Başla
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>

          <section className="mb-12 rounded-3xl border border-cyan-300/30 bg-gradient-to-br from-[#081827]/85 via-[#061421]/80 to-[#020817]/90 p-8 shadow-[0_0_70px_rgba(34,211,238,0.12)] backdrop-blur-xl">
            <div className="grid gap-6 md:grid-cols-4">
              <div className="flex items-center gap-4 md:col-span-1">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_35px_rgba(34,211,238,0.12)]">
                  <Anchor className="h-8 w-8 text-cyan-300" />
                </div>
                <p className="text-sm leading-7 text-slate-300">
                  Denizcilik sadece bilgi değil, tecrübe ve doğru karar sanatıdır.
                </p>
              </div>

              {[
                ["Doğru Bilgi", "Güncel ve güvenilir içerik."],
                ["Doğru Hesaplama", "Hesapla, kontrol et, doğrula."],
                ["Doğru Karar", "Emniyetli seyir, güvenli varış."],
              ].map(([title, text]) => (
                <div key={title} className="flex items-center gap-4">
                  <CheckCircle2 className="h-8 w-8 text-cyan-300" />
                  <div>
                    <h3 className="font-black">{title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}