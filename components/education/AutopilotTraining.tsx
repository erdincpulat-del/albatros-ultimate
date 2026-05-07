"use client";

import { useMemo, useState } from "react";

import GlowPanel from "@/components/ui/GlowPanel";
import MetricCard from "@/components/ui/MetricCard";
import CompassRose from "@/components/autopilot/CompassRose";
import TrackLine from "@/components/autopilot/TrackLine";
import AutopilotShip from "@/components/autopilot/AutopilotShip";
import WaypointRoute from "@/components/autopilot/WaypointRoute";
import AutopilotAlarmPanel from "@/components/autopilot/AutopilotAlarmPanel";
import { calculateCurrentOffset } from "@/lib/autopilot/currentEngine";

type Mode = "heading" | "track" | "wind" | "manual";

const MODES = [
  { id: "heading", title: "Heading Hold", tr: "Baş Koruma" },
  { id: "track", title: "Track Control", tr: "Rota Takip" },
  { id: "wind", title: "Wind Mode", tr: "Rüzgar Açısı Takibi" },
  { id: "manual", title: "Manual Override", tr: "Manuel Kontrol" },
] as const;

export default function AutopilotTraining() {
  const [mode, setMode] = useState<Mode>("track");
  const [heading, setHeading] = useState(84);
  const [targetHeading, setTargetHeading] = useState(90);
  const [drift, setDrift] = useState(6);
  const [xte, setXte] = useState(0.12);

  const currentVector = calculateCurrentOffset(220, drift);

  const rudder = useMemo(() => {
    const error = targetHeading - heading;
    const correction = mode === "track" ? drift * 0.7 + xte * 25 : 0;
    return Math.max(-35, Math.min(35, error * 0.45 + correction));
  }, [heading, targetHeading, drift, xte, mode]);

  const correctedHeading = useMemo(() => {
    if (mode === "track") return targetHeading + drift * 0.7 + xte * 12;
    if (mode === "wind") return targetHeading - drift * 0.5;
    return targetHeading;
  }, [mode, targetHeading, drift, xte]);

  const status =
    Math.abs(rudder) > 24
      ? "CAUTION"
      : Math.abs(rudder) > 10
      ? "ACTIVE"
      : "STABLE";

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] px-4 py-8 text-white">
      <style>{`
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .radar-sweep {
          animation: radarSweep 7s linear infinite;
          transform-origin: bottom center;
        }
      `}</style>

      <section className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[34px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl md:p-7">
          <p className="text-xs font-black tracking-[0.35em] text-cyan-300">
            ALBATROS SAILING
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            Autopilot / Track Control System
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
            Heading hold, track control, drift correction, waypoint route, XTE
            takibi, sea current vector ve rudder response sistemini öğren.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <MetricCard label="MODE" value={mode.toUpperCase()} />
            <MetricCard label="HDG" value={`${heading.toFixed(0)}°`} />
            <MetricCard label="TARGET" value={`${targetHeading.toFixed(0)}°`} />
            <MetricCard label="STATUS" value={status} />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <GlowPanel className="relative min-h-[740px] overflow-hidden p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.16),transparent_62%)]" />

            <div className="relative mx-auto aspect-square w-full max-w-[680px] overflow-hidden rounded-full border border-cyan-300/20 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),rgba(2,6,23,0.96))] shadow-[0_0_80px_rgba(34,211,238,0.12)]">
              <CompassRose heading={heading} />

              <WaypointRoute xte={xte} drift={drift} />

              <TrackLine />

              <div
                className="absolute left-1/2 top-1/2 h-[140px] w-[3px] rounded-full bg-cyan-300/40 shadow-[0_0_24px_rgba(103,232,249,0.7)]"
                style={{
                  transform: `
                    translate(-50%, -50%)
                    rotate(${drift}deg)
                    translateY(-70px)
                  `,
                }}
              />

              <div
                className="absolute text-[10px] font-black tracking-[0.2em] text-cyan-200"
                style={{
                  left: `calc(50% + ${currentVector.x * 6}px)`,
                  top: `calc(50% + ${currentVector.y * 6}px)`,
                }}
              >
                SEA CURRENT
              </div>

              <div
                className="absolute left-1/2 top-1/2 h-[42%] w-[3px] origin-bottom -translate-x-1/2 -translate-y-full rounded-full bg-gradient-to-t from-yellow-300 to-transparent"
                style={{
                  transform: `translate(-50%, -100%) rotate(${correctedHeading}deg)`,
                }}
              />

              <div className="radar-sweep absolute left-1/2 top-1/2 h-1/2 w-[4px] -translate-x-1/2 -translate-y-full rounded-full bg-gradient-to-t from-cyan-400/0 via-cyan-300/60 to-cyan-100 blur-[1px]" />

              <AutopilotShip heading={heading} rudder={rudder} />

              <div className="absolute left-6 top-6 rounded-2xl border border-cyan-300/20 bg-black/55 px-4 py-3">
                <p className="text-[10px] font-black tracking-[0.25em] text-cyan-300">
                  AUTOPILOT DISPLAY
                </p>

                <p className="mt-1 text-sm font-black text-white">
                  TRACK CONTROL ACTIVE
                </p>
              </div>

              <div className="absolute bottom-6 left-6 rounded-2xl border border-cyan-300/20 bg-black/55 px-4 py-3 text-xs font-black text-cyan-100">
                RUDDER {rudder.toFixed(1)}°
              </div>

              <div className="absolute bottom-6 right-6 rounded-2xl border border-cyan-300/20 bg-black/55 px-4 py-3 text-xs font-black text-cyan-100">
                XTE {xte.toFixed(2)} NM
              </div>
            </div>
          </GlowPanel>

          <GlowPanel className="p-5">
            <p className="text-xs font-black tracking-[0.3em] text-cyan-300">
              AUTOPILOT CONTROL PANEL
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
                  <p className="font-black">{item.title}</p>
                  <p className="mt-1 text-xs">{item.tr}</p>
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-5">
              <ControlSlider
                label="Current Heading"
                value={heading}
                min={0}
                max={359}
                suffix="°"
                onChange={setHeading}
              />

              <ControlSlider
                label="Target Heading"
                value={targetHeading}
                min={0}
                max={359}
                suffix="°"
                onChange={setTargetHeading}
              />

              <ControlSlider
                label="Wind / Current Drift"
                value={drift}
                min={-20}
                max={20}
                suffix="°"
                onChange={setDrift}
              />

              <ControlSlider
                label="Cross Track Error"
                value={xte}
                min={-0.5}
                max={0.5}
                step={0.01}
                suffix=" NM"
                onChange={setXte}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <MetricCard label="HDG" value={`${heading.toFixed(0)}°`} />
              <MetricCard label="TRACK" value={`${correctedHeading.toFixed(0)}°`} />
              <MetricCard label="DRIFT" value={`${drift.toFixed(0)}°`} />
              <MetricCard label="RUDDER" value={`${rudder.toFixed(1)}°`} />
              <MetricCard label="XTE" value={`${xte.toFixed(2)} NM`} />
              <MetricCard label="STATUS" value={status} />
            </div>

            <AutopilotAlarmPanel
              xte={xte}
              rudder={rudder}
              drift={drift}
              mode={mode}
            />

            <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-5">
              <p className="text-xs font-black tracking-[0.25em] text-cyan-200">
                SYSTEM LOGIC
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-100">
                Track Control modunda sistem yalnızca başı değil, rota çizgisinden
                sapmayı da izler. Drift ve XTE arttığında autopilot hedef başı
                düzeltir ve dümen komutu üretir.
              </p>
            </div>
          </GlowPanel>
        </div>
      </section>
    </main>
  );
}

function ControlSlider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-black tracking-[0.2em] text-cyan-300">
          {label}
        </p>

        <p className="text-sm font-black text-white">
          {value.toFixed(step < 1 ? 2 : 0)}
          {suffix}
        </p>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-cyan-300"
      />
    </div>
  );
}