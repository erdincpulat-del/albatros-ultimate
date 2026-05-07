"use client";

import { useMemo, useState } from "react";

type Cardinal = "north" | "east" | "south" | "west";

type Scenario = {
  level: number;
  title: string;
  target: Cardinal;
  question: string;
  hint: string;
};

const DATA: Record<Cardinal, {
  title: string;
  pass: string;
  light: string;
  desc: string;
}> = {
  north: {
    title: "North Cardinal",
    pass: "Kuzeyinden geç",
    light: "Q / VQ continuous",
    desc: "Güvenli su işaretin kuzeyindedir. Tehlike güneyde kalır.",
  },
  east: {
    title: "East Cardinal",
    pass: "Doğusundan geç",
    light: "Q(3) / VQ(3)",
    desc: "Güvenli su işaretin doğusundadır. Tehlike batıda kalır.",
  },
  south: {
    title: "South Cardinal",
    pass: "Güneyinden geç",
    light: "Q(6)+LFl / VQ(6)+LFl",
    desc: "Güvenli su işaretin güneyindedir. Tehlike kuzeyde kalır.",
  },
  west: {
    title: "West Cardinal",
    pass: "Batısından geç",
    light: "Q(9) / VQ(9)",
    desc: "Güvenli su işaretin batısındadır. Tehlike doğuda kalır.",
  },
};

const SCENARIOS: Scenario[] = [
  {
    level: 1,
    title: "Level 1 · Day Recognition",
    target: "north",
    question: "Tehlike güneyde kalacaksa hangi işaretin tarafından geçersin?",
    hint: "North Cardinal güvenli suyun kuzeyde olduğunu gösterir.",
  },
  {
    level: 2,
    title: "Level 2 · Night Light",
    target: "east",
    question: "Gece Q(3) / VQ(3) ışık karakteri gördün. Güvenli geçiş nereden?",
    hint: "East Cardinal üçlü çakar.",
  },
  {
    level: 3,
    title: "Level 3 · Long Flash",
    target: "south",
    question: "Q(6)+LFl gördün. Hangi cardinal işarettir?",
    hint: "South Cardinal altı kısa + bir uzun çakar.",
  },
  {
    level: 4,
    title: "Level 4 · Route Decision",
    target: "west",
    question: "Q(9) ışık karakteri var. Güvenli su hangi tarafta?",
    hint: "West Cardinal dokuzlu çakar.",
  },
];

export default function CardinalTraining() {
  const [mode, setMode] = useState<"day" | "night">("day");
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<Cardinal | null>(null);
  const [score, setScore] = useState(0);

  const scenario = SCENARIOS[step];
  const progress = ((step + 1) / SCENARIOS.length) * 100;

  const result = useMemo(() => {
    if (!answer) return null;
    return answer === scenario.target;
  }, [answer, scenario.target]);

  function choose(type: Cardinal) {
    if (answer) return;
    setAnswer(type);
    if (type === scenario.target) setScore((s) => s + 1);
  }

  function next() {
    setAnswer(null);
    setStep((s) => (s + 1) % SCENARIOS.length);
  }

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-8 text-white">
      <style>{`
        @keyframes seaMove {
          0% { transform: translateX(-40px); opacity: .18; }
          50% { opacity: .4; }
          100% { transform: translateX(40px); opacity: .18; }
        }

        @keyframes flashNorth {
          0%,100% { opacity:.25; }
          50% { opacity:1; }
        }

        @keyframes flashEast {
          0%,100% { opacity:.15; }
          8%,16%,24% { opacity:1; }
          32% { opacity:.15; }
        }

        @keyframes flashSouth {
          0%,100% { opacity:.15; }
          7%,14%,21%,28%,35%,42% { opacity:1; }
          62% { opacity:1; }
        }

        @keyframes flashWest {
          0%,100% { opacity:.15; }
          6%,12%,18%,24%,30%,36%,42%,48%,54% { opacity:1; }
        }

        .sea-line { animation: seaMove 6s ease-in-out infinite alternate; }
        .flash-north { animation: flashNorth 1s infinite; }
        .flash-east { animation: flashEast 2s infinite; }
        .flash-south { animation: flashSouth 3s infinite; }
        .flash-west { animation: flashWest 3.5s infinite; }
      `}</style>

      <section className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black tracking-[0.35em] text-cyan-300">
              ALBATROS SAILING
            </p>
            <h1 className="mt-2 text-3xl font-black md:text-5xl">
              Cardinal Level Training Engine
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Kardinal işaretleri; gündüz sembolü, gece ışık karakteri ve rota kararıyla öğren.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMode(mode === "day" ? "night" : "day")}
            className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-black text-cyan-100"
          >
            {mode === "day" ? "Gece Moduna Geç" : "Gündüz Moduna Geç"}
          </button>
        </header>

        <div className="mb-5 rounded-3xl border border-white/10 bg-white/[0.05] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs tracking-[0.25em] text-cyan-300">
                {scenario.title}
              </p>
              <h2 className="mt-2 text-2xl font-black">{scenario.question}</h2>
              <p className="mt-2 text-sm text-slate-300">{scenario.hint}</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-400">Score</p>
              <p className="text-3xl font-black text-cyan-200">
                {score}/{SCENARIOS.length}
              </p>
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-cyan-300 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div
          className={`relative overflow-hidden rounded-[34px] border border-white/10 p-5 md:p-8 ${
            mode === "night"
              ? "bg-[#010611]"
              : "bg-gradient-to-b from-sky-200 via-sky-500 to-cyan-950"
          }`}
        >
          <div className="absolute inset-0 opacity-40">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="sea-line absolute h-px w-full bg-cyan-100/60"
                style={{ top: `${8 + i * 8}%` }}
              />
            ))}
          </div>

          <div className="relative grid min-h-[680px] grid-cols-3 grid-rows-3 items-center justify-items-center gap-4">
            <div />
            <CardinalCard type="north" mode={mode} answer={answer} target={scenario.target} choose={choose} />
            <div />

            <CardinalCard type="west" mode={mode} answer={answer} target={scenario.target} choose={choose} />

            <div className="flex h-44 w-44 rotate-45 items-center justify-center border border-yellow-200/50 bg-yellow-300 text-black shadow-[0_0_90px_rgba(250,204,21,.45)] md:h-56 md:w-56">
              <div className="-rotate-45 text-center">
                <p className="text-3xl font-black md:text-4xl">DANGER</p>
                <p className="mt-1 text-xs font-bold md:text-sm">Tehlike Alanı</p>
              </div>
            </div>

            <CardinalCard type="east" mode={mode} answer={answer} target={scenario.target} choose={choose} />

            <div />
            <CardinalCard type="south" mode={mode} answer={answer} target={scenario.target} choose={choose} />
            <div />
          </div>
        </div>

        {answer && (
          <div
            className={`mt-6 rounded-3xl border p-5 text-center ${
              result
                ? "border-green-300/40 bg-green-400/10"
                : "border-red-300/40 bg-red-400/10"
            }`}
          >
            <p className="text-2xl font-black">
              {result ? "✅ Doğru karar" : "❌ Yanlış taraf"}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Doğru cevap: <b>{DATA[scenario.target].pass}</b> — {DATA[scenario.target].desc}
            </p>

            <button
              type="button"
              onClick={next}
              className="mt-4 rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-black text-slate-950"
            >
              Sonraki Level
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function CardinalCard({
  type,
  mode,
  answer,
  target,
  choose,
}: {
  type: Cardinal;
  mode: "day" | "night";
  answer: Cardinal | null;
  target: Cardinal;
  choose: (type: Cardinal) => void;
}) {
  const data = DATA[type];

  const isAnswered = answer !== null;
  const isCorrectTarget = type === target;
  const isChosen = answer === type;

  return (
    <button
      type="button"
      onClick={() => choose(type)}
      className={`w-full max-w-[220px] rounded-3xl border p-4 text-center transition ${
        isAnswered && isCorrectTarget
          ? "border-green-300 bg-green-400/20 shadow-[0_0_45px_rgba(74,222,128,.35)]"
          : isChosen
            ? "border-red-300 bg-red-400/20 shadow-[0_0_35px_rgba(248,113,113,.35)]"
            : "border-white/10 bg-black/45 hover:border-cyan-300/40 hover:bg-cyan-300/10"
      }`}
    >
      <p className="text-xs font-black text-cyan-100">{data.light}</p>

      <div className="mt-3 flex justify-center">
        <Buoy type={type} mode={mode} />
      </div>

      <p className="mt-3 text-lg font-black text-white">{data.title}</p>
      <p className="mt-1 text-sm font-bold text-cyan-100">{data.pass}</p>
      <p className="mt-2 text-xs leading-5 text-slate-300">{data.desc}</p>
    </button>
  );
}

function Buoy({ type, mode }: { type: Cardinal; mode: "day" | "night" }) {
  const flashClass =
    type === "north"
      ? "flash-north"
      : type === "east"
      ? "flash-east"
      : type === "south"
      ? "flash-south"
      : "flash-west";

  return (
    <svg viewBox="0 0 120 220" className="h-40 w-24 md:h-44 md:w-28">
      {mode === "night" && (
        <circle className={flashClass} cx="60" cy="26" r="22" fill="#fde68a" />
      )}

      <TopMarks type={type} />

      <g transform="translate(60 130)">
        <rect x="-22" y="-50" width="44" height="100" rx="7" fill="#111827" />
        <BodyPattern type={type} />
        <rect x="-32" y="46" width="64" height="17" rx="8" fill="#111827" />
        <line x1="0" y1="63" x2="0" y2="90" stroke="#cbd5e1" strokeWidth="5" />
      </g>
    </svg>
  );
}

function TopMarks({ type }: { type: Cardinal }) {
  if (type === "north") {
    return (
      <g fill="black">
        <polygon points="60,12 42,46 78,46" />
        <polygon points="60,48 42,82 78,82" />
      </g>
    );
  }

  if (type === "south") {
    return (
      <g fill="black">
        <polygon points="42,18 78,18 60,52" />
        <polygon points="42,54 78,54 60,88" />
      </g>
    );
  }

  if (type === "east") {
    return (
      <g fill="black">
        <polygon points="60,12 42,46 78,46" />
        <polygon points="42,54 78,54 60,88" />
      </g>
    );
  }

  return (
    <g fill="black">
      <polygon points="42,18 78,18 60,52" />
      <polygon points="60,54 42,88 78,88" />
    </g>
  );
}

function BodyPattern({ type }: { type: Cardinal }) {
  if (type === "north") {
    return (
      <>
        <rect x="-22" y="-50" width="44" height="50" fill="#111827" />
        <rect x="-22" y="0" width="44" height="50" fill="#facc15" />
      </>
    );
  }

  if (type === "south") {
    return (
      <>
        <rect x="-22" y="-50" width="44" height="50" fill="#facc15" />
        <rect x="-22" y="0" width="44" height="50" fill="#111827" />
      </>
    );
  }

  if (type === "east") {
    return (
      <>
        <rect x="-22" y="-50" width="44" height="33" fill="#111827" />
        <rect x="-22" y="-17" width="44" height="34" fill="#facc15" />
        <rect x="-22" y="17" width="44" height="33" fill="#111827" />
      </>
    );
  }

  return (
    <>
      <rect x="-22" y="-50" width="44" height="33" fill="#facc15" />
      <rect x="-22" y="-17" width="44" height="34" fill="#111827" />
      <rect x="-22" y="17" width="44" height="33" fill="#facc15" />
    </>
  );
}