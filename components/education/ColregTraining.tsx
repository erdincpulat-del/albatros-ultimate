"use client";

import { useMemo, useState } from "react";

type Scenario =
  | "headon"
  | "crossing-starboard"
  | "crossing-port"
  | "overtaking"
  | "giveway";

type MotionMode = "relative" | "true";

type Risk = "LOW" | "MEDIUM" | "HIGH";

type ScenarioData = {
  title: string;
  tr: string;
  rule: string;
  desc: string;
  action: string;
  risk: Risk;
  cpa: string;
  tcpa: string;
  targetId: string;
  bearing: string;
  course: string;
  speed: string;
};

const SCENARIOS: Record<Scenario, ScenarioData> = {
  headon: {
    title: "Head-On Situation",
    tr: "Pruva Pruvaya Yaklaşma",
    rule: "COLREG Rule 14",
    desc: "İki tekne karşılıklı yaklaşırken kırmızı ve yeşil borda fenerleri birlikte görülür.",
    action: "Her iki tekne de sancak tarafa belirgin manevra yapar.",
    risk: "HIGH",
    cpa: "0.12 NM",
    tcpa: "04:20",
    targetId: "TGT-014",
    bearing: "000°",
    course: "180°",
    speed: "12.8 kn",
  },
  "crossing-starboard": {
    title: "Crossing · Starboard",
    tr: "Sancak Tarafından Gelen Tekne",
    rule: "COLREG Rule 15",
    desc: "Diğer tekne senin sancak tarafındaysa çatışma riski varsa yol vermelisin.",
    action: "Give-way vessel: erken ve net manevra.",
    risk: "HIGH",
    cpa: "0.18 NM",
    tcpa: "06:10",
    targetId: "TGT-204",
    bearing: "078°",
    course: "270°",
    speed: "10.6 kn",
  },
  "crossing-port": {
    title: "Crossing · Port",
    tr: "İskele Tarafından Gelen Tekne",
    rule: "COLREG Rule 15 / 17",
    desc: "Diğer tekne iskele tarafındaysa genellikle stand-on konumunda olabilirsin.",
    action: "Stand-on vessel: rota ve sürati koru, riski izle.",
    risk: "MEDIUM",
    cpa: "0.42 NM",
    tcpa: "08:40",
    targetId: "TGT-118",
    bearing: "286°",
    course: "090°",
    speed: "8.4 kn",
  },
  overtaking: {
    title: "Overtaking",
    tr: "Yetişme Durumu",
    rule: "COLREG Rule 13",
    desc: "Arkadan yaklaşan tekne her durumda yol vermelidir.",
    action: "Overtaking vessel keep clear.",
    risk: "MEDIUM",
    cpa: "0.30 NM",
    tcpa: "05:35",
    targetId: "TGT-331",
    bearing: "180°",
    course: "000°",
    speed: "14.2 kn",
  },
  giveway: {
    title: "Give-Way Vessel",
    tr: "Yol Veren Tekne",
    rule: "COLREG Rule 16",
    desc: "Yol veren tekne erken, geniş ve anlaşılır manevra yapmalıdır.",
    action: "Alter course early and substantially.",
    risk: "HIGH",
    cpa: "0.10 NM",
    tcpa: "03:50",
    targetId: "TGT-090",
    bearing: "064°",
    course: "240°",
    speed: "11.1 kn",
  },
};

export default function ColregTraining() {
  const [scenario, setScenario] = useState<Scenario>("crossing-starboard");
  const [motionMode, setMotionMode] = useState<MotionMode>("relative");

  const current = useMemo(() => SCENARIOS[scenario], [scenario]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] px-4 py-8 text-white">
      <style>{`
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes targetMoveHeadon {
          0%,100% { transform: translate(-50%, -50%) translateY(-42px) rotate(180deg); }
          50% { transform: translate(-50%, -50%) translateY(34px) rotate(180deg); }
        }

        @keyframes targetMoveRight {
          0%,100% { transform: translate(-50%, -50%) translateX(48px) rotate(-90deg); }
          50% { transform: translate(-50%, -50%) translateX(-28px) rotate(-90deg); }
        }

        @keyframes targetMoveLeft {
          0%,100% { transform: translate(-50%, -50%) translateX(-48px) rotate(90deg); }
          50% { transform: translate(-50%, -50%) translateX(28px) rotate(90deg); }
        }

        @keyframes targetMoveOvertake {
          0%,100% { transform: translate(-50%, -50%) translateY(38px) rotate(0deg); }
          50% { transform: translate(-50%, -50%) translateY(-18px) rotate(0deg); }
        }

        @keyframes pulseRisk {
          0%,100% { opacity:.22; transform:scale(.96); }
          50% { opacity:1; transform:scale(1.05); }
        }

        @keyframes blinkAlert {
          0%,100% { opacity:.25; }
          50% { opacity:1; }
        }

        @keyframes arpaPulse {
          0%,100% { opacity:.45; transform:translate(-50%,-50%) scale(1); }
          50% { opacity:1; transform:translate(-50%,-50%) scale(1.12); }
        }

        @keyframes trailMove {
          0%,100% { opacity:.15; }
          50% { opacity:.9; }
        }

        @keyframes echoBlink {
          0%,100% { opacity:.2; transform:scale(.9); }
          50% { opacity:1; transform:scale(1.12); }
        }

        .radar-sweep { animation: radarSweep 8s linear infinite; transform-origin: center; }
        .risk-pulse { animation: pulseRisk 1.8s ease-in-out infinite; }
        .alert-blink { animation: blinkAlert 1s ease-in-out infinite; }
        .arpa-lock { animation: arpaPulse 1.6s ease-in-out infinite; }
        .trail { animation: trailMove 2s linear infinite; }
        .echo { animation: echoBlink 1.8s ease-in-out infinite; }
        .move-headon { animation: targetMoveHeadon 5s ease-in-out infinite; }
        .move-right { animation: targetMoveRight 5s ease-in-out infinite; }
        .move-left { animation: targetMoveLeft 5s ease-in-out infinite; }
        .move-overtake { animation: targetMoveOvertake 5s ease-in-out infinite; }
      `}</style>

      <section className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[34px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.35em] text-cyan-300">
                ALBATROS SAILING
              </p>

              <h1 className="mt-3 text-4xl font-black md:text-6xl">
                COLREG ARPA Radar Engine
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                COLREG kararlarını radar, ARPA hedef kilidi, AIS etiketi,
                CPA/TCPA, EBL/VRM ve profesyonel radar modlarıyla öğren.
                Sertifika bağlantısı yoktur.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMotionMode("relative")}
                className={`rounded-2xl border px-5 py-3 text-sm font-black transition ${
                  motionMode === "relative"
                    ? "border-cyan-300 bg-cyan-300/20 text-cyan-100"
                    : "border-white/10 bg-black/30 text-slate-300 hover:bg-cyan-300/10"
                }`}
              >
                RELATIVE
              </button>

              <button
                type="button"
                onClick={() => setMotionMode("true")}
                className={`rounded-2xl border px-5 py-3 text-sm font-black transition ${
                  motionMode === "true"
                    ? "border-yellow-200 bg-yellow-200/20 text-yellow-100"
                    : "border-white/10 bg-black/30 text-slate-300 hover:bg-yellow-200/10"
                }`}
              >
                TRUE
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="relative min-h-[720px] overflow-hidden rounded-[36px] border border-cyan-300/20 bg-[#010611] shadow-[0_0_90px_rgba(34,211,238,.14)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-[660px] w-[660px] max-w-[92vw] rounded-full border border-cyan-300/20 bg-cyan-300/[0.025]">
                <div className="absolute inset-[12%] rounded-full border border-cyan-300/15" />
                <div className="absolute inset-[25%] rounded-full border border-cyan-300/15" />
                <div className="absolute inset-[38%] rounded-full border border-cyan-300/15" />

                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-cyan-300/10" />
                <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-cyan-300/10" />

                <div className="radar-sweep absolute left-1/2 top-1/2 h-[330px] w-[3px] origin-bottom -translate-x-1/2 -translate-y-full bg-gradient-to-t from-cyan-300 to-transparent opacity-55" />

                <OwnShip />

                <Target scenario={scenario} />

                <VectorLine scenario={scenario} />

                <AisLabel scenario={scenario} data={current} />

                <ArpaTracking scenario={scenario} />

                <RadarModes />

                <RadarEchoes />

                <EblVrm />

                {current.risk === "HIGH" && (
                  <div className="alert-blink absolute left-1/2 top-10 -translate-x-1/2 rounded-2xl border border-red-300/40 bg-red-500/20 px-5 py-3 text-sm font-black text-red-100 shadow-[0_0_35px_rgba(248,113,113,.35)]">
                    COLLISION ALERT · CPA {current.cpa}
                  </div>
                )}

                <div
                  className={`risk-pulse absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border ${
                    current.risk === "HIGH"
                      ? "border-red-400/50 bg-red-400/10"
                      : current.risk === "MEDIUM"
                      ? "border-yellow-300/50 bg-yellow-300/10"
                      : "border-green-300/50 bg-green-300/10"
                  }`}
                />

                <span className="absolute left-1/2 top-4 -translate-x-1/2 text-sm font-black text-cyan-100">
                  N
                </span>
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-black text-cyan-100">
                  S
                </span>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-cyan-100">
                  W
                </span>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-cyan-100">
                  E
                </span>

                <div className="absolute bottom-6 left-6 rounded-2xl border border-cyan-300/20 bg-black/45 px-4 py-3 text-xs font-black text-cyan-100">
                  MODE: {motionMode.toUpperCase()} MOTION
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-[36px] border border-white/10 bg-black/55 p-5 backdrop-blur-xl">
            <p className="text-xs font-black tracking-[0.3em] text-cyan-300">
              AIS TARGET DATA
            </p>

            <div className="mt-4 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <p className="text-xs font-black tracking-[0.25em] text-cyan-200">
                {current.targetId}
              </p>
              <h2 className="mt-2 text-3xl font-black">{current.title}</h2>
              <p className="mt-1 text-sm font-bold text-cyan-100">
                {current.tr}
              </p>
            </div>

            <div className="mt-4 inline-flex rounded-full border border-yellow-200/20 bg-yellow-200/10 px-3 py-1 text-xs font-black text-yellow-100">
              {current.rule}
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-300">
              {current.desc}
            </p>

            <div className="mt-5 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <p className="text-xs font-black tracking-[0.25em] text-cyan-200">
                RECOMMENDED ACTION
              </p>
              <p className="mt-2 text-lg font-black">{current.action}</p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Metric label="BRG" value={current.bearing} />
              <Metric label="COG" value={current.course} />
              <Metric label="SOG" value={current.speed} />
              <Metric label="CPA" value={current.cpa} />
              <Metric label="TCPA" value={current.tcpa} />
              <Metric label="RISK" value={current.risk} />
            </div>

            <div className="mt-6 grid gap-3">
              {(Object.keys(SCENARIOS) as Scenario[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setScenario(key)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    scenario === key
                      ? "border-cyan-300 bg-cyan-300/20 text-cyan-100"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-cyan-300/10"
                  }`}
                >
                  <p className="font-black">{SCENARIOS[key].title}</p>
                  <p className="mt-1 text-xs">{SCENARIOS[key].tr}</p>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function OwnShip() {
  return (
    <div className="absolute left-1/2 top-1/2 h-44 w-24 -translate-x-1/2 -translate-y-1/2 rounded-[60%_60%_45%_45%] border border-white/30 bg-white/10 shadow-[0_0_60px_rgba(255,255,255,.14)]">
      <div className="absolute left-1/2 top-4 h-32 w-[3px] -translate-x-1/2 bg-slate-200/60" />
      <div className="absolute bottom-8 left-1/2 h-16 w-14 -translate-x-1/2 rounded-b-full bg-slate-900/80" />
      <div className="absolute left-[-58px] top-20 h-16 w-16 rounded-full bg-red-500/30 blur-2xl" />
      <div className="absolute right-[-58px] top-20 h-16 w-16 rounded-full bg-green-400/30 blur-2xl" />
      <div className="absolute bottom-[-38px] left-1/2 h-14 w-14 -translate-x-1/2 rounded-full bg-white/35 blur-2xl" />
      <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black text-cyan-100">
        OWN SHIP
      </p>
    </div>
  );
}

function Target({ scenario }: { scenario: Scenario }) {
  const pos =
    scenario === "headon"
      ? "left-1/2 top-[18%] move-headon"
      : scenario === "crossing-starboard"
      ? "left-[78%] top-1/2 move-right"
      : scenario === "crossing-port"
      ? "left-[22%] top-1/2 move-left"
      : scenario === "overtaking"
      ? "left-1/2 top-[82%] move-overtake"
      : "left-[76%] top-[32%] move-right";

  return (
    <div className={`absolute ${pos}`}>
      <div className="relative h-32 w-20 rounded-[60%_60%_45%_45%] border border-red-300/25 bg-red-300/10 backdrop-blur-xl">
        <div className="absolute left-[-42px] top-14 h-12 w-12 rounded-full bg-red-500/35 blur-2xl" />
        <div className="absolute right-[-42px] top-14 h-12 w-12 rounded-full bg-green-400/30 blur-2xl" />
        <div className="absolute bottom-[-28px] left-1/2 h-10 w-10 -translate-x-1/2 rounded-full bg-white/30 blur-2xl" />
        <div className="absolute inset-3 rounded-[40px] border border-white/10 bg-white/5" />
        <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black text-red-100">
          TARGET
        </p>
      </div>
    </div>
  );
}

function AisLabel({
  scenario,
  data,
}: {
  scenario: Scenario;
  data: ScenarioData;
}) {
  const pos =
    scenario === "headon"
      ? "left-[54%] top-[18%]"
      : scenario === "crossing-starboard"
      ? "left-[63%] top-[38%]"
      : scenario === "crossing-port"
      ? "left-[28%] top-[38%]"
      : scenario === "overtaking"
      ? "left-[54%] top-[72%]"
      : "left-[64%] top-[26%]";

  return (
    <div
      className={`absolute ${pos} rounded-2xl border border-cyan-300/30 bg-black/65 px-4 py-3 text-xs text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,.18)]`}
    >
      <p className="font-black tracking-[0.2em]">{data.targetId}</p>
      <p className="mt-1">BRG {data.bearing}</p>
      <p>COG {data.course}</p>
      <p>SOG {data.speed}</p>
      <p>CPA {data.cpa}</p>
      <p>TCPA {data.tcpa}</p>
    </div>
  );
}

function VectorLine({ scenario }: { scenario: Scenario }) {
  const style =
    scenario === "headon"
      ? "left-1/2 top-[28%] h-[220px] rotate-180"
      : scenario === "crossing-starboard"
      ? "left-[67%] top-1/2 h-[220px] rotate-[-90deg]"
      : scenario === "crossing-port"
      ? "left-[33%] top-1/2 h-[220px] rotate-90"
      : scenario === "overtaking"
      ? "left-1/2 top-[64%] h-[180px]"
      : "left-[67%] top-[38%] h-[220px] rotate-[-120deg]";

  return (
    <div
      className={`absolute ${style} w-[3px] origin-bottom rounded-full bg-gradient-to-t from-red-400 to-transparent opacity-70`}
    />
  );
}

function ArpaTracking({ scenario }: { scenario: Scenario }) {
  const pos =
    scenario === "headon"
      ? "left-1/2 top-[18%]"
      : scenario === "crossing-starboard"
      ? "left-[78%] top-1/2"
      : scenario === "crossing-port"
      ? "left-[22%] top-1/2"
      : scenario === "overtaking"
      ? "left-1/2 top-[82%]"
      : "left-[76%] top-[32%]";

  return (
    <div className={`absolute ${pos}`}>
      <div className="arpa-lock absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-300/60 shadow-[0_0_30px_rgba(34,211,238,.35)]" />

      <div className="trail absolute left-1/2 top-1/2 h-44 w-[2px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gradient-to-t from-cyan-300/0 via-cyan-300/70 to-cyan-300/0" />

      <div className="absolute left-[70px] top-[-22px] rounded-xl border border-cyan-300/30 bg-black/70 px-3 py-2 text-[10px] font-black text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,.25)]">
        ARPA ACQUIRED
      </div>
    </div>
  );
}

function RadarModes() {
  return (
    <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-2">
      {[
        "SEA CLUTTER · LOW",
        "RAIN CLUTTER · OFF",
        "GAIN · AUTO",
        "RANGE · 3 NM",
        "EBL · ACTIVE",
        "VRM · ACTIVE",
      ].map((item) => (
        <div
          key={item}
          className="rounded-xl border border-cyan-300/20 bg-black/70 px-3 py-2 text-[10px] font-black text-cyan-100 backdrop-blur-xl"
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function RadarEchoes() {
  return (
    <>
      <span className="echo absolute left-[28%] top-[31%] h-2 w-2 rounded-full bg-cyan-300" />
      <span className="echo absolute left-[68%] top-[68%] h-2 w-2 rounded-full bg-cyan-300" />
      <span className="echo absolute left-[40%] top-[75%] h-1.5 w-1.5 rounded-full bg-cyan-300" />
      <span className="echo absolute left-[76%] top-[24%] h-1.5 w-1.5 rounded-full bg-cyan-300" />
    </>
  );
}

function EblVrm() {
  return (
    <>
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[2px] origin-bottom -translate-x-1/2 -translate-y-full rotate-[38deg] bg-yellow-200/40" />
      <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-200/25" />
      <div className="absolute left-[63%] top-[31%] rounded-xl border border-yellow-200/20 bg-black/65 px-3 py-2 text-[10px] font-black text-yellow-100">
        EBL 038° · VRM 1.2NM
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-center">
      <p className="text-[10px] font-black tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}