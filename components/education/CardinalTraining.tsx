"use client";

import { useMemo, useState } from "react";

type CardinalType = "north" | "south" | "east" | "west";

type Scenario = {
  id: number;
  type: CardinalType;
  title: string;
  safeSide: string;
  light: string;
  explanation: string;
};

const scenarios: Scenario[] = [
  {
    id: 1,
    type: "north",
    title: "North Cardinal",
    safeSide: "Kuzeyinden geç",
    light: "Q veya VQ sürekli",
    explanation: "North Cardinal, güvenli suyun işaretin kuzeyinde olduğunu gösterir.",
  },
  {
    id: 2,
    type: "east",
    title: "East Cardinal",
    safeSide: "Doğusundan geç",
    light: "Q(3) veya VQ(3)",
    explanation: "East Cardinal, güvenli suyun işaretin doğusunda olduğunu gösterir.",
  },
  {
    id: 3,
    type: "south",
    title: "South Cardinal",
    safeSide: "Güneyinden geç",
    light: "Q(6)+LFl veya VQ(6)+LFl",
    explanation: "South Cardinal, güvenli suyun işaretin güneyinde olduğunu gösterir.",
  },
  {
    id: 4,
    type: "west",
    title: "West Cardinal",
    safeSide: "Batısından geç",
    light: "Q(9) veya VQ(9)",
    explanation: "West Cardinal, güvenli suyun işaretin batısında olduğunu gösterir.",
  },
];

const options = ["Kuzeyinden geç", "Doğusundan geç", "Güneyinden geç", "Batısından geç"];

export default function CardinalTraining() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const scenario = scenarios[index];
  const isCorrect = selected === scenario.safeSide;

  const buoy = useMemo(() => getBuoyVisual(scenario.type), [scenario.type]);

  function answer(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === scenario.safeSide) setScore((s) => s + 1);
  }

  function next() {
    setSelected(null);
    setIndex((i) => (i + 1) % scenarios.length);
  }

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-8 text-white md:px-6">
      <section className="mx-auto max-w-6xl">
        <p className="text-xs tracking-[0.35em] text-cyan-300">ALBATROS SAILING</p>

        <h1 className="mt-3 text-3xl font-black md:text-6xl">
          Cardinal Mark Training Engine
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
          Şamandırayı gör, güvenli tarafı seç, ışık karakterini öğren.
          Sertifika bağlantısı yoktur; bu sayfa tamamen bağımsız eğitim modülüdür.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-cyan-300/20 bg-[#06111f] p-4 shadow-[0_0_70px_rgba(34,211,238,0.16)]">
            <div className="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[#020b16]">
              <div className="absolute inset-0 opacity-40">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-px w-full bg-cyan-300/30"
                    style={{ top: `${12 + i * 11}%` }}
                  />
                ))}
              </div>

              <div className="absolute left-6 top-6 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur">
                <p className="text-xs text-slate-400">Scenario</p>
                <p className="font-bold text-cyan-100">{scenario.title}</p>
                <p className="mt-1 text-xs text-slate-300">Light: {scenario.light}</p>
              </div>

              <svg viewBox="0 0 500 500" className="relative z-10 h-auto w-full max-w-[560px]">
                <circle cx="250" cy="250" r="205" fill="none" stroke="rgba(125,211,252,.2)" />
                <circle cx="250" cy="250" r="145" fill="none" stroke="rgba(125,211,252,.14)" />

                <text x="250" y="38" textAnchor="middle" fill="#a5f3fc" fontSize="16" fontWeight="800">N</text>
                <text x="250" y="476" textAnchor="middle" fill="#a5f3fc" fontSize="16" fontWeight="800">S</text>
                <text x="470" y="255" textAnchor="middle" fill="#a5f3fc" fontSize="16" fontWeight="800">E</text>
                <text x="30" y="255" textAnchor="middle" fill="#a5f3fc" fontSize="16" fontWeight="800">W</text>

                <SafeWater type={scenario.type} />

                <g transform="translate(250 250)">
                  <rect x="-28" y="-86" width="56" height="122" rx="18" fill={buoy.bodyTop} />
                  <rect x="-28" y="-25" width="56" height="61" rx="14" fill={buoy.bodyBottom} />
                  <line x1="0" y1="36" x2="0" y2="112" stroke="#94a3b8" strokeWidth="5" />
                  <polygon points={buoy.topTriangle} fill="#f8fafc" />
                  <polygon points={buoy.bottomTriangle} fill="#f8fafc" />
                  <circle cx="0" cy="-4" r="8" fill="#020617" />
                </g>

                <path
                  d="M250 425 C230 390 270 390 250 425 Z"
                  fill="#22d3ee"
                  opacity="0.18"
                />

                <g transform="translate(250 420)">
                  <path
                    d="M0 -28 C20 0 20 42 0 72 C-20 42 -20 0 0 -28 Z"
                    fill="#e2e8f0"
                    stroke="#ffffff"
                    strokeWidth="3"
                  />
                  <text x="0" y="100" textAnchor="middle" fill="#e0f2fe" fontSize="12">
                    YOUR BOAT
                  </text>
                </g>
              </svg>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Karar Ver</h2>
              <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                Skor {score}/{scenarios.length}
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Bu cardinal işareti hangi taraftan emniyetli geçilir?
            </p>

            <div className="mt-5 grid gap-3">
              {options.map((option) => {
                const active = selected === option;
                const correct = option === scenario.safeSide;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => answer(option)}
                    className={`rounded-2xl border px-4 py-4 text-left text-sm font-bold transition ${
                      selected
                        ? correct
                          ? "border-green-400 bg-green-400/15 text-green-100"
                          : active
                            ? "border-red-400 bg-red-400/15 text-red-100"
                            : "border-white/10 bg-black/20 text-slate-400"
                        : "border-white/10 bg-black/20 text-white hover:border-cyan-300/40 hover:bg-cyan-300/10"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {selected && (
              <div
                className={`mt-5 rounded-2xl border p-4 text-sm leading-6 ${
                  isCorrect
                    ? "border-green-400/30 bg-green-400/10 text-green-100"
                    : "border-red-400/30 bg-red-400/10 text-red-100"
                }`}
              >
                <p className="font-black">{isCorrect ? "Doğru karar." : "Yanlış karar."}</p>
                <p className="mt-1">{scenario.explanation}</p>
                <p className="mt-2 text-slate-200">Doğru geçiş: {scenario.safeSide}</p>
              </div>
            )}

            <button
              type="button"
              onClick={next}
              className="mt-5 w-full rounded-2xl bg-cyan-300 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
            >
              Sonraki Senaryo
            </button>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4 text-xs leading-5 text-slate-300">
              North: sürekli hızlı çakar. East: 3 çakar. South: 6 çakar + uzun çakar.
              West: 9 çakar.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SafeWater({ type }: { type: CardinalType }) {
  const common = "rgba(34,211,238,.13)";
  if (type === "north") return <path d="M250 250 L105 65 A210 210 0 0 1 395 65 Z" fill={common} />;
  if (type === "south") return <path d="M250 250 L395 435 A210 210 0 0 1 105 435 Z" fill={common} />;
  if (type === "east") return <path d="M250 250 L435 105 A210 210 0 0 1 435 395 Z" fill={common} />;
  return <path d="M250 250 L65 395 A210 210 0 0 1 65 105 Z" fill={common} />;
}

function getBuoyVisual(type: CardinalType) {
  if (type === "north") {
    return {
      bodyTop: "#facc15",
      bodyBottom: "#020617",
      topTriangle: "0,-135 -20,-100 20,-100",
      bottomTriangle: "0,-100 -20,-65 20,-65",
    };
  }

  if (type === "south") {
    return {
      bodyTop: "#020617",
      bodyBottom: "#facc15",
      topTriangle: "0,-65 -20,-100 20,-100",
      bottomTriangle: "0,-100 -20,-135 20,-135",
    };
  }

  if (type === "east") {
    return {
      bodyTop: "#020617",
      bodyBottom: "#facc15",
      topTriangle: "0,-135 -20,-100 20,-100",
      bottomTriangle: "0,-65 -20,-100 20,-100",
    };
  }

  return {
    bodyTop: "#facc15",
    bodyBottom: "#020617",
    topTriangle: "0,-65 -20,-100 20,-100",
    bottomTriangle: "0,-100 -20,-135 20,-135",
  };
}