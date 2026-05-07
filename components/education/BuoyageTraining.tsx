"use client";

import { useMemo, useState } from "react";

type Mode = "day" | "night";
type PanelMode = "library" | "training" | "challenge";

type BuoyType =
  | "lateral-port"
  | "lateral-starboard"
  | "preferred-port"
  | "preferred-starboard"
  | "safe-water"
  | "isolated-danger"
  | "special-mark"
  | "wreck-mark"
  | "north-cardinal"
  | "east-cardinal"
  | "south-cardinal"
  | "west-cardinal";

type Buoy = {
  type: BuoyType;
  title: string;
  trTitle: string;
  light: string;
  desc: string;
  pass: string;
  group: string;
};

const BUOYS: Buoy[] = [
  {
    type: "lateral-port",
    title: "Port Hand Mark",
    trTitle: "Liman Tarafı",
    light: "Red",
    desc: "Kanalın liman tarafını gösterir.",
    pass: "IALA A sisteminde liman tarafında kırmızı işaret görülür.",
    group: "Lateral",
  },
  {
    type: "lateral-starboard",
    title: "Starboard Hand Mark",
    trTitle: "Sancak Tarafı",
    light: "Green",
    desc: "Kanalın sancak tarafını gösterir.",
    pass: "IALA A sisteminde sancak tarafında yeşil işaret görülür.",
    group: "Lateral",
  },
  {
    type: "preferred-port",
    title: "Preferred Channel Port",
    trTitle: "Tercihli Kanal Port",
    light: "Composite Red",
    desc: "Tercihli kanal liman tarafı.",
    pass: "Ana kanal yönü gövde rengiyle, alternatif taraf bantla gösterilir.",
    group: "Preferred",
  },
  {
    type: "preferred-starboard",
    title: "Preferred Channel Starboard",
    trTitle: "Tercihli Kanal Starboard",
    light: "Composite Green",
    desc: "Tercihli kanal sancak tarafı.",
    pass: "Ana kanal yönü gövde rengiyle, alternatif taraf bantla gösterilir.",
    group: "Preferred",
  },
  {
    type: "safe-water",
    title: "Safe Water",
    trTitle: "Emniyetli Su",
    light: "LFl 10s",
    desc: "Her tarafından güvenli geçiş olduğunu gösterir.",
    pass: "İşaretin çevresinde seyredilebilir emniyetli su bulunur.",
    group: "Safe Water",
  },
  {
    type: "isolated-danger",
    title: "Isolated Danger",
    trTitle: "İzole Tehlike",
    light: "Fl(2)",
    desc: "Altında tehlike vardır; çevresi seyredilebilir sudur.",
    pass: "Tehlike doğrudan işaretin altındadır.",
    group: "Danger",
  },
  {
    type: "special-mark",
    title: "Special Mark",
    trTitle: "Özel İşaret",
    light: "Yellow Rhythm",
    desc: "Özel amaçlı deniz alanlarını gösterir.",
    pass: "Kablo, boru, çalışma sahası veya yasak alan gösterebilir.",
    group: "Special",
  },
  {
    type: "wreck-mark",
    title: "Emergency Wreck",
    trTitle: "Acil Batık",
    light: "Blue / Yellow",
    desc: "Yeni keşfedilmiş batık veya geçici tehlike.",
    pass: "Haritada henüz işlenmemiş yeni tehlikeleri gösterir.",
    group: "Emergency",
  },
  {
    type: "north-cardinal",
    title: "North Cardinal",
    trTitle: "Kuzey Kardinal",
    light: "Q / VQ",
    desc: "Güvenli su kuzeydedir.",
    pass: "Kuzeyinden geç.",
    group: "Cardinal",
  },
  {
    type: "east-cardinal",
    title: "East Cardinal",
    trTitle: "Doğu Kardinal",
    light: "Q(3)",
    desc: "Güvenli su doğudadır.",
    pass: "Doğusundan geç.",
    group: "Cardinal",
  },
  {
    type: "south-cardinal",
    title: "South Cardinal",
    trTitle: "Güney Kardinal",
    light: "Q(6)+LFl",
    desc: "Güvenli su güneydedir.",
    pass: "Güneyinden geç.",
    group: "Cardinal",
  },
  {
    type: "west-cardinal",
    title: "West Cardinal",
    trTitle: "Batı Kardinal",
    light: "Q(9)",
    desc: "Güvenli su batıdadır.",
    pass: "Batısından geç.",
    group: "Cardinal",
  },
];

const CHALLENGES: { question: string; answer: BuoyType }[] = [
  {
    question: "Q(3) ışık karakteri gördün. Hangi cardinal işarettir?",
    answer: "east-cardinal",
  },
  {
    question: "Altında tehlike var ama çevresinden geçilebilir. Hangi işaret?",
    answer: "isolated-danger",
  },
  {
    question: "Her tarafından emniyetli geçiş olduğunu gösteren işaret hangisi?",
    answer: "safe-water",
  },
  {
    question: "Q(9) ışık karakteri hangi cardinal işaretidir?",
    answer: "west-cardinal",
  },
];

export default function BuoyageTraining() {
  const [mode, setMode] = useState<Mode>("night");
  const [panelMode, setPanelMode] = useState<PanelMode>("library");
  const [selected, setSelected] = useState<BuoyType>("north-cardinal");
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [answer, setAnswer] = useState<BuoyType | null>(null);
  const [score, setScore] = useState(0);

  const active = useMemo(
    () => BUOYS.find((item) => item.type === selected) ?? BUOYS[0],
    [selected]
  );

  const challenge = CHALLENGES[challengeIndex];
  const isCorrect = answer === challenge.answer;

  function selectBuoy(type: BuoyType) {
    setSelected(type);

    if (panelMode === "challenge" && !answer) {
      setAnswer(type);
      if (type === challenge.answer) setScore((s) => s + 1);
    }
  }

  function nextChallenge() {
    setAnswer(null);
    setChallengeIndex((i) => (i + 1) % CHALLENGES.length);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] px-4 py-8 text-white">
      <style>{`
        @keyframes seaMove {
          0% { transform: translateX(-60px); opacity:.12; }
          50% { opacity:.34; }
          100% { transform: translateX(60px); opacity:.15; }
        }

        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes softPulse {
          0%,100% { opacity:.35; transform:scale(.96); }
          50% { opacity:1; transform:scale(1.04); }
        }

        @keyframes quickFlash {
          0%,70%,100% { opacity:.12; filter:drop-shadow(0 0 0px currentColor); }
          8%,16% { opacity:1; filter:drop-shadow(0 0 16px currentColor); }
        }

        @keyframes flash3 {
          0%,100% { opacity:.12; }
          8%,18%,28% { opacity:1; }
          40% { opacity:.12; }
        }

        @keyframes flash6long {
          0%,100% { opacity:.12; }
          7%,14%,21%,28%,35%,42% { opacity:1; }
          68% { opacity:1; }
          82% { opacity:.12; }
        }

        @keyframes flash9 {
          0%,100% { opacity:.12; }
          6%,12%,18%,24%,30%,36%,42%,48%,54% { opacity:1; }
          70% { opacity:.12; }
        }

        @keyframes longFlash {
          0%,62%,100% { opacity:.12; }
          14%,42% { opacity:1; }
        }

        @keyframes altBlueYellow {
          0%,49% { fill:#38bdf8; opacity:1; filter:drop-shadow(0 0 16px #38bdf8); }
          50%,100% { fill:#fde047; opacity:1; filter:drop-shadow(0 0 16px #fde047); }
        }

        .sea-line { animation: seaMove 6s ease-in-out infinite alternate; }
        .radar-sweep { animation: radarSweep 10s linear infinite; transform-origin:center; }
        .soft-pulse { animation: softPulse 2.5s ease-in-out infinite; }
        .quick-flash { animation: quickFlash 1.2s linear infinite; }
        .flash3 { animation: flash3 2s linear infinite; }
        .flash6long { animation: flash6long 3s linear infinite; }
        .flash9 { animation: flash9 3.5s linear infinite; }
        .long-flash { animation: longFlash 2.4s linear infinite; }
        .alt-light { animation: altBlueYellow 1.2s linear infinite; }
      `}</style>

      <section className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[34px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.35em] text-cyan-300">
                ALBATROS SAILING
              </p>

              <h1 className="mt-3 text-4xl font-black md:text-6xl">
                IALA Buoyage Training Engine
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                Sertifika bağlantısı yoktur. Bu sayfa yalnızca bağımsız eğitim,
                simülasyon, gece ışığı ve karar pratiği içindir.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMode(mode === "day" ? "night" : "day")}
              className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-4 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/20"
            >
              {mode === "day" ? "GECE MODU" : "GÜNDÜZ MODU"}
            </button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {(["library", "training", "challenge"] as PanelMode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setPanelMode(item);
                  setAnswer(null);
                }}
                className={`rounded-2xl border px-5 py-3 text-sm font-black transition ${
                  panelMode === item
                    ? "border-cyan-300 bg-cyan-300/20 text-cyan-100"
                    : "border-white/10 bg-black/30 text-slate-300 hover:bg-cyan-300/10"
                }`}
              >
                {item === "library" && "LIBRARY"}
                {item === "training" && "TRAINING VIEW"}
                {item === "challenge" && "CHALLENGE MODE"}
              </button>
            ))}
          </div>
        </header>

        {panelMode === "challenge" && (
          <div className="mb-6 rounded-[28px] border border-yellow-200/20 bg-yellow-200/10 p-5">
            <p className="text-xs font-black tracking-[0.3em] text-yellow-100">
              CHALLENGE {challengeIndex + 1}/{CHALLENGES.length}
            </p>
            <h2 className="mt-2 text-2xl font-black">{challenge.question}</h2>
            <p className="mt-2 text-sm text-slate-300">
              Doğru şamandırayı seç. Skor: {score}
            </p>

            {answer && (
              <div className="mt-4">
                <p
                  className={`text-xl font-black ${
                    isCorrect ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {isCorrect ? "✅ Doğru karar" : "❌ Yanlış seçim"}
                </p>
                <button
                  type="button"
                  onClick={nextChallenge}
                  className="mt-3 rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-black text-slate-950"
                >
                  Sonraki Soru
                </button>
              </div>
            )}
          </div>
        )}

        {panelMode === "training" && (
          <div className="mb-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[34px] border border-cyan-300/20 bg-black/50 p-6">
              <p className="text-xs font-black tracking-[0.35em] text-cyan-300">
                ACTIVE TRAINING
              </p>

              <h2 className="mt-3 text-4xl font-black">{active.title}</h2>
              <p className="mt-1 text-sm font-bold text-cyan-100">
                {active.trTitle}
              </p>

              <div className="mt-6 flex min-h-[360px] items-center justify-center rounded-[30px] border border-white/10 bg-white/95 p-6">
                <BuoyVisual type={active.type} mode={mode} large />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[34px] border border-cyan-300/20 bg-black/50 p-6">
              <div className="absolute inset-0 opacity-35">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="sea-line absolute h-px w-full bg-cyan-100/40"
                    style={{ top: `${8 + i * 8}%` }}
                  />
                ))}
              </div>

              <div className="relative">
                <p className="text-xs font-black tracking-[0.35em] text-cyan-300">
                  TRAINING NOTE
                </p>

                <h3 className="mt-3 text-2xl font-black">{active.pass}</h3>

                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {active.desc}
                </p>

                <div className="mt-5 rounded-2xl border border-yellow-200/20 bg-yellow-200/10 p-4">
                  <p className="text-xs text-slate-400">Light Character</p>
                  <p className="mt-1 text-xl font-black text-yellow-100">
                    {active.light}
                  </p>
                </div>

                <div className="mt-6 h-72 rounded-full border border-cyan-300/20 bg-cyan-300/[0.04]">
                  <div className="relative h-full w-full">
                    <div className="absolute inset-[16%] rounded-full border border-cyan-300/15" />
                    <div className="absolute inset-[32%] rounded-full border border-cyan-300/15" />
                    <div className="radar-sweep absolute left-1/2 top-1/2 h-36 w-[3px] origin-bottom -translate-x-1/2 -translate-y-full bg-gradient-to-t from-cyan-300 to-transparent opacity-60" />
                    <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 rotate-45 items-center justify-center bg-yellow-300 text-black shadow-[0_0_60px_rgba(250,204,21,.45)]">
                      <span className="-rotate-45 text-xs font-black">MARK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className={`relative overflow-hidden rounded-[36px] border border-white/10 p-5 shadow-[0_0_80px_rgba(34,211,238,.12)] md:p-8 ${
            mode === "night"
              ? "bg-[#010611]"
              : "bg-gradient-to-b from-sky-200 via-sky-500 to-cyan-950"
          }`}
        >
          <div className="absolute inset-0 opacity-35">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className="sea-line absolute h-px w-full bg-cyan-100/60"
                style={{ top: `${6 + i * 7}%` }}
              />
            ))}
          </div>

          <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {BUOYS.map((buoy) => {
              const selectedCard = selected === buoy.type;
              const correctAnswer =
                panelMode === "challenge" &&
                answer !== null &&
                buoy.type === challenge.answer;
              const wrongAnswer =
                panelMode === "challenge" &&
                answer === buoy.type &&
                buoy.type !== challenge.answer;

              return (
                <button
                  key={buoy.type}
                  type="button"
                  onClick={() => selectBuoy(buoy.type)}
                  className={`group rounded-[28px] border p-5 text-left transition duration-300 hover:-translate-y-1 ${
                    correctAnswer
                      ? "border-green-300 bg-green-400/20 shadow-[0_0_45px_rgba(74,222,128,.35)]"
                      : wrongAnswer
                      ? "border-red-300 bg-red-400/20 shadow-[0_0_45px_rgba(248,113,113,.35)]"
                      : selectedCard
                      ? "border-cyan-300 bg-cyan-300/15 shadow-[0_0_45px_rgba(34,211,238,.25)]"
                      : "border-white/10 bg-black/45 hover:border-cyan-300/40 hover:bg-cyan-300/10"
                  }`}
                >
                  <div className="flex h-56 items-center justify-center rounded-3xl border border-white/10 bg-white/95 p-4 transition group-hover:scale-[1.03]">
                    <BuoyVisual type={buoy.type} mode={mode} />
                  </div>

                  <p className="mt-4 text-[10px] font-black tracking-[0.25em] text-cyan-300">
                    {buoy.group.toUpperCase()}
                  </p>

                  <h2 className="mt-2 text-xl font-black text-white">
                    {buoy.title}
                  </h2>

                  <p className="mt-1 text-sm font-bold text-cyan-100">
                    {buoy.trTitle}
                  </p>

                  <div className="mt-3 inline-flex rounded-full border border-yellow-200/20 bg-yellow-200/10 px-3 py-1 text-xs font-black text-yellow-100">
                    {buoy.light}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    {buoy.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function BuoyVisual({
  type,
  mode,
  large = false,
}: {
  type: BuoyType;
  mode: Mode;
  large?: boolean;
}) {
  const flashClass = getFlashClass(type);
  const lightColor = getLightColor(type);

  return (
    <svg
      viewBox="0 0 120 220"
      className={large ? "h-[340px] w-full" : "h-full max-h-[210px] w-full"}
    >
      {mode === "night" && (
        <circle
          className={flashClass}
          cx="60"
          cy="22"
          r="18"
          fill={lightColor}
        />
      )}

      {renderTopMark(type)}

      <g transform="translate(60 125)">
        {renderBody(type)}
        <rect x="-34" y="48" width="68" height="16" rx="8" fill="#111827" />
        <line x1="0" y1="64" x2="0" y2="92" stroke="#cbd5e1" strokeWidth="5" />
      </g>
    </svg>
  );
}

function getFlashClass(type: BuoyType) {
  if (type === "east-cardinal") return "flash3";
  if (type === "south-cardinal") return "flash6long";
  if (type === "west-cardinal") return "flash9";
  if (type === "safe-water") return "long-flash";
  if (type === "wreck-mark") return "alt-light";
  return "quick-flash";
}

function getLightColor(type: BuoyType) {
  if (type.includes("starboard")) return "#22c55e";
  if (type.includes("port")) return "#ef4444";
  if (type === "special-mark") return "#fde047";
  if (type === "wreck-mark") return "#38bdf8";
  if (type === "safe-water") return "#f8fafc";
  return "#fde68a";
}

function renderTopMark(type: BuoyType) {
  if (type === "north-cardinal") {
    return (
      <g fill="black">
        <polygon points="60,12 42,46 78,46" />
        <polygon points="60,48 42,82 78,82" />
      </g>
    );
  }

  if (type === "south-cardinal") {
    return (
      <g fill="black">
        <polygon points="42,16 78,16 60,50" />
        <polygon points="42,54 78,54 60,88" />
      </g>
    );
  }

  if (type === "east-cardinal") {
    return (
      <g fill="black">
        <polygon points="60,12 42,46 78,46" />
        <polygon points="42,54 78,54 60,88" />
      </g>
    );
  }

  if (type === "west-cardinal") {
    return (
      <g fill="black">
        <polygon points="42,16 78,16 60,50" />
        <polygon points="60,54 42,88 78,88" />
      </g>
    );
  }

  if (type === "special-mark") {
    return (
      <path
        d="M44 20 L60 36 L76 20"
        fill="none"
        stroke="#fde047"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }

  if (type === "isolated-danger") {
    return (
      <g fill="black">
        <circle cx="60" cy="22" r="9" />
        <circle cx="60" cy="46" r="9" />
      </g>
    );
  }

  if (type === "lateral-starboard" || type === "preferred-starboard") {
    return <polygon points="60,12 42,46 78,46" fill="#22c55e" />;
  }

  if (type === "lateral-port" || type === "preferred-port") {
    return <rect x="52" y="16" width="16" height="16" rx="3" fill="#ef4444" />;
  }

  if (type === "safe-water") {
    return <circle cx="60" cy="28" r="16" fill="#ef4444" />;
  }

  return null;
}

function renderBody(type: BuoyType) {
  if (type === "lateral-port") {
    return <rect x="-22" y="-48" width="44" height="96" rx="8" fill="#ef4444" />;
  }

  if (type === "lateral-starboard") {
    return <rect x="-22" y="-48" width="44" height="96" rx="8" fill="#22c55e" />;
  }

  if (type === "preferred-port") {
    return (
      <>
        <rect x="-22" y="-48" width="44" height="96" rx="8" fill="#ef4444" />
        <rect x="-22" y="-8" width="44" height="18" fill="#22c55e" />
      </>
    );
  }

  if (type === "preferred-starboard") {
    return (
      <>
        <rect x="-22" y="-48" width="44" height="96" rx="8" fill="#22c55e" />
        <rect x="-22" y="-8" width="44" height="18" fill="#ef4444" />
      </>
    );
  }

  if (type === "safe-water") {
    return (
      <>
        <rect x="-22" y="-48" width="44" height="96" rx="8" fill="#ffffff" stroke="#ef4444" strokeWidth="2" />
        <rect x="-18" y="-48" width="10" height="96" fill="#ef4444" />
        <rect x="4" y="-48" width="10" height="96" fill="#ef4444" />
      </>
    );
  }

  if (type === "isolated-danger") {
    return (
      <>
        <rect x="-22" y="-48" width="44" height="96" rx="8" fill="#111827" />
        <rect x="-22" y="-4" width="44" height="16" fill="#ef4444" />
      </>
    );
  }

  if (type === "special-mark") {
    return <rect x="-22" y="-48" width="44" height="96" rx="8" fill="#fde047" />;
  }

  if (type === "wreck-mark") {
    return (
      <>
        <rect x="-22" y="-48" width="44" height="96" rx="8" fill="#fde047" />
        <rect x="-12" y="-48" width="8" height="96" fill="#38bdf8" />
        <rect x="4" y="-48" width="8" height="96" fill="#38bdf8" />
      </>
    );
  }

  if (type === "north-cardinal") {
    return (
      <>
        <rect x="-22" y="-48" width="44" height="48" fill="#111827" />
        <rect x="-22" y="0" width="44" height="48" fill="#facc15" />
      </>
    );
  }

  if (type === "south-cardinal") {
    return (
      <>
        <rect x="-22" y="-48" width="44" height="48" fill="#facc15" />
        <rect x="-22" y="0" width="44" height="48" fill="#111827" />
      </>
    );
  }

  if (type === "east-cardinal") {
    return (
      <>
        <rect x="-22" y="-48" width="44" height="32" fill="#111827" />
        <rect x="-22" y="-16" width="44" height="32" fill="#facc15" />
        <rect x="-22" y="16" width="44" height="32" fill="#111827" />
      </>
    );
  }

  return (
    <>
      <rect x="-22" y="-48" width="44" height="32" fill="#facc15" />
      <rect x="-22" y="-16" width="44" height="32" fill="#111827" />
      <rect x="-22" y="16" width="44" height="32" fill="#facc15" />
    </>
  );
}