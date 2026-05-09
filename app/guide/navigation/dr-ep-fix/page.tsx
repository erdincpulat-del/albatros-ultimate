"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calculator,
  Compass,
  Crosshair,
  RotateCcw,
  ShieldAlert,
  Waves,
  Radar,
  Navigation,
  Timer,
} from "lucide-react";

type Mode =
  | "DR"
  | "EP"
  | "RUNNING_FIX"
  | "CTS"
  | "SET_DRIFT"
  | "VAR_DEV"
  | "ETA";

type Point = {
  x: number;
  y: number;
};

function clamp360(value: number) {
  return ((value % 360) + 360) % 360;
}

function degToRad(value: number) {
  return (value * Math.PI) / 180;
}

function toNumber(value: string) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function vector(course: number, distance: number) {
  const rad = degToRad(course);

  return {
    x: Math.sin(rad) * distance,
    y: -Math.cos(rad) * distance,
  };
}

function PlotPoint({
  point,
  label,
  color,
}: {
  point: Point;
  label: string;
  color: string;
}) {
  return (
    <>
      <circle
        cx={point.x}
        cy={point.y}
        r="14"
        fill={color}
        className="animate-pulse"
      />

      <circle
        cx={point.x}
        cy={point.y}
        r="28"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.35"
      />

      <text
        x={point.x + 16}
        y={point.y - 16}
        fill={color}
        fontSize="17"
        fontWeight="900"
      >
        {label}
      </text>
    </>
  );
}

export default function Page() {
  const [mode, setMode] = useState<Mode>("DR");

  const [course, setCourse] = useState("090");
  const [speed, setSpeed] = useState("6");
  const [time, setTime] = useState("2");

  const [setDirection, setSetDirection] = useState("160");
  const [currentSpeed, setCurrentSpeed] = useState("1.5");

  const [desiredTrack, setDesiredTrack] = useState("090");

  const [distanceNm, setDistanceNm] = useState("24");

  const [variation, setVariation] = useState("4");
  const [deviation, setDeviation] = useState("2");

  const [bearing1, setBearing1] = useState("045");
  const [bearing2, setBearing2] = useState("320");

  const [plotVersion, setPlotVersion] = useState(0);

  function calculatePlot() {
    setPlotVersion((prev) => prev + 1);
  }

  function reset() {
    setCourse("090");
    setSpeed("6");
    setTime("2");
    setSetDirection("160");
    setCurrentSpeed("1.5");
    setDesiredTrack("090");
    setDistanceNm("24");
    setVariation("4");
    setDeviation("2");
    setBearing1("045");
    setBearing2("320");

    setPlotVersion((prev) => prev + 1);
  }

  const start = {
    x: 135,
    y: 320,
  };

  const calc = useMemo(() => {
    const c = clamp360(toNumber(course));
    const s = toNumber(speed);
    const t = toNumber(time);

    const set = clamp360(toNumber(setDirection));
    const driftSpeed = toNumber(currentSpeed);

    const boatDistance = s * t;
    const driftDistance = driftSpeed * t;

    const boatVector = vector(c, boatDistance);
    const driftVector = vector(set, driftDistance);

    const scale = 15;

    const dr = {
      x: start.x + boatVector.x * scale,
      y: start.y + boatVector.y * scale,
    };

    const ep = {
      x: dr.x + driftVector.x * scale,
      y: dr.y + driftVector.y * scale,
    };

    const fix = {
      x: ep.x + 75,
      y: ep.y - 50,
    };

    const runningFix = {
      x: dr.x + 110,
      y: dr.y - 90,
    };

    const desired = clamp360(toNumber(desiredTrack));

    const correction = (set - desired) * 0.2;

    const cts = clamp360(desired + correction);

    const eta =
      s > 0
        ? (toNumber(distanceNm) /
            Math.max(0.1, s - driftSpeed * 0.2)).toFixed(2)
        : "0";

    const magnetic = clamp360(c - toNumber(variation));
    const compass = clamp360(magnetic - toNumber(deviation));

    return {
      dr,
      ep,
      fix,
      runningFix,
      boatDistance,
      driftDistance,
      cts,
      eta,
      magnetic,
      compass,
    };
  }, [
    course,
    speed,
    time,
    setDirection,
    currentSpeed,
    desiredTrack,
    distanceNm,
    variation,
    deviation,
  ]);

  const modes = [
    {
      id: "DR",
      title: "DR",
      desc: "Course × Speed × Time",
    },
    {
      id: "EP",
      title: "EP",
      desc: "DR + Set & Drift",
    },
    {
      id: "RUNNING_FIX",
      title: "Running Fix",
      desc: "2 kerteriz + hareket",
    },
    {
      id: "CTS",
      title: "CTS",
      desc: "Current karşı rota",
    },
    {
      id: "SET_DRIFT",
      title: "Set & Drift",
      desc: "Akıntı yönü",
    },
    {
      id: "VAR_DEV",
      title: "Variation / Deviation",
      desc: "True → Magnetic → Compass",
    },
    {
      id: "ETA",
      title: "ETA",
      desc: "Mesafe / hız",
    },
  ];

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="relative overflow-hidden border-b border-cyan-300/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
          <Link
            href="/guide/navigation"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Navigation Academy
          </Link>

          <p className="mt-10 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            Navigation Formula Visualization System
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight md:text-7xl">
            Mevki Hesaplama ve{" "}
            <span className="text-cyan-300">Chart Plotting</span>
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            DR, EP, Running Fix, CTS, Set & Drift, Variation / Deviation ve ETA
            hesaplarını tek panelden çalıştırır; sonuçları harita üzerinde
            animasyonlu vektör çizgileriyle gösterir.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <aside className="rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 p-6 shadow-2xl shadow-cyan-950/20">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calculator className="h-6 w-6 text-cyan-300" />
                <h2 className="text-2xl font-black">
                  Navigation Calculator
                </h2>
              </div>

              <button
                type="button"
                onClick={reset}
                className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-6 grid gap-2">
              {modes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setMode(item.id as Mode)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    mode === item.id
                      ? "border-cyan-300/70 bg-cyan-300/15 text-cyan-100"
                      : "border-white/10 bg-white/5 text-slate-300"
                  }`}
                >
                  <div className="font-black">{item.title}</div>

                  <div className="mt-1 text-xs text-slate-400">
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>

            <div className="grid gap-4">
              {[
                ["Course", course, setCourse, "°"],
                ["Speed", speed, setSpeed, "kt"],
                ["Time", time, setTime, "saat"],
                ["Current Set", setDirection, setSetDirection, "°"],
                ["Current Speed", currentSpeed, setCurrentSpeed, "kt"],
                ["Desired Track", desiredTrack, setDesiredTrack, "°"],
                ["Distance", distanceNm, setDistanceNm, "NM"],
                ["Bearing 1", bearing1, setBearing1, "°"],
                ["Bearing 2", bearing2, setBearing2, "°"],
                ["Variation", variation, setVariation, "°"],
                ["Deviation", deviation, setDeviation, "°"],
              ].map(([label, value, setter, unit]) => (
                <label
                  key={label as string}
                  className="grid grid-cols-[1fr_110px_45px] items-center gap-3"
                >
                  <span className="text-sm font-bold text-slate-200">
                    {label as string}
                  </span>

                  <input
                    value={value as string}
                    onChange={(e) =>
                      (
                        setter as React.Dispatch<
                          React.SetStateAction<string>
                        >
                      )(e.target.value)
                    }
                    className="rounded-xl border border-cyan-300/20 bg-slate-900 px-3 py-2 text-lg font-black text-white outline-none focus:border-cyan-300"
                  />

                  <span className="text-sm font-bold text-slate-300">
                    {unit as string}
                  </span>
                </label>
              ))}
            </div>

            <button
              type="button"
              onClick={calculatePlot}
              className="mt-6 w-full rounded-2xl border border-cyan-300/40 bg-cyan-300/15 px-5 py-4 text-lg font-black text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.18)] transition hover:border-cyan-200 hover:bg-cyan-300/25"
            >
              Hesapla ve Haritada Plotla
            </button>
          </aside>

          <div className="rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 p-6 shadow-2xl shadow-cyan-950/20 flex flex-col">
            <div className="mb-4 grid gap-2 text-sm font-semibold md:grid-cols-4">
              <div className="text-cyan-300">━ DR Track</div>
              <div className="text-amber-300">● DR Position</div>
              <div className="text-purple-300">● EP Position</div>
              <div className="text-emerald-300">◎ FIX / RF / CTS</div>
            </div>

            <div
              className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900/70 min-h-[620px]"
              style={{
                backgroundImage:
                  "url('/images/navigation/gokova-chart.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            >
              <div className="absolute inset-0 bg-[#020817]/40" />

              <svg
                key={plotVersion}
                viewBox="0 0 620 420"
                preserveAspectRatio="xMidYMid slice"
                className="relative z-10 h-full w-full"
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <circle
                  cx="520"
                  cy="95"
                  r="50"
                  fill="rgba(34,211,238,0.12)"
                  stroke="rgba(34,211,238,0.35)"
                />

                <text
                  x="512"
                  y="102"
                  fill="#67e8f9"
                  fontSize="22"
                  fontWeight="900"
                >
                  N
                </text>

                <circle
                  cx={start.x}
                  cy={start.y}
                  r="80"
                  fill="none"
                  stroke="rgba(34,211,238,0.08)"
                  strokeWidth="2"
                />

                <PlotPoint
                  point={start}
                  label="START"
                  color="#22d3ee"
                />

                {(mode === "DR" ||
                  mode === "EP" ||
                  mode === "SET_DRIFT" ||
                  mode === "RUNNING_FIX") && (
                  <>
                    <line
                      x1={start.x}
                      y1={start.y}
                      x2={calc.dr.x}
                      y2={calc.dr.y}
                      stroke="#22d3ee"
                      strokeWidth="6"
                      strokeLinecap="round"
                      className="animate-pulse"
                      filter="url(#glow)"
                    />

                    <PlotPoint
                      point={calc.dr}
                      label="DR"
                      color="#f59e0b"
                    />
                  </>
                )}

                {(mode === "EP" ||
                  mode === "SET_DRIFT" ||
                  mode === "CTS") && (
                  <>
                    <line
                      x1={calc.dr.x}
                      y1={calc.dr.y}
                      x2={calc.ep.x}
                      y2={calc.ep.y}
                      stroke="#a855f7"
                      strokeWidth="5"
                      strokeDasharray="12 8"
                      className="animate-pulse"
                      filter="url(#glow)"
                    />

                    <PlotPoint
                      point={calc.ep}
                      label="EP"
                      color="#d946ef"
                    />
                  </>
                )}

                {(mode === "CTS" ||
                  mode === "RUNNING_FIX") && (
                  <>
                    <line
                      x1={calc.ep.x}
                      y1={calc.ep.y}
                      x2={calc.fix.x}
                      y2={calc.fix.y}
                      stroke="#4ade80"
                      strokeWidth="5"
                      strokeDasharray="10 8"
                      className="animate-pulse"
                      filter="url(#glow)"
                    />

                    <PlotPoint
                      point={calc.fix}
                      label="FIX"
                      color="#4ade80"
                    />
                  </>
                )}

                {mode === "RUNNING_FIX" && (
                  <>
                    <line
                      x1={calc.dr.x}
                      y1={calc.dr.y}
                      x2={calc.runningFix.x}
                      y2={calc.runningFix.y}
                      stroke="#fde047"
                      strokeWidth="5"
                      strokeDasharray="15 8"
                      className="animate-pulse"
                    />

                    <PlotPoint
                      point={calc.runningFix}
                      label="RF"
                      color="#fde047"
                    />
                  </>
                )}

                {mode === "CTS" && (
                  <>
                    <path
                      d={`M ${calc.ep.x} ${calc.ep.y}
                      Q ${calc.ep.x + 40} ${calc.ep.y - 80}
                      ${calc.fix.x} ${calc.fix.y}`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="4"
                      strokeDasharray="10 10"
                      className="animate-pulse"
                    />

                    <circle
                      cx={calc.fix.x}
                      cy={calc.fix.y}
                      r="50"
                      fill="none"
                      stroke="rgba(74,222,128,0.15)"
                    />
                  </>
                )}

                <circle
                  cx={calc.fix.x}
                  cy={calc.fix.y}
                  r="85"
                  fill="none"
                  stroke="rgba(74,222,128,0.05)"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                <div className="text-xs font-black uppercase tracking-wider text-cyan-200">
                  DR Distance
                </div>

                <div className="mt-2 text-3xl font-black">
                  {calc.boatDistance.toFixed(2)} NM
                </div>
              </div>

              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                <div className="text-xs font-black uppercase tracking-wider text-amber-200">
                  Drift
                </div>

                <div className="mt-2 text-3xl font-black">
                  {calc.driftDistance.toFixed(2)} NM
                </div>
              </div>

              <div className="rounded-2xl border border-purple-300/20 bg-purple-300/10 p-4">
                <div className="text-xs font-black uppercase tracking-wider text-purple-200">
                  CTS
                </div>

                <div className="mt-2 text-3xl font-black">
                  {Math.round(calc.cts)}°
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                <div className="text-xs font-black uppercase tracking-wider text-emerald-200">
                  ETA
                </div>

                <div className="mt-2 text-3xl font-black">
                  {calc.eta} h
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-4 md:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-5">
            <Compass className="mb-3 h-6 w-6 text-cyan-300" />

            <h3 className="font-black text-cyan-100">DR</h3>

            <p className="mt-2 text-sm leading-7 text-slate-300">
              Son mevki + rota + hız + zaman ile teorik mevki hesaplanır.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-300/25 bg-amber-300/10 p-5">
            <Waves className="mb-3 h-6 w-6 text-amber-300" />

            <h3 className="font-black text-amber-100">
              EP / Set & Drift
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-300">
              Akıntı ve sürüklenme etkileri teorik mevkiye uygulanır.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-5">
            <Radar className="mb-3 h-6 w-6 text-emerald-300" />

            <h3 className="font-black text-emerald-100">
              FIX / Running Fix
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-300">
              Kerteriz ve gözlemsel doğrulama ile gerçek mevki bulunur.
            </p>
          </div>

          <div className="rounded-2xl border border-red-300/25 bg-red-950/20 p-5">
            <ShieldAlert className="mb-3 h-6 w-6 text-red-300" />

            <h3 className="font-black text-red-100">Emniyet</h3>

            <p className="mt-2 text-sm leading-7 text-red-100">
              DR ve EP kesin mevki değildir. FIX ile doğrulanmalıdır.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}