"use client";

import Link from "next/link";
import {
  Radar,
  Ship,
  Radio,
  AlertTriangle,
  Navigation,
  Waves,
  Shield,
  Cpu,
  ArrowRight,
  Activity,
} from "lucide-react";

const targets = [
  {
    mmsi: "271004221",
    type: "Cargo Vessel",
    course: "082°",
    speed: "12.4 kt",
    cpa: "1.2 NM",
    tcpa: "18 min",
    risk: "LOW",
    x: "18%",
    y: "22%",
  },
  {
    mmsi: "235881901",
    type: "Fishing Vessel",
    course: "148°",
    speed: "6.1 kt",
    cpa: "0.4 NM",
    tcpa: "07 min",
    risk: "HIGH",
    x: "58%",
    y: "44%",
  },
  {
    mmsi: "247990114",
    type: "Passenger Ship",
    course: "310°",
    speed: "18.8 kt",
    cpa: "2.8 NM",
    tcpa: "32 min",
    risk: "SAFE",
    x: "74%",
    y: "18%",
  },
];

const systems = [
  "AIS Target Tracking",
  "Collision Awareness",
  "CPA / TCPA Engine",
  "Bridge Monitoring",
  "Traffic Density",
  "Live Course Vector",
];

export default function AISEnginePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#061019] text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,183,255,0.22),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(3,8,18,0.1),rgba(3,8,18,0.96))]" />
      </div>

      {/* HERO */}
      <section className="relative border-b border-cyan-400/20">
        {/* HERO IMAGE */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/images/navigation/hero-chart.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#061019] via-[#061019]/85 to-[#061019]/40" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-24 md:px-8 lg:grid-cols-[1fr_520px]">
          {/* LEFT */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <Radio className="h-4 w-4" />
              AIS TRAINING ENGINE
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-white md:text-7xl">
              AIS
              <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-500 bg-clip-text text-transparent">
                Tactical Engine
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
              AIS target tracking, CPA/TCPA değerlendirmesi, trafik yoğunluğu,
              hedef analizi ve bridge awareness sistemlerini profesyonel bridge
              mantığında öğreten interaktif eğitim modülü.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/guide"
                className="group inline-flex items-center gap-3 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-7 py-4 text-sm font-black uppercase tracking-[0.2em] text-cyan-200 transition hover:scale-[1.03] hover:bg-cyan-400/20"
              >
                Akademiye Dön
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <button className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10">
                Live AIS Simulation
              </button>
            </div>

            {/* STATS */}
            <div className="mt-14 grid gap-4 md:grid-cols-4">
              {[
                ["32+", "AIS Target"],
                ["CPA", "Collision Engine"],
                ["Live", "Traffic Analysis"],
                ["Bridge", "Awareness"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-cyan-300/20 bg-[#071521]/80 p-5 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl"
                >
                  <div className="text-3xl font-black text-cyan-300">
                    {value}
                  </div>
                  <div className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT RADAR */}
          <div className="relative flex items-center justify-center">
            <div className="relative h-[520px] w-[520px] overflow-hidden rounded-full border border-cyan-300/20 bg-[#07131d] shadow-[0_0_100px_rgba(0,180,255,0.15)]">
              {/* radar rings */}
              {[80, 160, 240, 320, 400].map((size) => (
                <div
                  key={size}
                  className="absolute rounded-full border border-cyan-400/10"
                  style={{
                    width: size,
                    height: size,
                    left: `calc(50% - ${size / 2}px)`,
                    top: `calc(50% - ${size / 2}px)`,
                  }}
                />
              ))}

              {/* cross */}
              <div className="absolute left-1/2 top-0 h-full w-px bg-cyan-400/10" />
              <div className="absolute left-0 top-1/2 h-px w-full bg-cyan-400/10" />

              {/* sweep */}
              <div className="absolute left-1/2 top-1/2 h-[260px] w-[2px] origin-bottom -translate-x-1/2 -translate-y-full animate-[spin_8s_linear_infinite] bg-gradient-to-t from-cyan-400 via-cyan-300 to-transparent shadow-[0_0_30px_rgba(34,211,238,0.8)]" />

              {/* targets */}
              {targets.map((target) => (
                <div
                  key={target.mmsi}
                  className="absolute"
                  style={{
                    left: target.x,
                    top: target.y,
                  }}
                >
                  <div
                    className={`h-4 w-4 rounded-full ${
                      target.risk === "HIGH"
                        ? "bg-red-400 shadow-[0_0_20px_rgba(248,113,113,1)]"
                        : target.risk === "LOW"
                        ? "bg-yellow-300 shadow-[0_0_20px_rgba(253,224,71,1)]"
                        : "bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,1)]"
                    }`}
                  />

                  <div className="absolute left-6 top-[-10px] w-44 rounded-2xl border border-cyan-300/20 bg-[#08131d]/95 p-3 backdrop-blur-xl">
                    <div className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300">
                      MMSI
                    </div>

                    <div className="mt-1 text-sm font-bold text-white">
                      {target.mmsi}
                    </div>

                    <div className="mt-3 text-xs text-slate-300">
                      {target.type}
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl border border-white/5 bg-white/5 p-2">
                        <div className="text-slate-500">Course</div>
                        <div className="mt-1 font-bold text-cyan-300">
                          {target.course}
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/5 bg-white/5 p-2">
                        <div className="text-slate-500">Speed</div>
                        <div className="mt-1 font-bold text-cyan-300">
                          {target.speed}
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/5 bg-white/5 p-2">
                        <div className="text-slate-500">CPA</div>
                        <div className="mt-1 font-bold text-amber-300">
                          {target.cpa}
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/5 bg-white/5 p-2">
                        <div className="text-slate-500">TCPA</div>
                        <div className="mt-1 font-bold text-amber-300">
                          {target.tcpa}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* center ship */}
              <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-400/10">
                <Ship className="h-7 w-7 text-cyan-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEMS */}
      <section className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT */}
          <div className="rounded-[32px] border border-cyan-300/20 bg-[#07131d]/80 p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Cpu className="h-5 w-5 text-cyan-300" />
              <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
                Integrated Systems
              </p>
            </div>

            <div className="mt-8 grid gap-4">
              {systems.map((system) => (
                <div
                  key={system}
                  className="flex items-center justify-between rounded-2xl border border-cyan-300/10 bg-[#091925] px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-cyan-300" />
                    <span className="font-semibold text-slate-200">
                      {system}
                    </span>
                  </div>

                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
                    Active
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-[32px] border border-cyan-300/20 bg-[#07131d]/80 p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-cyan-300" />
              <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
                Collision Awareness
              </p>
            </div>

            <h2 className="mt-6 text-4xl font-black leading-tight text-white">
              CPA / TCPA
              <span className="block text-cyan-300">
                Risk Decision Logic
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              AIS ve radar hedefleri birlikte değerlendirilerek çarpışma riski,
              yaklaşma süresi ve güvenli geçiş analizi bridge logic mantığında
              yorumlanır.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                ["CPA", "Closest Point"],
                ["TCPA", "Time to CPA"],
                ["Risk", "Bridge Alert"],
              ].map(([a, b]) => (
                <div
                  key={a}
                  className="rounded-2xl border border-cyan-300/10 bg-[#091925] p-5"
                >
                  <div className="text-2xl font-black text-cyan-300">{a}</div>
                  <div className="mt-2 text-sm text-slate-400">{b}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-amber-300/20 bg-amber-400/10 p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="mt-1 h-6 w-6 text-amber-300" />

                <div>
                  <div className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">
                    Bridge Warning
                  </div>

                  <p className="mt-3 leading-7 text-slate-200">
                    TCPA düşerken CPA kritik seviyeye yaklaşırsa sistem bridge
                    alarm mantığında riskli hedefi vurgular.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="border-t border-cyan-400/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-10 text-center md:flex-row md:px-8">
          <div>
            <div className="text-lg font-black text-cyan-300">
              ALBATROS SAILING
            </div>

            <div className="mt-2 text-sm text-slate-500">
              AIS Tactical Navigation Training Platform
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <span>Radar</span>
            <span>AIS</span>
            <span>Bridge</span>
            <span>COLREG</span>
            <span>Navigation</span>
          </div>
        </div>
      </section>
    </main>
  );
}