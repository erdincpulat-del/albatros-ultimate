import {
  Activity,
  ArrowRight,
  Compass,
  Crosshair,
  MoveRight,
  Radar,
  Route,
  Waves,
} from "lucide-react";

const formulaCards = [
  {
    title: "DR — Dead Reckoning",
    badge: "Estimated Track",
    icon: Route,
    formula: "DR = Son Mevki + Rota × Hız × Zaman",
    color: "cyan",
    description:
      "Son bilinen mevkiden itibaren teknenin rotası, hızı ve geçen süre kullanılarak tahmini mevki hesaplanır.",
    steps: ["Son mevki", "Course", "Speed", "Time", "DR position"],
  },
  {
    title: "EP — Estimated Position",
    badge: "Environmental Correction",
    icon: Waves,
    formula: "EP = DR + Akıntı + Rüzgâr + Leeway",
    color: "amber",
    description:
      "DR üzerine akıntı, rüzgâr ve leeway etkileri eklenerek daha gerçekçi tahmini mevki oluşturulur.",
    steps: ["DR", "Set", "Drift", "Leeway", "EP"],
  },
  {
    title: "FIX — Observed Position",
    badge: "Verified Position",
    icon: Crosshair,
    formula: "FIX = Kerteriz + Mesafe + Gözlem",
    color: "emerald",
    description:
      "Kerteriz, radar mesafesi, derinlik, GPS veya görsel referansla doğrulanmış gerçek mevkidir.",
    steps: ["Bearing", "Range", "Visual", "Radar", "FIX"],
  },
  {
    title: "Radar Plotting",
    badge: "Collision Risk",
    icon: Radar,
    formula: "Risk = Düşük CPA + Kısa TCPA + Sabit Kerteriz",
    color: "red",
    description:
      "Radar hedefinin göreceli hareketi izlenerek çatışma riski, CPA ve TCPA üzerinden değerlendirilir.",
    steps: ["Target", "Bearing", "Range", "CPA", "TCPA"],
  },
];

function colorClasses(color: string) {
  switch (color) {
    case "amber":
      return {
        border: "border-amber-300/25",
        bg: "bg-amber-300/10",
        text: "text-amber-300",
        glow: "shadow-amber-950/20",
      };
    case "emerald":
      return {
        border: "border-emerald-300/25",
        bg: "bg-emerald-300/10",
        text: "text-emerald-300",
        glow: "shadow-emerald-950/20",
      };
    case "red":
      return {
        border: "border-red-300/25",
        bg: "bg-red-300/10",
        text: "text-red-300",
        glow: "shadow-red-950/20",
      };
    default:
      return {
        border: "border-cyan-300/25",
        bg: "bg-cyan-300/10",
        text: "text-cyan-300",
        glow: "shadow-cyan-950/20",
      };
  }
}

export default function NavigationFormulaVisualizer() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Navigation Formula Visualization System
        </p>

        <h2 className="mt-2 text-3xl font-black">
          Vector Formula Cards
        </h2>

        <p className="mt-4 max-w-4xl leading-8 text-slate-300">
          Formüller sadece ezberlenmez; rota, akıntı, mevki ve radar mantığı
          vektör akışıyla birlikte okunur.
        </p>
      </div>

      <div className="grid gap-6">
        {formulaCards.map((card) => {
          const Icon = card.icon;
          const c = colorClasses(card.color);

          return (
            <div
              key={card.title}
              className={`overflow-hidden rounded-[2rem] border ${c.border} bg-slate-950/80 shadow-xl ${c.glow}`}
            >
              <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${c.border} ${c.bg}`}
                    >
                      <Icon className={`h-7 w-7 ${c.text}`} />
                    </div>

                    <div>
                      <div className={`text-xs font-black uppercase tracking-[0.22em] ${c.text}`}>
                        {card.badge}
                      </div>
                      <h3 className="mt-1 text-2xl font-black text-white">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`mt-6 rounded-2xl border ${c.border} ${c.bg} p-5`}
                  >
                    <p className="font-mono text-lg font-black leading-8 text-white">
                      {card.formula}
                    </p>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-300">
                    {card.description}
                  </p>
                </div>

                <div className="relative rounded-3xl border border-white/10 bg-slate-900/60 p-5">
                  <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:34px_34px]" />

                  <div className="relative flex min-h-[220px] items-center justify-between gap-2">
                    {card.steps.map((step, index) => (
                      <div key={step} className="flex flex-1 items-center">
                        <div className="flex flex-col items-center text-center">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full border ${c.border} ${c.bg} text-sm font-black ${c.text}`}
                          >
                            {index + 1}
                          </div>

                          <p className="mt-3 max-w-[90px] text-xs font-bold uppercase leading-5 tracking-wider text-slate-200">
                            {step}
                          </p>
                        </div>

                        {index < card.steps.length - 1 && (
                          <div className="mx-2 flex flex-1 items-center">
                            <div className={`h-px flex-1 ${c.bg}`} />
                            <ArrowRight className={`h-4 w-4 ${c.text}`} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="relative mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                      <Compass className="mb-2 h-5 w-5 text-cyan-300" />
                      <p className="text-xs font-black uppercase tracking-wider text-cyan-200">
                        Direction
                      </p>
                    </div>

                    <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                      <MoveRight className="mb-2 h-5 w-5 text-amber-300" />
                      <p className="text-xs font-black uppercase tracking-wider text-amber-200">
                        Vector
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                      <Activity className="mb-2 h-5 w-5 text-emerald-300" />
                      <p className="text-xs font-black uppercase tracking-wider text-emerald-200">
                        Result
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}