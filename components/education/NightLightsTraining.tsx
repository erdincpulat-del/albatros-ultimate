"use client";

import { useMemo, useState } from "react";

type Scenario =
  | "sailing"
  | "power"
  | "anchor"
  | "headon"
  | "crossing-red"
  | "crossing-green"
  | "overtaking"
  | "restricted";

type Mode = "learn" | "practice";

const SCENARIOS = [
  {
    id: "sailing",
    title: "Sailing Vessel Underway",
    tr: "Seyir Halinde Yelkenli",
    rule: "COLREG Rule 25",
    desc: "Yelkenli tekne; sancak yeşil, iskele kırmızı ve kıç beyaz ışık gösterir. 20 metreden küçük teknelerde birleşik borda feneri görülebilir.",
    answer: "Sailing vessel",
  },
  {
    id: "power",
    title: "Power-Driven Vessel",
    tr: "Makineyle Yürüyen Tekne",
    rule: "COLREG Rule 23",
    desc: "Makineyle yürüyen teknede borda fenerleri, kıç feneri ve direk feneri görülür.",
    answer: "Power-driven vessel",
  },
  {
    id: "anchor",
    title: "Vessel At Anchor",
    tr: "Demirde Tekne",
    rule: "COLREG Rule 30",
    desc: "Demirdeki tekne her yönden görülebilen beyaz ışık gösterir.",
    answer: "At anchor",
  },
  {
    id: "headon",
    title: "Head-On Situation",
    tr: "Pruva Pruvaya Yaklaşma",
    rule: "COLREG Rule 14",
    desc: "Karşıdan yaklaşan teknede kırmızı ve yeşil borda fenerleri birlikte görülür. Genellikle iki tekne de sancak tarafa manevra yapar.",
    answer: "Head-on",
  },
  {
    id: "crossing-red",
    title: "Crossing · Red Light Visible",
    tr: "Kesişen Rota · Kırmızı Görüyorsun",
    rule: "COLREG Rule 15",
    desc: "Diğer teknenin kırmızı borda fenerini görüyorsan onun iskele tarafını görüyorsun. Duruma göre geçiş hakkı değerlendirilir.",
    answer: "Crossing red",
  },
  {
    id: "crossing-green",
    title: "Crossing · Green Light Visible",
    tr: "Kesişen Rota · Yeşil Görüyorsun",
    rule: "COLREG Rule 15",
    desc: "Diğer teknenin yeşil borda fenerini görüyorsan onun sancak tarafını görüyorsun. Risk ve göreceli rota değerlendirilmelidir.",
    answer: "Crossing green",
  },
  {
    id: "overtaking",
    title: "Overtaking",
    tr: "Yetişme Durumu",
    rule: "COLREG Rule 13",
    desc: "Arkadan yaklaşırken genellikle kıç feneri görülür. Yetişen tekne yol vermekle yükümlüdür.",
    answer: "Overtaking",
  },
  {
    id: "restricted",
    title: "Restricted Visibility",
    tr: "Kısıtlı Görüş / Sis",
    rule: "COLREG Rule 19",
    desc: "Sis, yağmur veya düşük görüşte ışıklar daha zor seçilir; radar, güvenli hız ve ses işaretleri kritik hale gelir.",
    answer: "Restricted visibility",
  },
] as const;

export default function NightLightsTraining() {
  const [selected, setSelected] = useState<Scenario>("sailing");
  const [mode, setMode] = useState<Mode>("learn");
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const active = useMemo(
    () => SCENARIOS.find((item) => item.id === selected)!,
    [selected]
  );

  const options = [
    "Sailing vessel",
    "Power-driven vessel",
    "At anchor",
    "Head-on",
    "Crossing red",
    "Crossing green",
    "Overtaking",
    "Restricted visibility",
  ];

  function choosePractice(option: string) {
    if (answer) return;
    setAnswer(option);
    if (option === active.answer) setScore((s) => s + 1);
  }

  function nextScenario() {
    const index = SCENARIOS.findIndex((item) => item.id === selected);
    const next = SCENARIOS[(index + 1) % SCENARIOS.length];
    setSelected(next.id);
    setAnswer(null);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] px-4 py-8 text-white">
      <style>{`
        @keyframes seaMove {
          0% { transform: translateX(-60px); opacity:.12; }
          50% { opacity:.34; }
          100% { transform: translateX(60px); opacity:.15; }
        }

        @keyframes glowPulse {
          0%,100% { opacity:.38; transform:scale(.96); }
          50% { opacity:1; transform:scale(1.08); }
        }

        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fogDrift {
          0% { transform: translateX(-80px); opacity:.08; }
          50% { opacity:.18; }
          100% { transform: translateX(80px); opacity:.08; }
        }

        .sea-line { animation: seaMove 6s ease-in-out infinite alternate; }
        .light-pulse { animation: glowPulse 1.8s ease-in-out infinite; }
        .radar-sweep { animation: radarSweep 10s linear infinite; transform-origin:center; }
        .fog-line { animation: fogDrift 8s ease-in-out infinite alternate; }
      `}</style>

      <section className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[34px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.35em] text-cyan-300">
                ALBATROS SAILING
              </p>

              <h1 className="mt-3 text-4xl font-black md:text-6xl">
                Night Lights Training Engine
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                Gece seyir fenerlerini; ışık açıları, yaklaşma senaryoları ve
                COLREG mantığıyla öğren. Sertifika bağlantısı yoktur.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setMode("learn");
                  setAnswer(null);
                }}
                className={`rounded-2xl border px-5 py-3 text-sm font-black transition ${
                  mode === "learn"
                    ? "border-cyan-300 bg-cyan-300/20 text-cyan-100"
                    : "border-white/10 bg-black/30 text-slate-300 hover:bg-cyan-300/10"
                }`}
              >
                LEARN MODE
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("practice");
                  setAnswer(null);
                }}
                className={`rounded-2xl border px-5 py-3 text-sm font-black transition ${
                  mode === "practice"
                    ? "border-yellow-200 bg-yellow-200/20 text-yellow-100"
                    : "border-white/10 bg-black/30 text-slate-300 hover:bg-yellow-200/10"
                }`}
              >
                PRACTICE
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="relative min-h-[640px] overflow-hidden rounded-[36px] border border-cyan-300/20 bg-[#010611] p-5 shadow-[0_0_90px_rgba(34,211,238,.14)]">
            <div className="absolute inset-0 opacity-40">
              {[...Array(14)].map((_, i) => (
                <div
                  key={i}
                  className="sea-line absolute h-px w-full bg-cyan-100/40"
                  style={{ top: `${7 + i * 7}%` }}
                />
              ))}
            </div>

            {selected === "restricted" && (
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="fog-line absolute h-16 w-full rounded-full bg-white/20 blur-2xl"
                    style={{ top: `${8 + i * 11}%` }}
                  />
                ))}
              </div>
            )}

            <div className="relative flex min-h-[590px] items-center justify-center">
              <div className="absolute h-[500px] w-[500px] rounded-full border border-cyan-300/15">
                <div className="absolute inset-[18%] rounded-full border border-cyan-300/10" />
                <div className="absolute inset-[34%] rounded-full border border-cyan-300/10" />
                <div className="radar-sweep absolute left-1/2 top-1/2 h-[250px] w-[3px] origin-bottom -translate-x-1/2 -translate-y-full bg-gradient-to-t from-cyan-300 to-transparent opacity-45" />
              </div>

              <LightArcScene scenario={selected} />
            </div>
          </section>

          <aside className="rounded-[36px] border border-white/10 bg-black/55 p-5 backdrop-blur-xl">
            <p className="text-xs font-black tracking-[0.3em] text-cyan-300">
              ACTIVE SCENARIO
            </p>

            <h2 className="mt-3 text-3xl font-black">{active.title}</h2>

            <p className="mt-1 text-sm font-bold text-cyan-100">{active.tr}</p>

            <div className="mt-4 inline-flex rounded-full border border-yellow-200/20 bg-yellow-200/10 px-3 py-1 text-xs font-black text-yellow-100">
              {active.rule}
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-300">
              {active.desc}
            </p>

            {mode === "practice" && (
              <div className="mt-6 rounded-3xl border border-yellow-200/20 bg-yellow-200/10 p-4">
                <p className="text-xs font-black tracking-[0.28em] text-yellow-100">
                  PRACTICE MODE
                </p>

                <h3 className="mt-2 text-xl font-black">
                  Bu ışık görüntüsü hangi duruma ait?
                </h3>

                <p className="mt-2 text-sm text-slate-300">Skor: {score}</p>

                <div className="mt-4 grid gap-2">
                  {options.map((option) => {
                    const correct = answer && option === active.answer;
                    const wrong = answer === option && option !== active.answer;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => choosePractice(option)}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                          correct
                            ? "border-green-300 bg-green-400/20 text-green-100"
                            : wrong
                            ? "border-red-300 bg-red-400/20 text-red-100"
                            : "border-white/10 bg-black/30 text-slate-300 hover:bg-cyan-300/10"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {answer && (
                  <button
                    type="button"
                    onClick={nextScenario}
                    className="mt-4 rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-black text-slate-950"
                  >
                    Sonraki Senaryo
                  </button>
                )}
              </div>
            )}

            <div className="mt-6 grid gap-3">
              {SCENARIOS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelected(item.id);
                    setAnswer(null);
                  }}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    selected === item.id
                      ? "border-cyan-300 bg-cyan-300/20 text-cyan-100"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-cyan-300/10"
                  }`}
                >
                  <p className="font-black">{item.title}</p>
                  <p className="mt-1 text-xs">{item.tr}</p>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function LightArcScene({ scenario }: { scenario: Scenario }) {
  const rotate =
    scenario === "crossing-red"
      ? -45
      : scenario === "crossing-green"
      ? 45
      : scenario === "overtaking"
      ? 180
      : 0;

  const showRed =
    scenario !== "anchor" && scenario !== "overtaking" && scenario !== "restricted";
  const showGreen =
    scenario !== "anchor" && scenario !== "overtaking" && scenario !== "restricted";
  const showStern =
    scenario === "sailing" ||
    scenario === "power" ||
    scenario === "overtaking";
  const showMast =
    scenario === "power" || scenario === "headon" || scenario === "restricted";
  const showAnchor = scenario === "anchor";
  const showFog = scenario === "restricted";

  return (
    <div
      className="relative h-[430px] w-[430px]"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {showRed && <LightCone color="red" side="left" />}
      {showGreen && <LightCone color="green" side="right" />}
      {showStern && <LightCone color="white" side="stern" />}
      {showMast && <LightCone color="white" side="mast" />}
      {showAnchor && <LightCone color="white" side="anchor" />}
      {showFog && <LightCone color="white" side="fog" />}

      <BoatSilhouette sailing={scenario === "sailing"} />

      {showRed && (
        <LightDot
          className="left-[126px] top-[192px]"
          color="bg-red-500"
          glow="shadow-[0_0_45px_rgba(239,68,68,.95)]"
          label="Port 112.5°"
        />
      )}

      {showGreen && (
        <LightDot
          className="right-[126px] top-[192px]"
          color="bg-green-400"
          glow="shadow-[0_0_45px_rgba(74,222,128,.95)]"
          label="Starboard 112.5°"
        />
      )}

      {showStern && (
        <LightDot
          className="bottom-[64px] left-1/2 -translate-x-1/2"
          color="bg-white"
          glow="shadow-[0_0_50px_rgba(255,255,255,1)]"
          label="Stern 135°"
        />
      )}

      {showMast && (
        <LightDot
          className="left-1/2 top-[58px] -translate-x-1/2"
          color="bg-white"
          glow="shadow-[0_0_55px_rgba(255,255,255,1)]"
          label="Masthead 225°"
        />
      )}

      {showAnchor && (
        <LightDot
          className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          color="bg-white"
          glow="shadow-[0_0_80px_rgba(255,255,255,1)]"
          label="All-round 360°"
        />
      )}

      {showFog && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-2xl border border-white/10 bg-black/45 px-4 py-2 text-center">
          <p className="text-xs font-black text-white">Restricted Visibility</p>
          <p className="mt-1 text-[10px] text-slate-300">
            Radar + safe speed + sound signal
          </p>
        </div>
      )}
    </div>
  );
}

function BoatSilhouette({ sailing }: { sailing: boolean }) {
  return (
    <div className="absolute left-1/2 top-1/2 h-64 w-36 -translate-x-1/2 -translate-y-1/2">
      {sailing && (
        <div className="absolute left-1/2 top-0 h-40 w-[3px] -translate-x-1/2 bg-slate-200/80">
          <div className="absolute left-[3px] top-4 h-32 w-20 origin-left skew-y-[-18deg] rounded-tr-full border border-white/20 bg-white/15" />
        </div>
      )}

      <div className="absolute bottom-0 left-1/2 h-52 w-28 -translate-x-1/2 rounded-[55%_55%_45%_45%] border border-white/30 bg-white/10 shadow-[0_0_60px_rgba(255,255,255,.15)]">
        <div className="absolute left-1/2 top-4 h-36 w-[3px] -translate-x-1/2 bg-slate-200/60" />
        <div className="absolute bottom-8 left-1/2 h-20 w-16 -translate-x-1/2 rounded-b-full bg-slate-900/80" />
        <div className="absolute bottom-20 left-1/2 h-7 w-12 -translate-x-1/2 rounded-md bg-slate-300/20" />
      </div>
    </div>
  );
}

function LightCone({
  color,
  side,
}: {
  color: "red" | "green" | "white";
  side: "left" | "right" | "stern" | "mast" | "anchor" | "fog";
}) {
  const base =
    color === "red"
      ? "rgba(239,68,68,.34)"
      : color === "green"
      ? "rgba(74,222,128,.34)"
      : "rgba(255,255,255,.26)";

  const shape =
    side === "left"
      ? "clip-path: polygon(50% 50%, 6% 22%, 8% 78%);"
      : side === "right"
      ? "clip-path: polygon(50% 50%, 94% 22%, 92% 78%);"
      : side === "stern"
      ? "clip-path: polygon(50% 50%, 30% 100%, 70% 100%);"
      : side === "mast"
      ? "clip-path: polygon(50% 50%, 25% 0%, 75% 0%);"
      : side === "anchor"
      ? "border-radius: 9999px;"
      : "clip-path: polygon(50% 50%, 15% 0%, 85% 0%);";

  return (
    <div
      className="absolute inset-0 light-pulse"
      style={{
        background: `radial-gradient(circle at center, ${base}, transparent 58%)`,
        filter: `blur(${side === "anchor" ? "10px" : "6px"})`,
        opacity: side === "anchor" ? 0.9 : 0.8,
        clipPath:
          side === "left"
            ? "polygon(50% 50%, 6% 22%, 8% 78%)"
            : side === "right"
            ? "polygon(50% 50%, 94% 22%, 92% 78%)"
            : side === "stern"
            ? "polygon(50% 50%, 30% 100%, 70% 100%)"
            : side === "mast"
            ? "polygon(50% 50%, 25% 0%, 75% 0%)"
            : side === "fog"
            ? "polygon(50% 50%, 15% 0%, 85% 0%)"
            : undefined,
      }}
    />
  );
}

function LightDot({
  className,
  color,
  glow,
  label,
}: {
  className: string;
  color: string;
  glow: string;
  label: string;
}) {
  return (
    <div className={`absolute ${className} text-center`}>
      <div className={`light-pulse mx-auto h-5 w-5 rounded-full ${color} ${glow}`} />
      <p className="mt-2 whitespace-nowrap text-[10px] font-black text-slate-100">
        {label}
      </p>
    </div>
  );
}