import {
  Activity,
  Compass,
  Crosshair,
  Radar,
  Route,
  TriangleAlert,
  Waves,
} from "lucide-react";

const modules = [
  {
    title: "DR / EP / FIX Eğitim Modülü",
    icon: Crosshair,
    color: "cyan",
    formula: [
      { text: "DR", className: "text-cyan-300" },
      { text: " = Son Mevki + " },
      { text: "Rota × Hız × Zaman", className: "text-white" },
    ],
    secondFormula: [
      { text: "EP", className: "text-amber-300" },
      { text: " = DR + " },
      { text: "Akıntı / Rüzgâr / Leeway", className: "text-amber-200" },
    ],
    result: [
      { text: "FIX", className: "text-emerald-300" },
      { text: " = Gözlemle doğrulanmış gerçek mevki" },
    ],
    explanation:
      "DR son bilinen mevkiden yapılan teorik tahmindir. EP çevresel etkiler eklenmiş tahmini mevkidir. FIX ise kerteriz, radar, derinlik veya GPS ile doğrulanmış mevkidir.",
    example:
      "Son mevki A noktası. Tekne 090° rotada 6 knot hızla 2 saat giderse DR mevkisi 12 NM doğuya taşınır.",
    safety:
      "DR ve EP kesin mevki değildir. Sığ su, kıyı seyri veya trafik alanında mutlaka FIX ile doğrulanmalıdır.",
  },
  {
    title: "Tidal Stream / Current Eğitim Modülü",
    icon: Waves,
    color: "blue",
    formula: [
      { text: "Set & Drift", className: "text-cyan-300" },
      { text: " = " },
      { text: "Akıntı Yönü + Akıntı Hızı × Zaman", className: "text-white" },
    ],
    secondFormula: [
      { text: "CTS", className: "text-emerald-300" },
      { text: " = Planlanan Rota ± " },
      { text: "Akıntı Düzeltmesi", className: "text-amber-300" },
    ],
    result: [
      { text: "COG", className: "text-green-300" },
      { text: " = Teknenin yer üzerindeki gerçek hareket yönü" },
    ],
    explanation:
      "Akıntı tekneyi planlanan rota hattından sürükler. Navigator sadece rotayı çizmez; akıntının set ve drift etkisini hesaplayarak CTS düzeltmesi yapar.",
    example:
      "1.5 knot akıntı 2 saat etkiliyse tekneyi yaklaşık 3 NM sürükleyebilir. Bu etki rota planında önceden hesaba katılmalıdır.",
    safety:
      "Dar geçitlerde, burun dönüşlerinde ve sığ sularda akıntı hesabı yapılmazsa tekne güvenli sudan çıkabilir.",
  },
  {
    title: "Radar Plotting Temel Eğitim Modülü",
    icon: Radar,
    color: "red",
    formula: [
      { text: "CPA", className: "text-red-300" },
      { text: " = En Yakın Geçiş Mesafesi" },
    ],
    secondFormula: [
      { text: "TCPA", className: "text-amber-300" },
      { text: " = CPA noktasına kalan zaman" },
    ],
    result: [
      { text: "Risk", className: "text-red-300" },
      { text: " = Küçük CPA + Kısa TCPA + Sabit Kerteriz" },
    ],
    explanation:
      "Radar plotting, hedefin göreceli hareketini takip ederek çatışma riskini anlamaya yarar. Sabit kerteriz ve azalan mesafe tehlike işaretidir.",
    example:
      "Bir hedefin kerterizi değişmiyor, mesafesi azalıyorsa CPA düşük olabilir. Bu durumda erken rota veya hız değişikliği düşünülmelidir.",
    safety:
      "Radar tek başına karar sistemi değildir. COLREG, görsel gözlem, AIS ve emniyetli vardiya disipliniyle birlikte kullanılmalıdır.",
  },
];

function FormulaLine({
  items,
}: {
  items: { text: string; className?: string }[];
}) {
  return (
    <div className="rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-4 font-mono text-sm font-black leading-7 md:text-base">
      {items.map((item, index) => (
        <span key={`${item.text}-${index}`} className={item.className}>
          {item.text}
        </span>
      ))}
    </div>
  );
}

export default function NavigationTrainingModules() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Formula First Training
        </p>
        <h2 className="mt-2 text-3xl font-black">
          Formül Öncelikli Navigasyon Eğitim Modülleri
        </h2>
        <p className="mt-4 max-w-4xl leading-8 text-slate-300">
          Her konu önce formülle başlar; sonra uygulama mantığı, örnek hesap ve
          seyir emniyeti riskiyle tamamlanır.
        </p>
      </div>

      <div className="grid gap-6">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <div
              key={module.title}
              className="rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 p-6 shadow-xl shadow-cyan-950/20 md:p-8"
            >
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10">
                      <Icon className="h-6 w-6 text-cyan-300" />
                    </div>

                    <h3 className="text-2xl font-black text-white">
                      {module.title}
                    </h3>
                  </div>

                  <div className="mt-6 space-y-3">
                    <FormulaLine items={module.formula} />
                    <FormulaLine items={module.secondFormula} />
                    <FormulaLine items={module.result} />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                    <div className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-cyan-300">
                      <Compass className="h-4 w-4" />
                      Ne işe yarar?
                    </div>
                    <p className="text-sm leading-7 text-slate-200">
                      {module.explanation}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-950/10 p-5">
                    <div className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-emerald-300">
                      <Activity className="h-4 w-4" />
                      Örnek Hesap
                    </div>
                    <p className="text-sm leading-7 text-slate-200">
                      {module.example}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-red-300/20 bg-red-950/20 p-5">
                    <div className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-red-300">
                      <TriangleAlert className="h-4 w-4" />
                      Seyir Emniyeti Notu
                    </div>
                    <p className="text-sm leading-7 text-red-100">
                      {module.safety}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                  <Route className="mb-2 h-5 w-5 text-cyan-300" />
                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-200">
                    Formül
                  </p>
                  <p className="mt-1 text-sm text-slate-200">
                    Hesabın matematik temeli.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                  <Compass className="mb-2 h-5 w-5 text-amber-300" />
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-200">
                    Uygulama
                  </p>
                  <p className="mt-1 text-sm text-slate-200">
                    Denizde karar verme mantığı.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                  <Activity className="mb-2 h-5 w-5 text-emerald-300" />
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                    Sonuç
                  </p>
                  <p className="mt-1 text-sm text-slate-200">
                    Güvenli rota ve mevki doğrulama.
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}