import Link from "next/link";
import NavigationMapPanel from "@/components/navigation/NavigationMapPanel";
import {
  chartDefinition,
  chartInformation,
  chartTools,
  electronicFailureScenario,
  finalCta,
  navigationFormulas,
  navigationHero,
  navigationLevels,
  navigationTerms,
  positionMethods,
  professionalChecklist,
  professionalNavigator,
  riskCards,
  routePlanningSteps,
} from "@/lib/navigation/navigationContent";

export default function NavigationAcademy() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* HERO */}
      <section className="relative border-b border-cyan-400/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.25),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.22),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.25),rgba(2,6,23,1))]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <div className="max-w-5xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
              {navigationHero.eyebrow}
            </p>

            <h1 className="text-4xl font-black tracking-tight md:text-7xl">
              {navigationHero.title}
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300 md:text-xl">
              {navigationHero.subtitle}
            </p>

            <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-white/10 p-6 shadow-2xl shadow-cyan-950/40 backdrop-blur">
              <p className="text-xl font-semibold leading-8 text-cyan-100">
                {navigationHero.message}
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {navigationHero.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
                >
                  <div className="text-3xl font-black text-cyan-300">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-slate-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CHART DEFINITION */}
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-12 md:grid-cols-3 md:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 md:col-span-2">
          <h2 className="text-2xl font-bold text-cyan-200">
            {chartDefinition.title}
          </h2>

          <p className="mt-4 leading-8 text-slate-300">
            {chartDefinition.text}
          </p>
        </div>

        <div className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-6">
          <h3 className="text-xl font-bold text-cyan-100">Eğitim Mantığı</h3>

          <p className="mt-4 leading-7 text-slate-300">
            Önce haritayı okuruz. Sonra rota çizeriz. Daha sonra mevki bulur,
            akıntı-rüzgâr etkisini hesaplar ve profesyonel seyir planı kurarız.
          </p>
        </div>
      </section>

      {/* CHART INFO */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Chart Intelligence
        </p>

        <h2 className="mt-2 text-3xl font-black">
          Harita Üzerinde Ne Bilgiler Vardır?
        </h2>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {chartInformation.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-4 text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* TOOLS */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/70 p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Navigation Tools
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Harita Hangi Araçlarla Kullanılır?
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {chartTools.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* VISUAL MAP ENGINE */}
      <NavigationMapPanel />

      {/* LEVELS */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Training Progression
        </p>

        <h2 className="mt-2 text-3xl font-black">Seviye Seviye Eğitim Akışı</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {navigationLevels.map((item) => (
            <div
              key={item.level}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300 text-lg font-black text-slate-950">
                  {item.level}
                </div>

                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-100">
                  {item.badge}
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-bold text-cyan-100">
                {item.title}
              </h3>

              <p className="mt-4 leading-8 text-slate-300">
                {item.description}
              </p>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {item.topics.map((topic) => (
                  <div
                    key={topic}
                    className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-slate-300"
                  >
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROUTE PLANNING */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Route Planning Engine
        </p>

        <h2 className="mt-2 text-3xl font-black">Rota Çizim Mantığı</h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {routePlanningSteps.map((step) => (
            <div
              key={step.step}
              className="rounded-3xl border border-cyan-300/20 bg-slate-900 p-6"
            >
              <div className="text-sm font-black text-cyan-300">
                STEP {step.step}
              </div>

              <h3 className="mt-3 text-xl font-bold text-cyan-100">
                {step.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* POSITION METHODS */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Position Methods
        </p>

        <h2 className="mt-2 text-3xl font-black">DR / EP / FIX Eğitim Paneli</h2>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {positionMethods.map((method) => (
            <div
              key={method.title}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-6"
            >
              <div className="text-4xl font-black text-cyan-300">
                {method.title}
              </div>

              <h3 className="mt-2 text-lg font-bold text-cyan-100">
                {method.subtitle}
              </h3>

              <p className="mt-4 leading-7 text-slate-300">
                {method.description}
              </p>

              <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
                {method.warning}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FORMULAS */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Navigation Calculation Formulas
        </p>

        <h2 className="mt-2 text-3xl font-black">
          Navigasyon Hesap Formülleri
        </h2>

        <p className="mt-4 max-w-4xl leading-8 text-slate-300">
          Profesyonel navigator; rota, zaman, hız, akıntı ve emniyet hesaplarını
          birlikte değerlendirir. Bu formüller gerçek seyir karar mantığının
          temelini oluşturur.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {navigationFormulas.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-cyan-300/20 bg-slate-900/80 p-6 shadow-xl shadow-cyan-950/10"
            >
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                {item.title}
              </div>

              <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                <p className="text-lg font-black text-cyan-100">
                  {item.formula}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400">
                  Örnek
                </p>

                <p className="mt-2 leading-7 text-slate-300">
                  {item.example}
                </p>
              </div>

              <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                <p className="text-sm font-bold uppercase tracking-[0.15em] text-amber-200">
                  Navigator Notu
                </p>

                <p className="mt-2 text-sm leading-7 text-amber-100">
                  {item.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EMERGENCY */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="rounded-[2rem] border border-red-300/20 bg-gradient-to-br from-red-500/10 via-slate-900 to-cyan-500/10 p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-200">
            Emergency Navigation
          </p>

          <h2 className="mt-2 text-3xl font-black">
            {electronicFailureScenario.title}
          </h2>

          <p className="mt-5 max-w-5xl leading-8 text-slate-300">
            {electronicFailureScenario.description}
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {electronicFailureScenario.actions.map((action, index) => (
              <div
                key={action}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-slate-200"
              >
                <span className="mr-3 font-black text-cyan-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {action}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHECKLIST + RISK */}
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-12 md:grid-cols-2 md:px-8">
        <div className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/80 p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Professional Checklist
          </p>

          <h2 className="mt-2 text-3xl font-black">Navigator Kontrol Listesi</h2>

          <div className="mt-6 space-y-3">
            {professionalChecklist.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-slate-200"
              >
                ✓ {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/80 p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Risk Analysis
          </p>

          <h2 className="mt-2 text-3xl font-black">Risk Analizi Kartları</h2>

          <div className="mt-6 grid gap-4">
            {riskCards.map((risk) => (
              <div
                key={risk.title}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
              >
                <h3 className="font-bold text-cyan-100">{risk.title}</h3>

                <p className="mt-2 leading-7 text-slate-300">
                  {risk.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE TERMS */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Core Terms
        </p>

        <h2 className="mt-2 text-3xl font-black">Temel Navigasyon Kavramları</h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {navigationTerms.map((term) => (
            <div
              key={term.title}
              className="rounded-3xl border border-cyan-300/20 bg-slate-900 p-6"
            >
              <div className="text-3xl font-black text-cyan-300">
                {term.shortTitle}
              </div>

              <h3 className="mt-2 text-xl font-bold text-cyan-200">
                {term.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-300">
                {term.description}
              </p>

              <p className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-100">
                {term.proNote}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PROFESSIONAL NAVIGATOR */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/15 via-slate-900 to-blue-500/10 p-8 md:p-10">
          <h2 className="text-3xl font-black">
            {professionalNavigator.title}
          </h2>

          <p className="mt-5 max-w-4xl leading-8 text-slate-300">
            {professionalNavigator.text}
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-4 md:px-8">
        <div className="rounded-[2rem] border border-cyan-300/30 bg-cyan-300/10 p-8 text-center shadow-2xl shadow-cyan-950/40 md:p-12">
          <h2 className="text-3xl font-black md:text-5xl">
            {finalCta.title}
          </h2>

          <p className="mx-auto mt-5 max-w-3xl leading-8 text-slate-300">
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