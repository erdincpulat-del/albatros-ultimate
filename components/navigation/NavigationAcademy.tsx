import Link from "next/link";
import {
  Anchor,
  ArrowRight,
  BookMarked,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Gauge,
  Map,
  MapPinned,
  Navigation,
  Radar,
  Route,
  Shield,
  ShipWheel,
  Timer,
  TriangleAlert,
} from "lucide-react";

import NavigationMapPanel from "@/components/navigation/NavigationMapPanel";
import RoutePlannerSimulator from "@/components/navigation/RoutePlannerSimulator";
import NavigationTrainingModules from "@/components/navigation/NavigationTrainingModules";
import NavigationFormulaVisualizer from "@/components/navigation/NavigationFormulaVisualizer";

import {
  chartDefinition,
  chartInformation,
  chartTools,
  electronicFailureScenario,
  finalCta,
  navigationFormulas,
  navigationHero,
  navigationLevels,
  positionMethods,
  professionalChecklist,
  professionalNavigator,
  riskCards,
  routePlanningSteps,
} from "@/lib/navigation/navigationContent";

export default function NavigationAcademy() {
  const hudItems = [
    { label: "True Course", value: "087°", icon: Compass },
    { label: "Mag Course", value: "092°", icon: Navigation },
    { label: "Speed", value: "6.2 kt", icon: Gauge },
    { label: "ETA", value: "13:40", icon: Timer },
  ];

  const statIcons = [BookOpen, Compass, Route, Shield];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020817] text-white">
      <section className="relative overflow-hidden border-b border-cyan-300/25">
        <div
          className="absolute inset-y-0 right-0 hidden w-[68%] bg-cover bg-center lg:block"
          style={{ backgroundImage: "url('/images/navigation/hero-chart.jpg')" }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#020817] via-[#020817]/88 to-[#020817]/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/20 via-transparent to-[#020817]/95" />
        <div className="absolute inset-0 bg-cyan-950/15 mix-blend-multiply" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(34,211,238,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.16)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute -left-40 top-20 h-[620px] w-[620px] rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-12 md:px-8 lg:pb-14 lg:pt-20">
          <Link
            href="/guide"
            className="absolute right-5 top-6 rounded-xl border border-cyan-300/35 bg-slate-950/55 px-4 py-2 text-xs font-black uppercase tracking-wider text-cyan-100 shadow-lg shadow-cyan-950/30 backdrop-blur transition hover:bg-cyan-300/10 md:right-8"
          >
            ← Akademiye Dön
          </Link>

          <div className="grid min-h-[500px] gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300 md:text-sm">
                Albatros Sailing Academy
              </p>

              <h1 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.04em] text-white drop-shadow-[0_0_35px_rgba(15,23,42,0.9)] md:text-7xl lg:text-[90px]">
                NAVIGATION <br />
                ACADEMY{" "}
                <span className="bg-gradient-to-r from-cyan-100 via-cyan-300 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.75)]">
                  PRO
                </span>
              </h1>

              <p className="mt-5 text-lg font-black text-white md:text-xl">
                Haritayı oku. Rotayı çiz. Mevkini bul. Güvenle ilerle.
              </p>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
                {navigationHero.subtitle}
              </p>

              <div className="mt-7 max-w-xl rounded-2xl border border-cyan-300/45 bg-slate-950/65 p-5 shadow-[0_0_35px_rgba(34,211,238,0.16)] backdrop-blur">
                <div className="flex items-center gap-4">
                  <Anchor className="h-8 w-8 shrink-0 text-cyan-300" />
                  <p className="text-sm font-semibold leading-7 text-slate-100 md:text-base">
                    {navigationHero.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative hidden min-h-[430px] lg:block">
              <div className="absolute right-0 top-8 grid w-[300px] grid-cols-2 gap-3">
                {hudItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-cyan-300/35 bg-slate-950/75 p-4 shadow-[0_0_35px_rgba(34,211,238,0.15)] backdrop-blur"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                        <Icon className="h-3.5 w-3.5" />
                        {item.label}
                      </div>
                      <div className="mt-2 text-2xl font-black text-white">
                        {item.value}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="absolute bottom-24 left-20 rounded-2xl border border-cyan-300/35 bg-slate-950/75 px-5 py-4 text-lg font-bold leading-7 text-white shadow-[0_0_30px_rgba(34,211,238,0.14)] backdrop-blur">
                41°12.50&apos; N <br />
                29°03.45&apos; E
              </div>
            </div>
          </div>

          <div className="grid overflow-hidden rounded-3xl border border-cyan-300/30 bg-slate-950/80 shadow-[0_0_60px_rgba(34,211,238,0.16)] backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
            {navigationHero.stats.map((stat, index) => {
              const Icon = statIcons[index] ?? Compass;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-5 border-b border-cyan-300/15 p-5 sm:border-r lg:border-b-0 last:border-r-0"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/25 bg-slate-950/80">
                    <Icon className="h-8 w-8 text-cyan-300" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-300">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-5 md:px-8">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="rounded-2xl border border-cyan-300/25 bg-slate-950/80 p-5 shadow-xl shadow-cyan-950/20 lg:col-span-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-cyan-300">
                <Map className="h-5 w-5" />
                {chartDefinition.title}
              </h2>
              <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase text-cyan-100">
                Core
              </span>
            </div>
            <p className="text-sm leading-7 text-slate-200">
              {chartDefinition.text}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300/25 bg-slate-950/80 p-5 shadow-xl shadow-cyan-950/20 lg:col-span-4">
            <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-cyan-300">
              <Radar className="h-5 w-5" />
              Harita Bilgi Katmanları
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {chartInformation.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-xs font-semibold text-slate-200"
                >
                  ◉ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-300/25 bg-slate-950/80 p-5 shadow-xl shadow-cyan-950/20 lg:col-span-4">
            <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-cyan-300">
              <ShipWheel className="h-5 w-5" />
              Seyir Araçları
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {chartTools.map((tool) => (
                <div
                  key={tool}
                  className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-xs font-semibold text-slate-200"
                >
                  ◇ {tool}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-300/25 bg-slate-950/80 p-5 shadow-xl shadow-cyan-950/20 lg:col-span-12">
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-cyan-300">
                  <Navigation className="h-5 w-5" />
                  Seviye Seviye Eğitim Akışı
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  Temelden profesyonel OOW karar mantığına uzanan eğitim yolu.
                </p>
              </div>

              <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-cyan-100">
                Beginner → Professional
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {navigationLevels.map((item, index) => {
                const levelColors = [
                  "border-cyan-300/30",
                  "border-emerald-300/30",
                  "border-amber-300/30",
                  "border-violet-300/30",
                ];

                return (
                  <div
                    key={item.level}
                    className={`rounded-2xl border ${levelColors[index]} bg-slate-950/65 p-5`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300 text-sm font-black text-slate-950">
                        {item.level}
                      </div>
                      <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase text-cyan-100">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-black">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-200">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-300/25 bg-slate-950/80 p-5 shadow-xl shadow-cyan-950/20 lg:col-span-4">
            <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-cyan-300">
              <Route className="h-5 w-5" />
              Route Planning HUD
            </h2>
            <div className="mt-4 space-y-3">
              {routePlanningSteps.map((step) => (
                <div key={step.step} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-300/40 text-xs font-black text-cyan-200">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-black">{step.title}</h3>
                    <p className="mt-1 text-xs leading-6 text-slate-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-300/30 bg-cyan-950/25 p-5 shadow-xl shadow-cyan-950/20 lg:col-span-4">
            <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-cyan-200">
              <MapPinned className="h-5 w-5" />
              DR / EP / FIX
            </h2>
            <div className="mt-4 grid gap-3">
              {positionMethods.map((method) => (
                <div
                  key={method.title}
                  className="rounded-xl border border-cyan-300/25 bg-slate-950/75 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-black text-cyan-100">
                      {method.title}
                    </h3>
                    <span className="rounded-full bg-cyan-300/10 px-2 py-1 text-[10px] font-black uppercase text-cyan-100">
                      {method.subtitle}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-6 text-slate-100">
                    {method.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-red-300/25 bg-red-950/20 p-5 shadow-xl shadow-red-950/10 lg:col-span-4">
            <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-red-300">
              <TriangleAlert className="h-5 w-5" />
              {electronicFailureScenario.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-200">
              {electronicFailureScenario.description}
            </p>
            <div className="mt-4 space-y-2">
              {electronicFailureScenario.actions.map((action, index) => (
                <div key={action} className="text-xs leading-6 text-red-100">
                  <span className="mr-2 font-black text-red-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {action}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-300/25 bg-emerald-950/10 p-5 shadow-xl shadow-emerald-950/10 lg:col-span-4">
            <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
              Professional Checklist
            </h2>
            <div className="mt-4 space-y-2">
              {professionalChecklist.map((item) => (
                <div key={item} className="text-sm leading-6 text-slate-200">
                  ✅ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-300/25 bg-amber-950/10 p-5 shadow-xl shadow-amber-950/10 lg:col-span-4">
            <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-amber-300">
              <TriangleAlert className="h-5 w-5" />
              Risk Matrix
            </h2>
            <div className="mt-4 space-y-4">
              {riskCards.map((risk) => (
                <div key={risk.title}>
                  <h3 className="text-sm font-black text-amber-100">
                    ⚠️ {risk.title}
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-slate-300">
                    {risk.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-950/80 p-5 shadow-xl shadow-cyan-950/20 lg:col-span-4">
            <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-cyan-300">
              <Anchor className="h-5 w-5" />
              {professionalNavigator.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-200">
              {professionalNavigator.text}
            </p>
          </div>

          <Link
            href="/guide"
            className="rounded-2xl border border-cyan-300/25 bg-slate-950/80 p-5 shadow-xl shadow-cyan-950/20 transition hover:bg-cyan-300/10 lg:col-span-4"
          >
            <div className="flex items-center justify-between">
              <ClipboardCheck className="h-8 w-8 text-cyan-300" />
              <ArrowRight className="h-5 w-5 text-cyan-300" />
            </div>
            <h3 className="mt-4 text-base font-black">
              Gerçek Dünya Uygulamaları
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Gerçek rota örnekleri ve vaka analizleriyle öğrendiklerini pekiştir.
            </p>
          </Link>

          <Link
            href="/simulator"
            className="rounded-2xl bg-cyan-300 p-5 text-slate-950 shadow-xl shadow-cyan-950/30 transition hover:bg-cyan-200 lg:col-span-4"
          >
            <div className="flex items-center justify-between">
              <Compass className="h-9 w-9" />
              <ArrowRight className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-black">Simülatöre Git</h3>
            <p className="mt-2 text-sm font-semibold leading-6">
              Rota çiz, Fix al, DR/EP hesapla ve yetkinliğini test et.
            </p>
          </Link>

          <Link
            href="/guide"
            className="rounded-2xl border border-cyan-300/25 bg-slate-950/80 p-5 shadow-xl shadow-cyan-950/20 transition hover:bg-cyan-300/10 lg:col-span-4"
          >
            <div className="flex items-center justify-between">
              <BookMarked className="h-8 w-8 text-cyan-300" />
              <ArrowRight className="h-5 w-5 text-cyan-300" />
            </div>
            <h3 className="mt-4 text-base font-black">Eğitim Kütüphanesi</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Harita sembolleri, kılavuzlar ve referans dokümanlara ulaş.
            </p>
          </Link>
        </div>
      </section>
      
<section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
  <div className="mb-6">
    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
      Navigation Academy Lessons
    </p>

    <h2 className="mt-2 text-3xl font-black">
      Ders Modülleri
    </h2>

    <p className="mt-3 max-w-3xl leading-7 text-slate-300">
      Navigation Academy içindeki ana eğitim başlıklarına buradan ulaşabilirsiniz.
      Her modül ayrı sayfada, formül öncelikli eğitim mantığıyla ilerler.
    </p>
  </div>

  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
    {[
      {
        title: "Formüller",
        href: "/guide/navigation/formulas",
        icon: "∑",
        text: "DR, EP, FIX, CTS, CPA ve temel hesap mantığı.",
      },
      {
        title: "DR / EP / FIX",
        href: "/guide/navigation/dr-ep-fix",
        icon: "◎",
        text: "Tahmini mevki ve doğrulanmış mevki eğitimi.",
      },
      {
        title: "Tidal Stream",
        href: "/guide/navigation/tidal-stream",
        icon: "≈",
        text: "Set, drift, akıntı ve rota düzeltmesi.",
      },
      {
        title: "Radar Plotting",
        href: "/guide/navigation/radar",
        icon: "◌",
        text: "CPA, TCPA ve radar hedef takibi.",
      },
      {
        title: "Passage Planning",
        href: "/guide/navigation/passage-planning",
        icon: "⛯",
        text: "Rota, risk, alternatif liman ve seyir planı.",
      },
      {
  title: "Wind + Current",
  href: "/guide/navigation/wind-current",
  icon: "↗",
  text: "Rüzgar, akıntı, leeway, COG ve CTS birlikte hesaplanır.",
},
    ].map((lesson) => (
      <Link
        key={lesson.href}
        href={lesson.href}
        className="group rounded-2xl border border-cyan-300/25 bg-slate-950/80 p-5 shadow-xl shadow-cyan-950/20 transition hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-cyan-300/10"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-2xl font-black text-cyan-300">
          {lesson.icon}
        </div>

        <h3 className="text-lg font-black text-white">
          {lesson.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          {lesson.text}
        </p>

        <p className="mt-5 text-xs font-black uppercase tracking-wider text-cyan-300">
          Modüle Git →
        </p>
      </Link>
    ))}
  </div>
</section>
      <NavigationMapPanel />
      <RoutePlannerSimulator />
      <NavigationTrainingModules />
      <NavigationFormulaVisualizer />

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Navigation Calculation Formulas
        </p>
        <h2 className="mt-2 text-3xl font-black">
          Navigasyon Hesap Formülleri
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {navigationFormulas.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-cyan-300/25 bg-slate-950/80 p-6 shadow-xl shadow-cyan-950/10"
            >
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                {item.title}
              </div>
              <div className="mt-4 rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-4">
                <p className="text-lg font-black text-cyan-100">
                  {item.formula}
                </p>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-200">
                {item.example}
              </p>
              <p className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-7 text-amber-100">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-4 md:px-8">
        <div className="rounded-[2rem] border border-cyan-300/30 bg-cyan-300/10 p-8 text-center shadow-2xl shadow-cyan-950/40 md:p-12">
          <h2 className="text-3xl font-black md:text-5xl">
            {finalCta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl leading-8 text-slate-200">
            {finalCta.text}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={finalCta.primaryHref}
              className="rounded-full bg-cyan-300 px-7 py-3 text-center font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              {finalCta.primaryLabel}
            </Link>
            <Link
              href={finalCta.secondaryHref}
              className="rounded-full border border-cyan-300/40 px-7 py-3 text-center font-bold text-cyan-100 transition hover:bg-cyan-300/10"
            >
              {finalCta.secondaryLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}