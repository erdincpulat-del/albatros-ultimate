"use client";

import { useMemo, useState } from "react";

type Signal = {
  id: string;
  title: string;
  rule: string;
  pattern: string;
  meaning: string;
  action: string;
  danger: "LOW" | "MEDIUM" | "HIGH";
};

const SIGNALS: Signal[] = [
  {
    id: "one-short",
    title: "One Short Blast",
    rule: "COLREG Rule 34",
    pattern: "•",
    meaning: "I am altering my course to starboard.",
    action: "Starboard maneuver in progress.",
    danger: "LOW",
  },
  {
    id: "two-short",
    title: "Two Short Blasts",
    rule: "COLREG Rule 34",
    pattern: "••",
    meaning: "I am altering my course to port.",
    action: "Port maneuver in progress.",
    danger: "LOW",
  },
  {
    id: "three-short",
    title: "Three Short Blasts",
    rule: "COLREG Rule 34",
    pattern: "•••",
    meaning: "Operating astern propulsion.",
    action: "Vessel reversing engines.",
    danger: "MEDIUM",
  },
  {
    id: "five-short",
    title: "Five Short Blasts",
    rule: "COLREG Rule 34",
    pattern: "•••••",
    meaning: "Danger / doubt signal.",
    action: "Immediate attention required.",
    danger: "HIGH",
  },
  {
    id: "fog-power",
    title: "Power-driven underway",
    rule: "COLREG Rule 35",
    pattern: "—",
    meaning: "Power vessel making way in fog.",
    action: "Radar + lookout reinforced.",
    danger: "MEDIUM",
  },
  {
    id: "fog-sailing",
    title: "Sailing Vessel",
    rule: "COLREG Rule 35",
    pattern: "— ••",
    meaning: "Sailing vessel in restricted visibility.",
    action: "Maintain safe CPA.",
    danger: "MEDIUM",
  },
  {
    id: "anchor",
    title: "At Anchor",
    rule: "COLREG Rule 35",
    pattern: "🔔",
    meaning: "Anchor bell signal.",
    action: "Anchored vessel nearby.",
    danger: "LOW",
  },
];

function dangerColor(level: Signal["danger"]) {
  switch (level) {
    case "HIGH":
      return "text-red-300 border-red-500/40 bg-red-500/10";
    case "MEDIUM":
      return "text-yellow-200 border-yellow-500/40 bg-yellow-500/10";
    default:
      return "text-cyan-200 border-cyan-500/40 bg-cyan-500/10";
  }
}

export default function SoundSignalsTraining() {
  const [selected, setSelected] = useState<Signal>(SIGNALS[0]);

  const radarPulse = useMemo(() => {
    return Array.from({ length: 4 });
  }, []);

  return (
    <main className="min-h-screen bg-[#061018] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#123a68_0%,#061018_60%)] opacity-70" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 rounded-[32px] border border-cyan-500/20 bg-white/[0.03] backdrop-blur-xl p-8">
          <div className="text-cyan-300 tracking-[0.35em] text-xs font-semibold mb-3">
            ALBATROS SAILING
          </div>

          <h1 className="text-5xl font-black leading-none mb-4">
            Sound Signals Engine
          </h1>

          <p className="max-w-3xl text-white/70 text-lg">
            COLREG ses işaretlerini radar hissi veren profesyonel eğitim
            ekranında öğren. Manevra, sis, tehlike ve demir seslerini
            interaktif olarak incele.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="rounded-[32px] border border-cyan-500/20 bg-[#091421] p-8 relative overflow-hidden min-h-[720px]">
            <div className="absolute inset-0 opacity-20">
              {radarPulse.map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-cyan-400/30"
                  style={{
                    width: `${220 + i * 160}px`,
                    height: `${220 + i * 160}px`,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            </div>

            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-500/20" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-500/20" />

            <div className="relative flex items-center justify-center h-full">
              <div className="relative w-[280px] h-[280px] rounded-full border border-cyan-400/30 bg-cyan-500/5 flex items-center justify-center shadow-[0_0_120px_rgba(34,211,238,0.15)]">
                <div className="absolute w-[180px] h-[180px] rounded-full border border-cyan-300/20" />

                <div className="absolute w-[90px] h-[90px] rounded-full bg-cyan-400/10 border border-cyan-300/20 animate-pulse" />

                <div className="text-center z-10">
                  <div className="text-sm tracking-[0.3em] text-cyan-300 mb-3">
                    ACTIVE SIGNAL
                  </div>

                  <div className="text-6xl font-black mb-4">
                    {selected.pattern}
                  </div>

                  <div className="text-2xl font-bold">
                    {selected.title}
                  </div>
                </div>

                <div className="absolute top-4 text-cyan-200 text-xs">N</div>
                <div className="absolute bottom-4 text-cyan-200 text-xs">S</div>
                <div className="absolute left-4 text-cyan-200 text-xs">W</div>
                <div className="absolute right-4 text-cyan-200 text-xs">E</div>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 flex gap-3">
              <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-200">
                AUDIO MODE ACTIVE
              </div>

              <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-200">
                COLREG ENGINE
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-cyan-500/20 bg-[#091421] p-6">
            <div className="mb-6">
              <div className="text-cyan-300 text-xs tracking-[0.3em] mb-2">
                SIGNAL DATA
              </div>

              <h2 className="text-3xl font-black">
                {selected.title}
              </h2>
            </div>

            <div
              className={`rounded-2xl border p-5 mb-5 ${dangerColor(
                selected.danger
              )}`}
            >
              <div className="text-xs tracking-[0.25em] mb-2">
                RISK LEVEL
              </div>

              <div className="text-2xl font-black">
                {selected.danger}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <Info title="COLREG RULE" value={selected.rule} />
              <Info title="SIGNAL PATTERN" value={selected.pattern} />
              <Info title="MEANING" value={selected.meaning} />
              <Info title="ACTION" value={selected.action} />
            </div>

            <div className="space-y-3">
              {SIGNALS.map((signal) => {
                const active = selected.id === signal.id;

                return (
                  <button
                    key={signal.id}
                    onClick={() => setSelected(signal)}
                    className={`w-full text-left rounded-2xl border transition-all p-4 ${
                      active
                        ? "border-cyan-400 bg-cyan-400/15 shadow-[0_0_40px_rgba(34,211,238,0.2)]"
                        : "border-white/10 bg-white/[0.03] hover:border-cyan-500/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg">
                          {signal.title}
                        </div>

                        <div className="text-sm text-white/60">
                          {signal.rule}
                        </div>
                      </div>

                      <div className="text-3xl font-black text-cyan-200">
                        {signal.pattern}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs tracking-[0.25em] text-cyan-300 mb-2">
        {title}
      </div>

      <div className="text-lg font-semibold text-white/90">
        {value}
      </div>
    </div>
  );
}