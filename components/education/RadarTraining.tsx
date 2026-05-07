"use client";

import { useMemo, useState } from "react";

import GlowPanel from "@/components/ui/GlowPanel";
import MetricCard from "@/components/ui/MetricCard";
import RadarGrid from "@/components/radar/RadarGrid";
import OwnShip from "@/components/radar/OwnShip";

import { calculateCPA } from "@/lib/radar/cpaEngine";

type RadarMode = "harbor" | "offshore" | "storm" | "arpa" | "mob";
type Threat = "LOW" | "MEDIUM" | "HIGH";

type Target = {
  id: string;
  name: string;
  type: string;
  range: string;
  bearing: string;
  sog: string;
  cpa: string;
  tcpa: string;
  threat: Threat;
  x: number;
  y: number;
  color: string;
};

const TARGETS: Target[] = [
  {
    id: "RAD-001",
    name: "MV AEGEAN STAR",
    type: "Cargo Vessel",
    range: "2.1 NM",
    bearing: "042°",
    sog: "13.2 kn",
    cpa: "0.24 NM",
    tcpa: "05:12",
    threat: "HIGH",
    x: 76,
    y: 34,
    color: "#ff6464",
  },

  {
    id: "RAD-002",
    name: "PILOT 7",
    type: "Pilot Boat",
    range: "1.4 NM",
    bearing: "300°",
    sog: "18.5 kn",
    cpa: "0.82 NM",
    tcpa: "09:44",
    threat: "MEDIUM",
    x: 26,
    y: 28,
    color: "#ffd76a",
  },

  {
    id: "RAD-003",
    name: "ALBATROS",
    type: "Sailing Yacht",
    range: "3.8 NM",
    bearing: "188°",
    sog: "6.4 kn",
    cpa: "1.62 NM",
    tcpa: "22:10",
    threat: "LOW",
    x: 52,
    y: 82,
    color: "#58f7ff",
  },
];

const MODES: { id: RadarMode; label: string; desc: string }[] = [
  {
    id: "harbor",
    label: "Harbor",
    desc: "Liman içi kısa menzil radar gözetimi",
  },

  {
    id: "offshore",
    label: "Offshore",
    desc: "Açık deniz radar operasyonu",
  },

  {
    id: "storm",
    label: "Storm",
    desc: "Rain / Sea clutter simülasyonu",
  },

  {
    id: "arpa",
    label: "ARPA",
    desc: "Automatic Radar Plotting Aid",
  },

  {
    id: "mob",
    label: "MOB",
    desc: "Man overboard radar işaretleme",
  },
];

export default function RadarTraining() {
  const [mode, setMode] = useState<RadarMode>("arpa");

  const [selectedId, setSelectedId] = useState("RAD-001");

  const activeTarget = useMemo(
    () => TARGETS.find((target) => target.id === selectedId) ?? TARGETS[0],
    [selectedId]
  );

  const cpaResult = calculateCPA(
    {
      x: 50,
      y: 50,
      courseDeg: 90,
      speedKn: 12,
    },

    {
      x: activeTarget.x,
      y: activeTarget.y,

      courseDeg:
        activeTarget.threat === "HIGH"
          ? 240
          : activeTarget.threat === "MEDIUM"
          ? 310
          : 180,

      speedKn:
        activeTarget.threat === "HIGH"
          ? 18
          : activeTarget.threat === "MEDIUM"
          ? 14
          : 6,
    }
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] px-4 py-8 text-white">
      <style>{`
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes targetPulse {
          0%,100% { transform: scale(.92); opacity:.72; }
          50% { transform: scale(1.14); opacity:1; }
        }

        @keyframes waveMove {
          0% { transform: translateX(-25px); opacity:.16; }
          50% { opacity:.45; }
          100% { transform: translateX(25px); opacity:.16; }
        }

        @keyframes alertBlink {
          0%,100% { opacity:.28; }
          50% { opacity:1; }
        }

        @keyframes vectorGlow {
          0%,100% { opacity:.35; }
          50% { opacity:.95; }
        }

        .radar-sweep {
          animation: radarSweep 7s linear infinite;
          transform-origin: bottom center;
        }

        .target-pulse {
          animation: targetPulse 1.8s ease-in-out infinite;
        }

        .wave-line {
          animation: waveMove 6s ease-in-out infinite alternate;
        }

        .alert-blink {
          animation: alertBlink 1s ease-in-out infinite;
        }

        .vector-glow {
          animation: vectorGlow 2s ease-in-out infinite;
        }
      `}</style>

      <section className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[34px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl md:p-7">
          <p className="text-xs font-black tracking-[0.35em] text-cyan-300">
            ALBATROS SAILING
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            Radar & ARPA Bridge Engine
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
            Radar target tracking, ARPA acquisition, CPA/TCPA monitoring,
            collision awareness, storm watch ve MOB radar operasyonlarını öğren.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <MetricCard label="MODE" value={mode.toUpperCase()} />
            <MetricCard label="RANGE" value="6 NM" />
            <MetricCard label="TARGETS" value={`${TARGETS.length}`} />
            <MetricCard label="ARPA" value="ACTIVE" />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <GlowPanel className="relative min-h-[760px] overflow-hidden p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.16),transparent_62%)]" />

            {mode === "storm" && (
              <div className="absolute inset-0 opacity-35">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="wave-line absolute h-px w-full bg-cyan-100/30"
                    style={{
                      top: `${6 + i * 8}%`,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="relative mx-auto aspect-square w-full max-w-[680px] rounded-full border border-cyan-300/20 bg-cyan-300/[0.03]">
              <RadarGrid />

              <div className="radar-sweep absolute left-1/2 top-1/2 h-1/2 w-[4px] -translate-x-1/2 -translate-y-full bg-gradient-to-t from-cyan-300 to-transparent opacity-60" />

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <OwnShip />
              </div>

              {TARGETS.map((target) => (
                <RadarTarget
                  key={target.id}
                  target={target}
                  selected={target.id === selectedId}
                  onSelect={() => setSelectedId(target.id)}
                />
              ))}

              <ArpaVectors />

              {mode === "mob" && <MobMarker />}

              <div className="absolute left-6 top-6 rounded-2xl border border-cyan-300/20 bg-black/55 px-4 py-3">
                <p className="text-[10px] font-black tracking-[0.25em] text-cyan-300">
                  RADAR DISPLAY
                </p>

                <p className="mt-1 text-sm font-black text-white">
                  X-BAND · ARPA ACTIVE
                </p>
              </div>

              {cpaResult.risk === "HIGH" && (
                <div className="alert-blink absolute left-1/2 top-8 -translate-x-1/2 rounded-2xl border border-red-300/40 bg-red-500/20 px-5 py-3 text-xs font-black text-red-100 shadow-[0_0_35px_rgba(248,113,113,.35)]">
                  CPA/TCPA COLLISION ALERT
                </div>
              )}

              <div className="absolute bottom-6 left-6 rounded-2xl border border-cyan-300/20 bg-black/55 px-4 py-3 text-xs font-black text-cyan-100">
                TRUE MOTION
              </div>

              <div className="absolute bottom-6 right-6 rounded-2xl border border-cyan-300/20 bg-black/55 px-4 py-3 text-xs font-black text-cyan-100">
                GAIN AUTO
              </div>
            </div>
          </GlowPanel>

          <GlowPanel className="p-5">
            <p className="text-xs font-black tracking-[0.3em] text-cyan-300">
              RADAR CONTROL PANEL
            </p>

            <div className="mt-4 grid gap-3">
              {MODES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    mode === item.id
                      ? "border-cyan-300 bg-cyan-300/20 text-cyan-100"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-cyan-300/10"
                  }`}
                >
                  <p className="font-black">{item.label}</p>

                  <p className="mt-1 text-xs text-slate-300">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <p className="text-xs font-black tracking-[0.25em] text-cyan-200">
                ACTIVE TARGET
              </p>

              <h2 className="mt-2 text-3xl font-black">
                {activeTarget.name}
              </h2>

              <p className="mt-1 text-sm font-bold text-cyan-100">
                {activeTarget.type}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MetricCard label="RANGE" value={activeTarget.range} />
              <MetricCard label="BRG" value={activeTarget.bearing} />
              <MetricCard label="SOG" value={activeTarget.sog} />
              <MetricCard label="CPA" value={activeTarget.cpa} />
              <MetricCard label="TCPA" value={activeTarget.tcpa} />

              <MetricCard
                label="LIVE CPA"
                value={`${cpaResult.cpaDistance.toFixed(2)} NM`}
              />

              <MetricCard
                label="LIVE TCPA"
                value={`${cpaResult.tcpaMinutes.toFixed(1)} MIN`}
              />

              <MetricCard
                label="COLLISION RISK"
                value={cpaResult.risk}
              />
            </div>

            <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <p className="text-xs font-black tracking-[0.25em] text-cyan-200">
                RADAR NOTES
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-100">
                Radar görüntüsü sürekli izlenmeli. CPA/TCPA değerleri ARPA ile
                doğrulanmalı. Kısıtlı görüşte AIS, radar ve görsel gözcülük
                birlikte kullanılmalıdır.
              </p>
            </div>

            <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <p className="text-xs font-black tracking-[0.25em] text-cyan-200">
                CPA / TCPA NEDİR?
              </p>

              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-100">
                <p>
                  <span className="font-black text-cyan-100">
                    CPA (Closest Point of Approach)
                  </span>
                  , iki geminin birbirine en fazla yaklaşacağı minimum
                  mesafeyi ifade eder.
                </p>

                <p>
                  <span className="font-black text-cyan-100">
                    TCPA (Time to CPA)
                  </span>
                  , bu yaklaşmanın kaç dakika sonra gerçekleşeceğini gösterir.
                </p>

                <p>
                  ARPA radar sistemleri hedeflerin course ve speed bilgilerini
                  analiz ederek çarpışma riskini hesaplar.
                </p>

                <p>
                  Düşük CPA + kısa TCPA kombinasyonu collision risk anlamına
                  gelir ve COLREG değerlendirmesi gerektirir.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {TARGETS.map((target) => (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => setSelectedId(target.id)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    selectedId === target.id
                      ? "border-cyan-300 bg-cyan-300/20 text-cyan-100"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-cyan-300/10"
                  }`}
                >
                  <p className="font-black">{target.name}</p>

                  <p className="mt-1 text-xs">
                    {target.range} · CPA {target.cpa} · {target.threat}
                  </p>
                </button>
              ))}
            </div>
          </GlowPanel>
        </div>
      </section>
    </main>
  );
}

function RadarTarget({
  target,
  selected,
  onSelect,
}: {
  target: Target;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="absolute -translate-x-1/2 -translate-y-1/2 text-left"
      style={{
        left: `${target.x}%`,
        top: `${target.y}%`,
      }}
    >
      <div
        className={`target-pulse h-5 w-5 rounded-full border border-white ${
          selected ? "ring-4 ring-cyan-300/40" : ""
        }`}
        style={{
          background: target.color,
          boxShadow: `0 0 30px ${target.color}`,
        }}
      />

      <div className="absolute left-7 top-1/2 min-w-[160px] -translate-y-1/2 rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-xs text-cyan-100">
        <p className="font-black">{target.name}</p>

        <p className="mt-1 text-[10px] text-slate-300">
          CPA {target.cpa} · TCPA {target.tcpa}
        </p>
      </div>
    </button>
  );
}

function ArpaVectors() {
  return (
    <>
      <div className="vector-glow absolute left-[76%] top-[34%] h-[180px] w-[3px] rotate-[130deg] rounded-full bg-gradient-to-t from-red-400 to-transparent opacity-70" />

      <div className="vector-glow absolute left-[26%] top-[28%] h-[140px] w-[2px] rotate-[40deg] rounded-full bg-gradient-to-t from-yellow-300 to-transparent opacity-70" />

      <div className="vector-glow absolute left-[52%] top-[82%] h-[120px] w-[2px] rotate-180 rounded-full bg-gradient-to-t from-cyan-300 to-transparent opacity-70" />
    </>
  );
}

function MobMarker() {
  return (
    <div className="absolute left-[68%] top-[62%] flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-orange-300 bg-orange-400/20 shadow-[0_0_40px_rgba(251,146,60,.45)]">
      <span className="text-xs font-black text-orange-100">
        MOB
      </span>
    </div>
  );
}