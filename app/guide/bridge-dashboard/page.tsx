"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import GlowPanel from "@/components/ui/GlowPanel";
import MetricCard from "@/components/ui/MetricCard";

type TrainingMode = "day" | "night" | "storm" | "distress";

const systems = [
  { title: "Radar / ARPA", href: "/guide/radar", status: "CPA ALERT", risk: "alert", desc: "Target tracking, CPA/TCPA ve collision awareness." },
  { title: "Autopilot", href: "/guide/autopilot", status: "TRACK ACTIVE", risk: "normal", desc: "Heading hold, route tracking, drift correction ve XTE." },
  { title: "Bridge Alerts", href: "/guide/bridge-alerts", status: "BAMS ONLINE", risk: "alert", desc: "Radar, AIS, ECDIS ve Autopilot alarm merkezi." },
  { title: "ECDIS", href: "/guide/ecdis", status: "ROUTE MONITOR", risk: "normal", desc: "Safety contour, route monitoring ve navigation awareness." },
  { title: "AIS Engine", href: "/guide/ais-engine", status: "TARGET DATA", risk: "normal", desc: "AIS hedef bilgisi, MMSI, SOG, COG ve trafik takibi." },
  { title: "COLREG Engine", href: "/guide/colreg-engine", status: "RULE LOGIC", risk: "normal", desc: "Head-on, crossing, overtaking ve give-way karar sistemi." },
  { title: "GMDSS", href: "/guide/gmdss", status: "DISTRESS READY", risk: "distress", desc: "MAYDAY, DSC, EPIRB, SART, NAVTEX ve VHF prosedürleri." },
  { title: "Passage Planning", href: "/guide/passage-planning", status: "VOYAGE PLAN", risk: "normal", desc: "Waypoint, ETA, alternate route ve seyir planlama." },
];

export default function Page() {
  const [mode, setMode] = useState<TrainingMode>("night");
  const [soundOn, setSoundOn] = useState(false);

  const activeAlerts = systems.filter((item) => item.risk === "alert").length;
  const distressAlerts = systems.filter((item) => item.risk === "distress").length;

  const shell = useMemo(() => {
    if (mode === "distress") return "bg-[#16040a]";
    if (mode === "storm") return "bg-[#03111f]";
    if (mode === "day") return "bg-[#061827]";
    return "bg-[#020617]";
  }, [mode]);

  function playBridgeBeep() {
    setSoundOn(true);

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = mode === "distress" ? 880 : 420;
      gain.gain.value = 0.045;

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start();

      setTimeout(() => {
        oscillator.stop();
        ctx.close();
      }, 180);
    } catch {
      // Browser sound permission engellenirse sistem sessiz devam eder.
    }
  }

  return (
    <main className={`min-h-screen overflow-hidden ${shell} px-4 py-8 text-white`}>
      <style>{`
        @keyframes alertPulse {
          0%,100% { opacity:.45; box-shadow:0 0 20px rgba(34,211,238,.12); }
          50% { opacity:1; box-shadow:0 0 44px rgba(34,211,238,.45); }
        }

        @keyframes distressPulse {
          0%,100% { box-shadow:0 0 35px rgba(248,113,113,.15); }
          50% { box-shadow:0 0 90px rgba(248,113,113,.55); }
        }

        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .bridge-pulse { animation: alertPulse 1.6s ease-in-out infinite; }
        .distress-pulse { animation: distressPulse 1.1s ease-in-out infinite; }
        .radar-sweep { animation: radarSweep 8s linear infinite; transform-origin: bottom center; }
      `}</style>

      <section className="mx-auto max-w-7xl">
        <div
          className={`mb-4 rounded-3xl border px-5 py-3 text-xs font-black tracking-[0.18em] backdrop-blur-xl ${
            mode === "distress"
              ? "border-red-300/40 bg-red-500/15 text-red-100 distress-pulse"
              : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
          }`}
        >
          UTC 12:42 · LAT 37°02.4N · LON 27°25.8E · SOG 7.2KT · COG 084° · WIND
          NW 14KT · DEPTH 18.4M · AP TRACK ACTIVE · ALERTS {activeAlerts}
        </div>

        <header className="mb-6 rounded-[36px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl md:p-8">
          <p className="text-xs font-black tracking-[0.4em] text-cyan-300">
            ALBATROS SAILING — INTEGRATED BRIDGE TRAINING
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-6xl">
            Final Bridge Dashboard
          </h1>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
            Radar, ARPA, AIS, ECDIS, Autopilot, COLREG, GMDSS ve Bridge Alert
            Management modüllerini tek merkezde bağlayan canlı eğitim paneli.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <MetricCard label="BRIDGE" value="ONLINE" />
            <MetricCard label="SYSTEMS" value="08" />
            <MetricCard label="ALERTS" value={`${activeAlerts + distressAlerts}`} />
            <MetricCard label="MODE" value={mode.toUpperCase()} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {(["day", "night", "storm", "distress"] as TrainingMode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={`rounded-full border px-5 py-2 text-xs font-black tracking-[0.2em] transition ${
                  mode === item
                    ? "border-cyan-300 bg-cyan-300/20 text-cyan-100"
                    : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-cyan-300/10"
                }`}
              >
                {item.toUpperCase()}
              </button>
            ))}

            <button
              type="button"
              onClick={playBridgeBeep}
              className="rounded-full border border-yellow-300/30 bg-yellow-400/10 px-5 py-2 text-xs font-black tracking-[0.2em] text-yellow-100"
            >
              {soundOn ? "SOUND TEST" : "ENABLE SOUND"}
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <GlowPanel
            className={`relative min-h-[620px] overflow-hidden p-6 ${
              mode === "distress" ? "distress-pulse" : ""
            }`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.18),transparent_65%)]" />

            <div className="relative mx-auto flex aspect-square max-w-[580px] items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/[0.03]">
              {[...Array(7)].map((_, index) => (
                <div
                  key={index}
                  className="absolute rounded-full border border-cyan-300/10"
                  style={{ inset: `${8 + index * 7}%` }}
                />
              ))}

              <div className="radar-sweep absolute left-1/2 top-1/2 h-1/2 w-[3px] -translate-x-1/2 -translate-y-full rounded-full bg-gradient-to-t from-cyan-300 to-transparent" />

              <div className="z-10 rounded-[30px] border border-cyan-300/20 bg-black/50 px-8 py-6 text-center backdrop-blur-xl">
                <p className="text-xs font-black tracking-[0.3em] text-cyan-300">
                  BRIDGE CORE
                </p>
                <h2 className="mt-3 text-3xl font-black">Systems Integrated</h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
                  Tüm eğitim modülleri tek bridge dashboard altında toplandı.
                </p>
              </div>

              <Node label="RADAR" className="left-[72%] top-[22%]" alert />
              <Node label="AIS" className="left-[22%] top-[28%]" />
              <Node label="ECDIS" className="left-[18%] top-[68%]" />
              <Node label="AUTO" className="left-[76%] top-[66%]" />
              <Node label="GMDSS" className="left-1/2 top-[8%]" distress />
              <Node label="ALERTS" className="left-1/2 top-[88%]" alert />
            </div>
          </GlowPanel>

          <GlowPanel className="p-5">
            <p className="text-xs font-black tracking-[0.3em] text-cyan-300">
              BRIDGE SYSTEM SHORTCUTS
            </p>

            <div className="mt-5 grid gap-3">
              {systems.map((system) => (
                <Link
                  key={system.href}
                  href={system.href}
                  className={`rounded-3xl border p-4 transition hover:border-cyan-300/50 hover:bg-cyan-300/10 ${
                    system.risk === "distress"
                      ? "border-red-300/30 bg-red-500/10"
                      : system.risk === "alert"
                      ? "border-orange-300/30 bg-orange-400/10 bridge-pulse"
                      : "border-white/10 bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-white">
                        {system.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {system.desc}
                      </p>
                    </div>

                    <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[10px] font-black tracking-[0.2em] text-cyan-100">
                      {system.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </GlowPanel>
        </div>
      </section>
    </main>
  );
}

function Node({
  label,
  className,
  alert = false,
  distress = false,
}: {
  label: string;
  className: string;
  alert?: boolean;
  distress?: boolean;
}) {
  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-4 py-2 text-[10px] font-black tracking-[0.2em] shadow-[0_0_24px_rgba(34,211,238,.25)] ${
        distress
          ? "border-red-300/40 bg-red-500/20 text-red-100 distress-pulse"
          : alert
          ? "border-orange-300/40 bg-orange-400/20 text-orange-100 bridge-pulse"
          : "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
      } ${className}`}
    >
      {label}
    </div>
  );
}