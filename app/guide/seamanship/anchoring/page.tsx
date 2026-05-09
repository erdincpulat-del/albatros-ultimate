"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Anchor,
  ArrowLeft,
  Calculator,
  CheckCircle2,
  Compass,
  HelpCircle,
  RotateCcw,
  ShieldAlert,
  ShipWheel,
  Waves,
  Wind,
  Lightbulb,
} from "lucide-react";

type BottomType = "sand" | "mud" | "weed" | "rock" | "mixed";

function toNumber(value: string) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

const lessons = [
  {
    title: "Demirleme nedir?",
    text: "Demirleme; teknenin demir, zincir/halat ve dip tutuşu ile güvenli şekilde sabitlenmesidir. Amaç tekneyi rüzgar, akıntı ve dalga etkisine rağmen kontrol altında tutmaktır.",
  },
  {
    title: "Demir yeri seçimi",
    text: "İyi demir yeri; rüzgara ve swell’e kapalı, yeterli derinlikte, iyi dip yapısına sahip, çevresinde salma alanı bulunan ve gerekirse çıkış rotası açık olan yerdir.",
  },
  {
    title: "Dip yapısı",
    text: "Kum ve çamur genelde iyi tutar. Otluk/posidonia, kaya ve sert zemin daha risklidir. YYE 1–2 seviyesinde en önemli kural: her koy güvenli demir yeri değildir.",
  },
  {
    title: "Kaloma nedir?",
    text: "Kaloma, demirden tekneye verilen zincir/halat uzunluğudur. Sakin havada genelde derinliğin 4–5 katı, daha emniyetli durumda 5–7 katı düşünülür.",
  },
  {
    title: "Demir atma sırası",
    text: "Yeri seç, rüzgara karşı yaklaş, hızı kes, demiri kontrollü indir, rüzgarla geriye düşerek demiri serbest bırak, kaloma ver, demirin tuttuğunu kontrol et, ama Tornistan ile değil kerteriz/GPS ile izlemeye devam et.",
  },
  {
    title: "Demirin tuttuğunu nasıl anlarsın?",
    text: "Zincir gerilir, tekne durur, kıyı kerterizleri değişmez, GPS sürüklenme göstermez, zincirde sürekli zıplama/titreme olmaz.",
  },
  {
    title: "Tarama nedir?",
    text: "Tarama, demirin dipte tutmayıp tekneyi sürüklemesidir. Kötü dip, yetersiz kaloma, yanlış atış, ani rüzgar artışı ve kalabalık koylarda risk yükselir.",
  },
  {
    title: "Bosa vurmak nedir?",
    text: "Zincir yükünü doğrudan ırgat üzerinde bırakmamak için zincire bosa/snubber bağlanır. Temel mantık: ırgat yük taşıma noktası değildir.",
  },
  {
  title: "Salpa nedir?",
  text: "Salpa, demirde bulunan teknenin rüzgar, akıntı ve dalga etkisiyle demir noktası etrafında yaptığı salınım hareketidir. Tekne sabit durmaz; demir merkezi etrafında belli bir daire içinde yer değiştirir.",
},
{
  title: "Salpa çapı nedir?",
  text: "Salpa çapı, teknenin demir noktası etrafında dönebileceği yaklaşık alanın çapıdır. Kaloma, tekne boyu, rüzgar yönü, akıntı ve çevredeki engeller bu alanı belirler. Demir atarken yalnız mevcut konum değil, teknenin dönebileceği alan da düşünülmelidir.",
},
{
  title: "Aynı tip teknelerle ortak alan seçimi",
  text: "Demir yerinde mümkünse benzer tip ve benzer salınım davranışına sahip teknelerin bulunduğu alan seçilmelidir. Motor yat ile yelkenli teknenin rüzgara dönme açısı, salınım hızı ve sürüklenme davranışı aynı olmayabilir. Bu fark, özellikle rüzgar değişiminde çatışma riskini artırır.",
},
{
  title: "Mahremiyet ve mesafe",
  text: "Demir atarken yalnız teknik emniyet değil, denizcilik nezaketi de önemlidir. Başka bir teknenin çok yakınına demir atmak, hem çatışma riski yaratır hem de mahremiyete saygısızlık olur. Güvenli salma alanı ve yaşam alanı birlikte düşünülmelidir.",
},
{
  title: "Demirde alkol ve kaptan sorumluluğu",
  text: "Tekne demirdeyken de seyir sorumluluğu tamamen bitmiş sayılmaz. Hava değişebilir, başka tekneler tarayabilir, sağlık veya acil durum oluşabilir. Kaptanın alkollü olması doğru karar alma ve hızlı müdahale yeteneğini zayıflatır. Bu durum cana, mala ve çevreye zarar doğurabilir; ayrıca yasal sorumluluk ve yaptırımlar doğurabilir.",
},
];

function bottomLabel(type: BottomType) {
  switch (type) {
    case "sand":
      return "Kum";
    case "mud":
      return "Çamur";
    case "weed":
      return "Otluk / Posidonia";
    case "rock":
      return "Kaya";
    case "mixed":
      return "Karışık Dip";
  }
}

function bottomScore(type: BottomType) {
  switch (type) {
    case "sand":
      return { label: "İyi tutuş", color: "text-emerald-300", factor: 1 };
    case "mud":
      return { label: "İyi / orta tutuş", color: "text-cyan-300", factor: 1.1 };
    case "mixed":
      return { label: "Kontrol gerekli", color: "text-amber-300", factor: 1.2 };
    case "weed":
      return { label: "Riskli tutuş", color: "text-orange-300", factor: 1.35 };
    case "rock":
      return { label: "Zayıf / takılma riski", color: "text-red-300", factor: 1.5 };
  }
}

export default function Page() {
  const [depth, setDepth] = useState("6");
  const [freeboard, setFreeboard] = useState("1.2");
  const [wind, setWind] = useState("14");
  const [bottom, setBottom] = useState<BottomType>("sand");
  const [boatLength, setBoatLength] = useState("12");
  const [plotVersion, setPlotVersion] = useState(0);

  const result = useMemo(() => {
    const d = Math.max(0, toNumber(depth));
    const f = Math.max(0, toNumber(freeboard));
    const w = Math.max(0, toNumber(wind));
    const loa = Math.max(1, toNumber(boatLength));
    const effectiveDepth = d + f;

    const baseRatio = w <= 10 ? 4 : w <= 20 ? 5 : w <= 30 ? 6 : 7;
    const bottom = bottomScore(arguments.length ? "sand" : "sand");
    return { d, f, w, loa, effectiveDepth, baseRatio };
  }, [depth, freeboard, wind, boatLength]);

  const bottomData = bottomScore(bottom);

  const scope = useMemo(() => {
    const effectiveDepth = Math.max(0, toNumber(depth)) + Math.max(0, toNumber(freeboard));
    const windKt = Math.max(0, toNumber(wind));
    const baseRatio = windKt <= 10 ? 4 : windKt <= 20 ? 5 : windKt <= 30 ? 6 : 7;
    const safeRatio = Math.ceil(baseRatio * bottomData.factor);
    const minimum = effectiveDepth * baseRatio;
    const safe = effectiveDepth * safeRatio;
    const storm = effectiveDepth * Math.max(7, safeRatio + 1);

    return {
      effectiveDepth,
      baseRatio,
      safeRatio,
      minimum,
      safe,
      storm,
    };
  }, [depth, freeboard, wind, bottomData.factor]);

  function reset() {
    setDepth("6");
    setFreeboard("1.2");
    setWind("14");
    setBottom("sand");
    setBoatLength("12");
    setPlotVersion((p) => p + 1);
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="relative overflow-hidden border-b border-cyan-300/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_36%)]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(34,211,238,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.18)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
          <Link
            href="/guide"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Eğitim Kütüphanesi
          </Link>

          <p className="mt-10 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            YYE 1/2 Seamanship
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight md:text-7xl">
            Demirleme{" "}
            <span className="text-cyan-300">Temelleri</span>
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Demirleme nedir, demir yeri nasıl seçilir, dip yapısı nasıl
            değerlendirilir, kaloma nasıl hesaplanır, tarama ve bosa vurmak ne
            demektir? YYE 1–2 seviyesi için sade ama ciddi bir temel eğitim.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 p-6 shadow-2xl shadow-cyan-950/20">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calculator className="h-6 w-6 text-cyan-300" />
                <h2 className="text-2xl font-black">Kaloma Hesaplayıcı</h2>
              </div>

              <button
                type="button"
                onClick={reset}
                className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4">
              <Input label="Derinlik" value={depth} setValue={setDepth} suffix="m" />
              <Input label="Baş üstü / serbest borda" value={freeboard} setValue={setFreeboard} suffix="m" />
              <Input label="Rüzgar" value={wind} setValue={setWind} suffix="kt" />
              <Input label="Tekne Boyu" value={boatLength} setValue={setBoatLength} suffix="m" />

              <label className="block">
                <div className="mb-1 text-xs font-black uppercase tracking-wider text-slate-400">
                  Dip Yapısı
                </div>

                <select
                  value={bottom}
                  onChange={(e) => setBottom(e.target.value as BottomType)}
                  className="w-full rounded-xl border border-cyan-300/20 bg-slate-900/80 px-3 py-3 text-lg font-black text-white outline-none focus:border-cyan-300"
                >
                  <option value="sand">Kum</option>
                  <option value="mud">Çamur</option>
                  <option value="mixed">Karışık Dip</option>
                  <option value="weed">Otluk / Posidonia</option>
                  <option value="rock">Kaya</option>
                </select>
              </label>
            </div>

            <button
              type="button"
              onClick={() => setPlotVersion((p) => p + 1)}
              className="mt-6 w-full rounded-2xl border border-cyan-300/40 bg-cyan-300/15 px-5 py-4 text-lg font-black text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.18)] transition hover:bg-cyan-300/25"
            >
              Kalomayı Hesapla ve Göster
            </button>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
  <Result title="Minimum" value={`${scope.minimum.toFixed(1)} m`} color="amber" />
  <Result title="Güvenli" value={`${scope.safe.toFixed(1)} m`} color="cyan" />
  <Result title="Sert Hava" value={`${scope.storm.toFixed(1)} m`} color="red" />
</div>

<div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
  <p className="text-sm leading-7 text-slate-200">
    Etkin derinlik:
    <span className="font-black text-cyan-300">
      {" "}{scope.effectiveDepth.toFixed(1)} m
    </span>
    {" "} | Önerilen oran:
    <span className="font-black text-cyan-300">
      {" "}{scope.safeRatio}:1
    </span>
    {" "} | Dip:
    <span className={`font-black ${bottomData.color}`}>
      {" "}{bottomLabel(bottom)} / {bottomData.label}
    </span>
  </p>
</div>
</aside>

<div className="rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 p-6 shadow-2xl shadow-cyan-950/20">
  <div className="mb-5 flex items-center gap-3">
    <Anchor className="h-6 w-6 text-cyan-300" />
    <h2 className="text-2xl font-black">
      Swing Circle & Kaloma
    </h2>
  </div>

  <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900/70">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_58%)]" />

    <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[size:32px_32px]" />

    <svg
      key={plotVersion}
      viewBox="0 0 720 520"
      className="relative z-10 h-full w-full"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

                <path
                  d="M0 370 C110 330, 220 390, 330 342 C470 282, 580 350, 720 300"
                  fill="none"
                  stroke="rgba(14,165,233,0.28)"
                  strokeWidth="48"
                  strokeLinecap="round"
                />

                <circle
                  cx="360"
                  cy="270"
                  r={Math.min(190, Math.max(70, scope.safe * 3))}
                  fill="rgba(34,211,238,0.06)"
                  stroke="rgba(34,211,238,0.34)"
                  strokeWidth="3"
                  strokeDasharray="10 10"
                />

                <circle
                  cx="360"
                  cy="270"
                  r={Math.min(220, Math.max(90, scope.storm * 2.8))}
                  fill="none"
                  stroke="rgba(248,113,113,0.26)"
                  strokeWidth="3"
                  strokeDasharray="14 10"
                />

                <circle cx="360" cy="270" r="13" fill="#f59e0b" filter="url(#glow)" />
                <text x="380" y="258" fill="#fbbf24" fontSize="16" fontWeight="900">
                  ANCHOR
                </text>

                <line
                  x1="360"
                  y1="270"
                  x2="498"
                  y2="220"
                  stroke="#22d3ee"
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />

                <g transform="translate(498 220) rotate(18)">
                  <path d="M0 -22 L18 18 L0 10 L-18 18 Z" fill="#e2e8f0" />
                  <rect x="-6" y="10" width="12" height="42" rx="5" fill="#22d3ee" />
                </g>

                <path
                  d="M510 170 C535 190, 548 216, 548 250"
                  fill="none"
                  stroke="#67e8f9"
                  strokeWidth="4"
                  strokeLinecap="round"
                  markerEnd="url(#arrow)"
                />

                <text x="42" y="62" fill="#67e8f9" fontSize="17" fontWeight="900">
                  Güvenli salma dairesi: {scope.safe.toFixed(1)} m
                </text>

                <text x="42" y="92" fill="#fb7185" fontSize="17" fontWeight="900">
                  Sert hava sınırı: {scope.storm.toFixed(1)} m
                </text>

                <text x="42" y="122" fill="#e2e8f0" fontSize="15" fontWeight="800">
                  Tekne demir etrafında rüzgar değişimine göre salma yapar.
                </text>

                <text x="390" y="320" fill="#94a3b8" fontSize="14" fontWeight="900">
                  Zincir / kaloma
                </text>
              </svg>
            </div>
          </div>
        </div>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {lessons.map((lesson, index) => (
            <article
              key={lesson.title}
              className="rounded-3xl border border-cyan-300/20 bg-slate-950/70 p-6 shadow-[0_0_40px_rgba(34,211,238,0.06)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-lg font-black text-cyan-300">
                {index + 1}
              </div>

              <h3 className="text-xl font-black text-cyan-100">
                {lesson.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                {lesson.text}
              </p>
            </article>
          ))}
        </section>
        <section className="mt-8 grid gap-6 lg:grid-cols-2">

  <div className="rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 p-6 shadow-2xl shadow-cyan-950/20">
    <div className="mb-5 flex items-center gap-3">
      <Anchor className="h-6 w-6 text-cyan-300" />
      <h2 className="text-2xl font-black text-white">
        Gündüz Demir İşareti
      </h2>
    </div>

    <p className="mb-6 text-slate-300">
      Demirde bulunan tekneler gündüz siyah küre işareti göstermelidir.
      Bu işaret teknenin hareket halinde olmadığını belirtir.
    </p>

    <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-b from-sky-950 to-slate-950">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.15),transparent_60%)]" />

      <svg viewBox="0 0 500 320" className="relative z-10 h-full w-full">

        <path
          d="M0 250 C120 220 240 270 500 230"
          fill="none"
          stroke="rgba(34,211,238,0.25)"
          strokeWidth="36"
          strokeLinecap="round"
        />

        <g transform="translate(250 165)">
          <path
            d="M-65 20 L65 20 L45 55 L-45 55 Z"
            fill="#e2e8f0"
          />

          <path
            d="M-42 20 L-18 -40 L18 -40 L42 20 Z"
            fill="#94a3b8"
          />

          <line
            x1="0"
            y1="-40"
            x2="0"
            y2="-115"
            stroke="#e2e8f0"
            strokeWidth="6"
          />

          <circle
            cx="0"
            cy="-145"
            r="26"
            fill="#020617"
            stroke="#94a3b8"
            strokeWidth="4"
          />
        </g>

      </svg>
    </div>

    <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-100">
      COLREG: Demirdeki tekneler gündüz uygun görünür bir yerde siyah küre göstermelidir.
    </div>
  </div>

  <div className="rounded-[2rem] border border-amber-300/25 bg-slate-950/80 p-6 shadow-2xl shadow-amber-950/20">
    <div className="mb-5 flex items-center gap-3">
      <Lightbulb className="h-6 w-6 text-amber-300" />
      <h2 className="text-2xl font-black text-white">
        Gece Demir Feneri
      </h2>
    </div>

    <p className="mb-6 text-slate-300">
      Demirde bulunan tekneler gece her yönden görülebilen beyaz demir feneri göstermelidir.
    </p>

    <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[2rem] border border-amber-300/20 bg-gradient-to-b from-slate-950 via-slate-900 to-black">

      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(251,191,36,0.08),transparent_70%)]" />

      <svg viewBox="0 0 500 320" className="relative z-10 h-full w-full">

        <path
          d="M0 250 C120 220 240 270 500 230"
          fill="none"
          stroke="rgba(56,189,248,0.16)"
          strokeWidth="32"
          strokeLinecap="round"
        />

        <circle
          cx="250"
          cy="105"
          r="34"
          fill="rgba(251,191,36,0.95)"
        >
          <animate
            attributeName="r"
            values="28;38;28"
            dur="2.2s"
            repeatCount="indefinite"
          />
        </circle>

        <circle
          cx="250"
          cy="105"
          r="70"
          fill="rgba(251,191,36,0.12)"
        >
          <animate
            attributeName="r"
            values="55;95;55"
            dur="2.2s"
            repeatCount="indefinite"
          />
        </circle>

        <g transform="translate(250 185)">
          <path
            d="M-65 20 L65 20 L45 55 L-45 55 Z"
            fill="#e2e8f0"
          />

          <path
            d="M-42 20 L-18 -40 L18 -40 L42 20 Z"
            fill="#94a3b8"
          />

          <line
            x1="0"
            y1="-40"
            x2="0"
            y2="-92"
            stroke="#f8fafc"
            strokeWidth="6"
          />
        </g>

      </svg>
    </div>

    <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
      360° beyaz ışık tüm yönlerden görünmelidir. Liman ve koylarda yanlış ışık kullanımı çarpışma riski oluşturabilir.
    </div>
  </div>

</section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          <InfoCard
            icon={<CheckCircle2 className="h-6 w-6 text-emerald-300" />}
            title="Demir Tutmuş Göstergeleri"
            items={[
              "Tekne GPS üzerinde geriye sürüklenmiyor.",
              "Kıyı kerterizleri sabit kalıyor.",
              "Zincir düzenli geriliyor, devamlı zıplamıyor.",
              "Motorla hafif geri verildiğinde demir bırakmıyor.",
            ]}
          />

          <InfoCard
            icon={<ShieldAlert className="h-6 w-6 text-red-300" />}
            title="Tarama Riskleri"
            items={[
              "Yetersiz kaloma.",
              "Otluk / kaya / kötü dip.",
              "Ani rüzgar veya squall.",
              "Çok kalabalık koy ve yetersiz salma alanı.",
            ]}
          />

          <InfoCard
            icon={<ShipWheel className="h-6 w-6 text-cyan-300" />}
            title="Bosa Vurmak"
            items={[
              "Zincir yükü doğrudan ırgatta bırakılmaz.",
              "Bosa/snubber şok yükünü azaltır.",
              "Gece demirinde ses ve yük azalır.",
              "Bağlantı noktası sağlam olmalıdır.",
            ]}
          />
          <InfoCard
  icon={<ShieldAlert className="h-6 w-6 text-amber-300" />}
  title="Demirde Kaptan Sorumluluğu"
  items={[
    "Demirde olmak sorumluluğun bittiği anlamına gelmez.",
    "Hava, akıntı ve çevredeki tekneler sürekli izlenmelidir.",
    "Kaptan acil durumda karar verecek ve müdahale edecek durumda olmalıdır.",
    "Alkol; karar alma, denge, dikkat ve müdahale hızını düşürür.",
    "Cana, mala veya çevreye zarar doğarsa yasal sorumluluk oluşabilir.",
  ]}
/>
        </section>

        <section className="mt-8 rounded-3xl border border-amber-300/30 bg-amber-300/10 p-6">
          <div className="flex items-start gap-4">
            <ShieldAlert className="mt-1 h-6 w-6 shrink-0 text-amber-300" />
            <p className="leading-8 text-amber-100">
              Bu modül YYE 1–2 seviyesi için eğitim amaçlıdır. Gerçek demirleme
              sırasında rüzgar tahmini, dip yapısı, çevredeki tekneler, salma
              dairesi, kıyı mesafesi, derinlik, gece ışığı ve kaçış rotası
              birlikte değerlendirilmelidir.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

function Input({
  label,
  value,
  setValue,
  suffix,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-black uppercase tracking-wider text-slate-400">
        {label}
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-slate-900/80 px-3 py-2 focus-within:border-cyan-300">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent text-lg font-black text-white outline-none"
        />
        {suffix ? (
          <span className="text-sm font-black text-cyan-300">{suffix}</span>
        ) : null}
      </div>
    </label>
  );
}

function Result({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: "cyan" | "amber" | "red";
}) {
  const styles = {
    cyan: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
    amber: "border-amber-300/25 bg-amber-300/10 text-amber-200",
    red: "border-red-300/25 bg-red-300/10 text-red-200",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[color]}`}>
      <div className="text-xs font-black uppercase tracking-wider opacity-80">
        {title}
      </div>
      <div className="mt-2 text-2xl font-black text-white">{value}</div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-cyan-300/20 bg-slate-950/70 p-6">
      <div className="mb-4 flex items-center gap-3">
        {icon}
        <h3 className="text-xl font-black">{title}</h3>
      </div>

      <ul className="space-y-3 text-sm leading-7 text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-cyan-300">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}