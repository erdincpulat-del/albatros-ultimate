"use client";

import { useMemo, useState } from "react";

type Target = {
  id: string;
  name: string;
  mmsi: string;
  type: string;
  sog: number;
  cog: number;
  cpa: number;
  tcpa: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
  x: number;
  y: number;
  color: string;
};

const TARGETS: Target[] = [
  {
    id: "TGT-001",
    name: "MV BOSPHORUS",
    mmsi: "271000421",
    type: "Cargo Vessel",
    sog: 12.4,
    cog: 78,
    cpa: 0.18,
    tcpa: "06:10",
    risk: "HIGH",
    x: 78,
    y: 42,
    color: "#ff6262",
  },
  {
    id: "TGT-002",
    name: "ALBATROS ONE",
    mmsi: "271889120",
    type: "Sailing Yacht",
    sog: 6.2,
    cog: 240,
    cpa: 1.8,
    tcpa: "22:40",
    risk: "LOW",
    x: 30,
    y: 70,
    color: "#58f7ff",
  },
  {
    id: "TGT-003",
    name: "AEGEAN PILOT",
    mmsi: "271333111",
    type: "Pilot Boat",
    sog: 18.5,
    cog: 312,
    cpa: 0.62,
    tcpa: "11:20",
    risk: "MEDIUM",
    x: 64,
    y: 22,
    color: "#ffd76a",
  },
  {
    id: "TGT-004",
    name: "SEA TANKER",
    mmsi: "538992001",
    type: "Oil Tanker",
    sog: 14.1,
    cog: 190,
    cpa: 0.32,
    tcpa: "08:42",
    risk: "HIGH",
    x: 84,
    y: 74,
    color: "#ff9a62",
  },
];

function riskGlow(risk: Target["risk"]) {
  switch (risk) {
    case "HIGH":
      return "shadow-[0_0_30px_rgba(255,90,90,0.65)]";
    case "MEDIUM":
      return "shadow-[0_0_24px_rgba(255,210,90,0.45)]";
    default:
      return "shadow-[0_0_20px_rgba(88,247,255,0.35)]";
  }
}

export default function AISEngine() {
  const [selected, setSelected] = useState<Target>(TARGETS[0]);

  const dangerCount = useMemo(
    () => TARGETS.filter((t) => t.risk === "HIGH").length,
    []
  );

  return (
    <main className="min-h-screen bg-[#07101f] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(0,180,255,0.25),transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="rounded-[32px] border border-cyan-500/20 bg-[#0b1527]/80 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(0,180,255,0.12)]">
          <p className="text-cyan-300 text-xs tracking-[0.35em] uppercase mb-3">
            Albatros Sailing
          </p>

          <h1 className="text-5xl md:text-6xl font-black leading-none tracking-tight">
            AIS TARGET
            <br />
            TRACKING ENGINE
          </h1>

          <p className="mt-5 text-slate-300 max-w-3xl text-lg">
            AIS hedef takibi, MMSI analizi, CPA/TCPA riski, COLREG
            değerlendirmesi ve profesyonel bridge awareness sistemi.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4">
              <div className="text-xs text-cyan-200 uppercase tracking-[0.25em]">
                Active Targets
              </div>
              <div className="text-3xl font-black mt-1">
                {TARGETS.length}
              </div>
            </div>

            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4">
              <div className="text-xs text-red-200 uppercase tracking-[0.25em]">
                Danger Targets
              </div>
              <div className="text-3xl font-black mt-1">
                {dangerCount}
              </div>
            </div>

            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-5 py-4">
              <div className="text-xs text-yellow-100 uppercase tracking-[0.25em]">
                AIS Status
              </div>
              <div className="text-3xl font-black mt-1">
                ONLINE
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-cyan-500/20 bg-[#08111f]/90 p-6 shadow-[0_0_50px_rgba(0,140,255,0.1)]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-cyan-300 text-xs tracking-[0.28em] uppercase">
                  AIS Radar Overlay
                </div>
                <div className="text-2xl font-black mt-1">
                  Maritime Traffic View
                </div>
              </div>

              <div className="rounded-full border border-cyan-400/20 px-4 py-2 text-sm bg-cyan-400/10 text-cyan-200">
                Range 6 NM
              </div>
            </div>

            <div className="relative aspect-square rounded-[30px] overflow-hidden border border-cyan-500/10 bg-[#07101b]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,255,0.14),transparent_65%)]" />

              <div className="absolute inset-[10%] border border-cyan-400/10 rounded-full" />
              <div className="absolute inset-[22%] border border-cyan-400/10 rounded-full" />
              <div className="absolute inset-[34%] border border-cyan-400/10 rounded-full" />
              <div className="absolute inset-[46%] border border-cyan-400/10 rounded-full" />

              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-cyan-400/10" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-cyan-400/10" />

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-24 h-40 rounded-[40px] border border-white/20 bg-white/5 backdrop-blur-sm">
                  <div className="absolute inset-x-[34%] top-2 bottom-2 rounded-full bg-white/70" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-20 rounded-b-[22px] bg-[#1b3c78]" />
                </div>

                <div className="text-center text-xs text-cyan-100 mt-3 tracking-[0.25em]">
                  OWN SHIP
                </div>
              </div>

              {TARGETS.map((target) => (
                <button
                  key={target.id}
                  onClick={() => setSelected(target)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${riskGlow(
                    target.risk
                  )}`}
                  style={{
                    left: `${target.x}%`,
                    top: `${target.y}%`,
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white"
                    style={{
                      background: target.color,
                    }}
                  />

                  <div className="absolute left-7 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#08111f]/95 px-3 py-2 text-left min-w-[150px]">
                    <div className="text-xs text-cyan-100 font-bold">
                      {target.name}
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1">
                      CPA {target.cpa} NM
                    </div>
                  </div>
                </button>
              ))}

              <div className="absolute left-5 bottom-5 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs tracking-[0.22em] text-cyan-100">
                AIS OVERLAY ACTIVE
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-cyan-500/20 bg-[#08111f]/90 p-6 shadow-[0_0_50px_rgba(0,140,255,0.08)]">
            <div className="text-cyan-300 text-xs tracking-[0.28em] uppercase">
              Selected Target
            </div>

            <h2 className="text-3xl font-black mt-2">
              {selected.name}
            </h2>

            <div className="mt-6 space-y-3">
              <Info label="MMSI" value={selected.mmsi} />
              <Info label="Type" value={selected.type} />
              <Info label="SOG" value={`${selected.sog} kn`} />
              <Info label="COG" value={`${selected.cog}°`} />
              <Info label="CPA" value={`${selected.cpa} NM`} />
              <Info label="TCPA" value={selected.tcpa} />
              <Info label="Risk" value={selected.risk} />
            </div>

            <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
              <div className="text-xs tracking-[0.24em] uppercase text-cyan-200">
                Recommended Action
              </div>

              <p className="mt-3 text-slate-100 leading-relaxed">
                {selected.risk === "HIGH"
                  ? "Collision risk detected. Early and substantial maneuver recommended."
                  : selected.risk === "MEDIUM"
                  ? "Monitor CPA/TCPA closely and maintain radar watch."
                  : "Safe passing situation. Continue monitoring target movement."}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Mode label="ARPA" value="ACTIVE" />
              <Mode label="AIS RX" value="ONLINE" />
              <Mode label="CPA ALARM" value="ON" />
              <Mode label="TRACKING" value="LIVE" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="text-xs tracking-[0.24em] uppercase text-slate-400">
        {label}
      </div>

      <div className="mt-2 text-lg font-bold text-white">
        {value}
      </div>
    </div>
  );
}

function Mode({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 px-4 py-4">
      <div className="text-xs tracking-[0.22em] uppercase text-cyan-200">
        {label}
      </div>

      <div className="mt-2 text-lg font-black">
        {value}
      </div>
    </div>
  );
}