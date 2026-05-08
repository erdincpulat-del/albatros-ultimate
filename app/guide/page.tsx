import Link from "next/link";
import {
  Anchor,
  BookOpen,
  Calculator,
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
  Brain,
  Binoculars,
  ArrowRight,
  CheckCircle2,
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
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: "url('/images/navigation/hero-chart.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020817] via-[#020817]/78 to-[#020817]/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/30 via-transparent to-[#020817]" />

        <div className="relative mx-auto max-w-7xl px-5 py-8 md:px-8">
          <header className="flex items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10">
                <Anchor className="h-6 w-6 text-cyan-300" />
              </div>
              <div>
                <div className="text-xl font-black tracking-wider">ALBATROS</div>
                <div className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
                  Sailing Academy
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-8 text-sm font-black md:flex">
              <Link href="/">Ana Sayfa</Link>
              <Link href="/simulator">Simülatör</Link>
              <Link href="/guide" className="text-cyan-300 underline underline-offset-8">
                Eğitim Modülleri
              </Link>
              <Link href="/guide/navigation">Kütüphane</Link>
              <Link href="/guide/navigation/formulas">Araçlar</Link>
            </nav>

            <Link
              href="https://wa.me/"
              className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-black text-white"
            >
              WhatsApp
            </Link>
          </header>

          <div className="mt-20 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
              Albatros Sailing Academy
            </p>

            <h1 className="mt-4 text-6xl font-black leading-[0.92] tracking-tight md:text-7xl">
              NAVIGATION
              <br />
              ACADEMY
              <br />
              <span className="text-cyan-300">PRO</span>
            </h1>

            <p className="mt-6 max-w-xl text-xl font-black leading-8">
              Haritayı oku. Rotayı çiz. Mevkini bul. Güvenle ilerle.
            </p>

            <p className="mt-4 max-w-2xl leading-8 text-slate-300">
              Harita okuma, rota çizimi, mevki bulma, DR, EP, Fix, Running Fix,
              tidal stream, risk analizi ve profesyonel passage planning için
              premium eğitim modülü.
            </p>

            <div className="mt-7 max-w-md rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-5">
              <div className="flex gap-4">
                <Anchor className="h-7 w-7 shrink-0 text-cyan-300" />
                <p className="text-sm font-semibold leading-7 text-slate-200">
                  Elektronik cihazlar yardımcıdır; gerçek navigator haritayı,
                  pusulayı, zamanı, mesafeyi ve denizi birlikte okuyabilen kişidir.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-950/70 md:grid-cols-4">
            {[
              ["7", "Ana Modül", BookOpen],
              ["25+", "Eğitim Konusu", Compass],
              ["40+", "Uygulama Örneği", Route],
              ["100%", "Seyir Emniyeti Odaklı", Shield],
            ].map(([value, label, Icon]) => (
              <div key={label as string} className="border-cyan-300/15 p-6 md:border-r">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10">
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

          <section className="mt-8 space-y-4 pb-16">
            {levels.map((level) => (
              <div
                key={level.yye}
                className="grid gap-4 rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-4 shadow-2xl shadow-cyan-950/20 lg:grid-cols-[250px_1fr]"
              >
                <div className="flex items-center gap-5 border-cyan-300/10 lg:border-r lg:pr-5">
                  <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-4 text-center">
                    <div className="text-sm font-black uppercase tracking-wider text-cyan-300">
                      YYE
                    </div>
                    <div className="text-6xl font-black text-cyan-300">
                      {level.yye}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-black">{level.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {level.desc}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  {level.modules.map((module) => {
                    const Icon = module.icon;

                    return (
                      <Link
  key={`${level.yye}-${module.title}-${module.href}`}
  href={module.href}
  className="group rounded-2xl border border-cyan-300/15 bg-[#061421]/80 p-4 transition hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-cyan-300/10"
>
                        <Icon className="h-9 w-9 text-cyan-300" />

                        <h3 className="mt-4 font-black text-white">
                          {module.title}
                        </h3>

                        <p className="mt-2 min-h-[44px] text-xs leading-5 text-slate-300">
                          {module.desc}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-sm font-black text-cyan-300">
                          Başla
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>

          <section className="mb-12 rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-8">
            <div className="grid gap-6 md:grid-cols-4">
              <div className="flex items-center gap-4 md:col-span-1">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10">
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