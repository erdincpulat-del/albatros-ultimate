"use client";

import { useMemo, useState } from "react";

type Scenario =
  | "head-on"
  | "crossing-starboard"
  | "crossing-port"
  | "overtaking";

const scenarios = [
  {
    id: "head-on",
    title: "Head-On Situation",
    rule: "COLREG Rule 14",
    desc: "İki güçle yürütülen tekne karşılıklı yaklaşır.",
  },

  {
    id: "crossing-starboard",
    title: "Crossing From Starboard",
    rule: "COLREG Rule 15",
    desc: "Diğer tekne sancaktan yaklaşır.",
  },

  {
    id: "crossing-port",
    title: "Crossing From Port",
    rule: "COLREG Rule 15",
    desc: "Diğer tekne iskeleden yaklaşır.",
  },

  {
    id: "overtaking",
    title: "Overtaking",
    rule: "COLREG Rule 13",
    desc: "Bir tekne diğerini kıç tarafından geçer.",
  },
] as const;

export default function Page() {
  const [scenario, setScenario] =
    useState<Scenario>("head-on");

  const analysis = useMemo(() => {
    switch (scenario) {
      case "head-on":
        return {
          giveWay: "Both vessels",
          action:
            "Her iki tekne sancağa dönüş yapmalıdır.",
          risk: "HIGH",
          bearing: "000° Relative",
        };

      case "crossing-starboard":
        return {
          giveWay: "Own Ship",
          action:
            "Sancaktan gelen tekneye yol verilmelidir.",
          risk: "HIGH",
          bearing: "045° Relative",
        };

      case "crossing-port":
        return {
          giveWay: "Target Vessel",
          action:
            "Stand-on vessel olarak rota korunmalıdır.",
          risk: "MEDIUM",
          bearing: "315° Relative",
        };

      case "overtaking":
        return {
          giveWay: "Overtaking Vessel",
          action:
            "Geçen tekne emniyetli geçiş sağlamalıdır.",
          risk: "MEDIUM",
          bearing: "170° Relative",
        };
    }
  }, [scenario]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-[34px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <p className="text-xs font-black tracking-[0.35em] text-cyan-300">
            INTERNATIONAL REGULATIONS FOR PREVENTING COLLISIONS AT SEA
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-6xl">
            COLREG Scenario Engine
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Head-on, crossing ve overtaking durumlarında
            hangi teknenin give-way veya stand-on olduğunu öğren.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* RADAR AREA */}
          <div className="relative overflow-hidden rounded-[34px] border border-cyan-300/10 bg-cyan-300/[0.03] p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.14),transparent_70%)]" />

            <div className="relative mx-auto aspect-square max-w-[640px] rounded-full border border-cyan-300/10">
              {/* radar circles */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-cyan-300/10"
                  style={{
                    inset: `${10 + i * 8}%`,
                  }}
                />
              ))}

              {/* own ship */}
              <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200 bg-cyan-300/30 shadow-[0_0_40px_rgba(34,211,238,.45)]" />

              {/* target */}
              <Target scenario={scenario} />

              {/* collision vector */}
              <CollisionVector scenario={scenario} />

              {/* labels */}
              <div className="absolute left-1/2 top-4 -translate-x-1/2 text-xs font-black tracking-[0.25em] text-cyan-100">
                N
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-black tracking-[0.25em] text-cyan-100">
                S
              </div>

              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black tracking-[0.25em] text-cyan-100">
                W
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black tracking-[0.25em] text-cyan-100">
                E
              </div>
            </div>
          </div>

          {/* CONTROL PANEL */}
          <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-xs font-black tracking-[0.35em] text-cyan-300">
              SCENARIO SELECT
            </p>

            <div className="mt-5 grid gap-3">
              {scenarios.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    setScenario(item.id as Scenario)
                  }
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    scenario === item.id
                      ? "border-cyan-300 bg-cyan-300/20"
                      : "border-white/10 bg-white/[0.03] hover:bg-cyan-300/10"
                  }`}
                >
                  <p className="font-black text-white">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-300">
                    {item.rule}
                  </p>

                  <p className="mt-2 text-sm text-slate-300">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* ANALYSIS */}
            <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
              <p className="text-xs font-black tracking-[0.25em] text-cyan-200">
                LIVE ANALYSIS
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Info
                  title="RISK"
                  value={analysis.risk}
                />

                <Info
                  title="RELATIVE BRG"
                  value={analysis.bearing}
                />

                <Info
                  title="GIVE-WAY"
                  value={analysis.giveWay}
                />

                <Info
                  title="RULE"
                  value={
                    scenarios.find(
                      (s) => s.id === scenario
                    )?.rule || "-"
                  }
                />
              </div>
            </div>

            {/* ACTION */}
            <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
              <p className="text-xs font-black tracking-[0.25em] text-cyan-200">
                WHAT SHOULD YOU DO?
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-100">
                {analysis.action}
              </p>
            </div>

            {/* EDUCATION */}
            <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
              <p className="text-xs font-black tracking-[0.25em] text-cyan-200">
                EDUCATIONAL NOTE
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-100">
                COLREG kuralları yalnızca çarpışmayı önlemek için
                değil, diğer gemilerin hareketlerini tahmin
                edebilmek için de standart davranış sistemi sağlar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Target({
  scenario,
}: {
  scenario: Scenario;
}) {
  const position = useMemo(() => {
    switch (scenario) {
      case "head-on":
        return {
          left: "50%",
          top: "16%",
        };

      case "crossing-starboard":
        return {
          left: "76%",
          top: "36%",
        };

      case "crossing-port":
        return {
          left: "24%",
          top: "36%",
        };

      case "overtaking":
        return {
          left: "50%",
          top: "26%",
        };
    }
  }, [scenario]);

  return (
    <div
      className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-200 bg-red-400/30 shadow-[0_0_40px_rgba(248,113,113,.55)]"
      style={position}
    />
  );
}

function CollisionVector({
  scenario,
}: {
  scenario: Scenario;
}) {
  const style = useMemo(() => {
    switch (scenario) {
      case "head-on":
        return {
          left: "50%",
          top: "18%",
          rotate: "180deg",
        };

      case "crossing-starboard":
        return {
          left: "72%",
          top: "36%",
          rotate: "220deg",
        };

      case "crossing-port":
        return {
          left: "28%",
          top: "36%",
          rotate: "140deg",
        };

      case "overtaking":
        return {
          left: "50%",
          top: "28%",
          rotate: "180deg",
        };
    }
  }, [scenario]);

  return (
    <div
      className="absolute h-32 w-[3px] rounded-full bg-gradient-to-t from-red-400 to-transparent opacity-80"
      style={{
        left: style.left,
        top: style.top,
        transform: `translateX(-50%) rotate(${style.rotate})`,
        transformOrigin: "top center",
      }}
    />
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
    <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
      <p className="text-[10px] font-black tracking-[0.2em] text-cyan-300">
        {title}
      </p>

      <p className="mt-2 text-sm font-black text-white">
        {value}
      </p>
    </div>
  );
}