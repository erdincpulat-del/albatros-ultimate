"use client";

import Link from "next/link";
import { MouseEvent, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Calculator,
  Compass,
  Crosshair,
  MapPinned,
  Navigation,
  RotateCcw,
  ShieldAlert,
  Waves,
} from "lucide-react";

type Point = {
  id: string;
  x: number;
  y: number;
};

function toNumber(value: string) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function clamp360(value: number) {
  return ((value % 360) + 360) % 360;
}

function degToRad(value: number) {
  return (value * Math.PI) / 180;
}

function radToDeg(value: number) {
  return (value * 180) / Math.PI;
}

function formatDeg(value: number) {
  return `${String(Math.round(clamp360(value))).padStart(3, "0")}°`;
}

function formatNm(value: number) {
  return `${value.toFixed(2)} NM`;
}

function bearing(from: Point, to: Point) {
  const dx = to.x - from.x;
  const dy = from.y - to.y;
  return clamp360(radToDeg(Math.atan2(dx, dy)));
}

function distance(from: Point, to: Point) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return Math.sqrt(dx * dx + dy * dy) / 18;
}

function vector(course: number, distanceNm: number) {
  const rad = degToRad(course);
  return {
    x: Math.sin(rad) * distanceNm * 18,
    y: -Math.cos(rad) * distanceNm * 18,
  };
}

function ResultCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: "cyan" | "amber" | "green" | "purple";
}) {
  const styles = {
    cyan: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
    amber: "border-amber-300/25 bg-amber-300/10 text-amber-200",
    green: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
    purple: "border-purple-300/25 bg-purple-300/10 text-purple-200",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[color]}`}>
      <div className="text-xs font-black uppercase tracking-wider opacity-80">
        {title}
      </div>
      <div className="mt-2 text-2xl font-black text-white">{value}</div>
    </div>
  );
}

export default function Page() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [points, setPoints] = useState<Point[]>([
    { id: "START", x: 120, y: 325 },
    { id: "WPT 1", x: 270, y: 265 },
    { id: "WPT 2", x: 445, y: 190 },
  ]);

  const [currentSet, setCurrentSet] = useState("160");
  const [currentSpeed, setCurrentSpeed] = useState("1.5");
  const [speed, setSpeed] = useState("6");
  const [time, setTime] = useState("2");
  const [variation, setVariation] = useState("4");
  const [deviation, setDeviation] = useState("2");
  const [plotVersion, setPlotVersion] = useState(0);

  const calculations = useMemo(() => {
    const legs = points.slice(0, -1).map((p, index) => {
      const next = points[index + 1];
      const brg = bearing(p, next);
      const dist = distance(p, next);
      return {
        from: p,
        to: next,
        bearing: brg,
        distance: dist,
      };
    });

    const totalDistance = legs.reduce((sum, leg) => sum + leg.distance, 0);
    const boatSpeed = Math.max(0.1, toNumber(speed));
    const eta = totalDistance / boatSpeed;

    const firstLeg = legs[0];
    const course = firstLeg ? firstLeg.bearing : 90;

    const boatDistance = boatSpeed * Math.max(0, toNumber(time));
    const drV = vector(course, boatDistance);

    const start =
  points.length > 0
    ? points[0]
    : {
        id: "START",
        x: 120,
        y: 325,
      };

const dr = {
  id: "DR",
  x: start.x + drV.x,
  y: start.y + drV.y,
};

    const driftDistance = Math.max(0, toNumber(currentSpeed)) * Math.max(0, toNumber(time));
    const driftV = vector(clamp360(toNumber(currentSet)), driftDistance);

    const ep = {
      id: "EP",
      x: dr.x + driftV.x,
      y: dr.y + driftV.y,
    };

    const fix = {
      id: "FIX",
      x: ep.x + 65,
      y: ep.y - 42,
    };

    const trueCourse = course;
    const magnetic = clamp360(trueCourse - toNumber(variation));
    const compass = clamp360(magnetic - toNumber(deviation));

    const desiredTrack = course;
    const set = clamp360(toNumber(currentSet));
    const current = Math.max(0, toNumber(currentSpeed));

    const currentX = Math.sin(degToRad(set)) * current;
    const currentY = Math.cos(degToRad(set)) * current;

    const desiredX = Math.sin(degToRad(desiredTrack));
    const desiredY = Math.cos(degToRad(desiredTrack));
    const rightX = Math.cos(degToRad(desiredTrack));
    const rightY = -Math.sin(degToRad(desiredTrack));

    const currentAlong = currentX * desiredX + currentY * desiredY;
    const currentCross = currentX * rightX + currentY * rightY;

    const ratio = boatSpeed > 0 ? -currentCross / boatSpeed : 0;
    const correction = Math.abs(ratio) <= 1 ? radToDeg(Math.asin(ratio)) : 0;
    const cts = clamp360(desiredTrack + correction);
    const sog = boatSpeed * Math.cos(degToRad(correction)) + currentAlong;

    return {
      legs,
      totalDistance,
      eta,
      dr,
      ep,
      fix,
      boatDistance,
      driftDistance,
      trueCourse,
      magnetic,
      compass,
      cts,
      sog,
      correction,
    };
  }, [points, speed, time, currentSet, currentSpeed, variation, deviation]);

  function handleChartClick(event: MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 720;
    const y = ((event.clientY - rect.top) / rect.height) * 460;

    const nextNumber = points.length;
    const nextPoint: Point = {
      id: nextNumber === 0 ? "START" : `WPT ${nextNumber}`,
      x,
      y,
    };

    setPoints((prev) => [...prev, nextPoint]);
  }

  function reset() {
    setPoints([
      { id: "START", x: 120, y: 325 },
      { id: "WPT 1", x: 270, y: 265 },
      { id: "WPT 2", x: 445, y: 190 },
    ]);
    setCurrentSet("160");
    setCurrentSpeed("1.5");
    setSpeed("6");
    setTime("2");
    setVariation("4");
    setDeviation("2");
    setPlotVersion((prev) => prev + 1);
  }

  function clearPoints() {
    setPoints([]);
    setPlotVersion((prev) => prev + 1);
  }

  function calculatePlot() {
  if (points.length === 0) {
    setPoints([
      { id: "START", x: 120, y: 325 },
      { id: "WPT 1", x: 270, y: 265 },
      { id: "WPT 2", x: 445, y: 190 },
    ]);
  }

  setPlotVersion((prev) => prev + 1);
}

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="relative overflow-hidden border-b border-cyan-300/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_36%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
          <Link
            href="/guide/navigation"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Navigation Academy
          </Link>

          <p className="mt-10 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            Interactive Chart Plotting Simulator
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight md:text-7xl">
            Chart Plotter{" "}
            <span className="text-cyan-300">Training Engine</span>
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Haritaya tıkla, waypoint oluştur, rota çiz, course / distance
            hesapla, akıntı uygula, DR / EP / FIX / CTS sonuçlarını harita
            üzerinde animasyonlu gör.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 p-6 shadow-2xl shadow-cyan-950/20">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Calculator className="h-6 w-6 text-cyan-300" />
                <h2 className="text-2xl font-black">Plot Controls</h2>
              </div>

              <button
                type="button"
                onClick={reset}
                className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <div className="text-sm font-black text-cyan-200">
                Haritaya tıkla → waypoint ekle
              </div>
              <div className="mt-2 text-xs leading-6 text-slate-300">
                START ve WPT noktaları otomatik çizilir. Course, distance, DR,
                EP, FIX ve CTS yeniden hesaplanır.
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {[
                ["Boat Speed", speed, setSpeed, "kt"],
                ["Time", time, setTime, "saat"],
                ["Current Set", currentSet, setCurrentSet, "°"],
                ["Current Speed", currentSpeed, setCurrentSpeed, "kt"],
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
                      (setter as React.Dispatch<React.SetStateAction<string>>)(
                        e.target.value
                      )
                    }
                    className="rounded-xl border border-cyan-300/20 bg-slate-900 px-3 py-2 text-lg font-black text-white outline-none focus:border-cyan-300"
                  />

                  <span className="text-sm font-bold text-slate-300">
                    {unit as string}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={calculatePlot}
                className="w-full rounded-2xl border border-cyan-300/40 bg-cyan-300/15 px-5 py-4 text-lg font-black text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.18)] transition hover:border-cyan-200 hover:bg-cyan-300/25"
              >
                Hesapla ve Plotla
              </button>

              <button
                type="button"
                onClick={clearPoints}
                className="w-full rounded-2xl border border-red-300/30 bg-red-300/10 px-5 py-3 text-sm font-black text-red-100 transition hover:bg-red-300/20"
              >
                Waypointleri Temizle
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="font-black text-cyan-200">Waypoint List</h3>

              <div className="mt-3 grid gap-2">
                {points.length === 0 ? (
                  <div className="text-sm text-slate-400">
                    Henüz waypoint yok. Haritaya tıkla.
                  </div>
                ) : (
                  points.map((point, index) => (
                    <div
                      key={`${point.id}-${index}`}
                      className="flex items-center justify-between rounded-xl border border-cyan-300/10 bg-slate-900/70 px-3 py-2"
                    >
                      <span className="font-black text-white">{point.id}</span>
                      <span className="text-xs text-slate-400">
                        X {point.x.toFixed(0)} / Y {point.y.toFixed(0)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>

          <div className="rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 p-6 shadow-2xl shadow-cyan-950/20">
            <div className="mb-4 grid gap-2 text-sm font-semibold md:grid-cols-4">
              <div className="text-cyan-300">━ Route Legs</div>
              <div className="text-amber-300">● DR Position</div>
              <div className="text-purple-300">● EP Position</div>
              <div className="text-emerald-300">◎ FIX / CTS</div>
            </div>

            <div
              className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900/70 min-h-[640px]"
              style={{
                backgroundImage: "url('/images/navigation/gokova-chart.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            >
              <div className="absolute inset-0 bg-[#020817]/35" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#020817]/40 via-transparent to-[#020817]/65" />

              <svg
                ref={svgRef}
                key={plotVersion}
                viewBox="0 0 720 460"
                preserveAspectRatio="xMidYMid slice"
                className="relative z-10 h-full w-full cursor-crosshair"
                onClick={handleChartClick}
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

                <rect
                  x="0"
                  y="0"
                  width="720"
                  height="460"
                  fill="rgba(2,8,23,0.05)"
                />

                {calculations.legs.map((leg, index) => (
                  <g key={`leg-${index}`}>
                    <line
                      x1={leg.from.x}
                      y1={leg.from.y}
                      x2={leg.to.x}
                      y2={leg.to.y}
                      stroke="#22d3ee"
                      strokeWidth="5"
                      strokeLinecap="round"
                      filter="url(#glow)"
                      className="animate-pulse"
                    />

                    <text
                      x={(leg.from.x + leg.to.x) / 2 + 10}
                      y={(leg.from.y + leg.to.y) / 2 - 10}
                      fill="#a5f3fc"
                      fontSize="13"
                      fontWeight="900"
                    >
                      {formatDeg(leg.bearing)} / {formatNm(leg.distance)}
                    </text>
                  </g>
                ))}

                {points.map((point, index) => (
                  <g key={`${point.id}-${index}`}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="13"
                      fill={index === 0 ? "#22d3ee" : "#f59e0b"}
                      className="animate-pulse"
                    />
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="25"
                      fill="none"
                      stroke={index === 0 ? "#22d3ee" : "#f59e0b"}
                      strokeWidth="2"
                      opacity="0.35"
                    />
                    <text
                      x={point.x + 16}
                      y={point.y - 16}
                      fill={index === 0 ? "#67e8f9" : "#fbbf24"}
                      fontSize="15"
                      fontWeight="900"
                    >
                      {point.id}
                    </text>
                  </g>
                ))}

                {points.length > 0 ? (
                  <>
                    <line
                      x1={points[0].x}
                      y1={points[0].y}
                      x2={calculations.dr.x}
                      y2={calculations.dr.y}
                      stroke="#f59e0b"
                      strokeWidth="5"
                      strokeDasharray="10 8"
                      className="animate-pulse"
                      filter="url(#glow)"
                    />

                    <circle
                      cx={calculations.dr.x}
                      cy={calculations.dr.y}
                      r="14"
                      fill="#f59e0b"
                      className="animate-pulse"
                    />
                    <text
                      x={calculations.dr.x + 17}
                      y={calculations.dr.y - 14}
                      fill="#f59e0b"
                      fontSize="17"
                      fontWeight="900"
                    >
                      DR
                    </text>

                    <line
                      x1={calculations.dr.x}
                      y1={calculations.dr.y}
                      x2={calculations.ep.x}
                      y2={calculations.ep.y}
                      stroke="#a855f7"
                      strokeWidth="5"
                      strokeDasharray="8 7"
                      className="animate-pulse"
                      filter="url(#glow)"
                    />

                    <circle
                      cx={calculations.ep.x}
                      cy={calculations.ep.y}
                      r="14"
                      fill="#d946ef"
                      className="animate-pulse"
                    />
                    <text
                      x={calculations.ep.x + 17}
                      y={calculations.ep.y - 14}
                      fill="#d946ef"
                      fontSize="17"
                      fontWeight="900"
                    >
                      EP
                    </text>

                    <line
                      x1={calculations.ep.x}
                      y1={calculations.ep.y}
                      x2={calculations.fix.x}
                      y2={calculations.fix.y}
                      stroke="#4ade80"
                      strokeWidth="5"
                      strokeDasharray="9 8"
                      className="animate-pulse"
                      filter="url(#glow)"
                    />

                    <circle
                      cx={calculations.fix.x}
                      cy={calculations.fix.y}
                      r="18"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="5"
                      className="animate-pulse"
                    />
                    <circle
                      cx={calculations.fix.x}
                      cy={calculations.fix.y}
                      r="6"
                      fill="#4ade80"
                    />
                    <text
                      x={calculations.fix.x + 22}
                      y={calculations.fix.y - 14}
                      fill="#4ade80"
                      fontSize="17"
                      fontWeight="900"
                    >
                      FIX
                    </text>
                  </>
                ) : null}

                <circle
                  cx="610"
                  cy="90"
                  r="46"
                  fill="rgba(34,211,238,0.12)"
                  stroke="rgba(34,211,238,0.45)"
                />
                <text
                  x="600"
                  y="98"
                  fill="#67e8f9"
                  fontSize="22"
                  fontWeight="900"
                >
                  N
                </text>
                {points.length === 0 && (
  <text
    x="230"
    y="230"
    fill="#94a3b8"
    fontSize="18"
    fontWeight="700"
  >
    Haritaya tıklayarak waypoint oluştur
  </text>
)}
              </svg>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <ResultCard
                title="Total Distance"
                value={formatNm(calculations.totalDistance)}
                color="cyan"
              />
              <ResultCard
                title="ETA"
                value={`${calculations.eta.toFixed(2)} h`}
                color="amber"
              />
              <ResultCard
                title="CTS"
                value={formatDeg(calculations.cts)}
                color="purple"
              />
              <ResultCard
                title="SOG"
                value={`${calculations.sog.toFixed(2)} kt`}
                color="green"
              />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                <Compass className="mb-2 h-5 w-5 text-cyan-300" />
                <div className="text-sm font-black text-cyan-100">
                  True / Magnetic / Compass
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-300">
                  True {formatDeg(calculations.trueCourse)} → Magnetic{" "}
                  {formatDeg(calculations.magnetic)} → Compass{" "}
                  {formatDeg(calculations.compass)}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                <Waves className="mb-2 h-5 w-5 text-amber-300" />
                <div className="text-sm font-black text-amber-100">
                  Set & Drift
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-300">
                  Set {formatDeg(toNumber(currentSet))} / Drift{" "}
                  {formatNm(calculations.driftDistance)}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                <Crosshair className="mb-2 h-5 w-5 text-emerald-300" />
                <div className="text-sm font-black text-emerald-100">
                  FIX Logic
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-300">
                  EP, gözlem veya kerteriz ile doğrulanınca FIX kabul edilir.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-red-300/25 bg-red-950/20 p-6">
          <div className="flex items-start gap-4">
            <ShieldAlert className="mt-1 h-6 w-6 shrink-0 text-red-300" />
            <p className="leading-8 text-red-100">
              Bu simülasyon eğitim amaçlıdır. Gerçek seyirde chart datum,
              güncel harita, pilot book, derinlik, trafik, hava, akıntı ve
              görsel/radar doğrulaması birlikte değerlendirilmelidir.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}