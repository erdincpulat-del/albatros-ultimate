"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Compass,
  Radar,
  ShieldAlert,
  Target,
} from "lucide-react";

function toNumber(value: string) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function clamp360(value: number) {
  return ((value % 360) + 360) % 360;
}

function polarPoint(cx: number, cy: number, angleDeg: number, length: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;

  return {
    x: Number((cx + Math.cos(rad) * length).toFixed(2)),
    y: Number((cy + Math.sin(rad) * length).toFixed(2)),
  };
}

export default function Page() {
  const [targetBearing, setTargetBearing] = useState("045");
  const [targetRange, setTargetRange] = useState("6");
  const [targetCourse, setTargetCourse] = useState("220");
  const [targetSpeed, setTargetSpeed] = useState("12");

  const result = useMemo(() => {
    const bearing = clamp360(toNumber(targetBearing));
    const range = Math.max(0, toNumber(targetRange));
    const course = clamp360(toNumber(targetCourse));
    const speed = Math.max(0, toNumber(targetSpeed));

    const cpa = Math.max(0.1, range - speed * 0.18);
    const tcpa = Math.max(1, (range / Math.max(speed, 0.1)) * 60);

    const danger =
      cpa < 1
        ? "HIGH RISK"
        : cpa < 2
          ? "WARNING"
          : "SAFE";

    return {
      bearing,
      range,
      course,
      speed,
      cpa,
      tcpa,
      danger,
    };
  }, [targetBearing, targetRange, targetCourse, targetSpeed]);

  const center = { x: 320, y: 320 };

  const target = polarPoint(
    center.x,
    center.y,
    result.bearing,
    result.range * 32
  );

  const targetVector = polarPoint(
    target.x,
    target.y,
    result.course,
    result.speed * 7
  );

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="relative overflow-hidden border-b border-cyan-300/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
          <Link
            href="/guide/navigation"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Navigation Academy
          </Link>

          <p className="mt-10 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            Radar Plotting
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight md:text-7xl">
            CPA / TCPA{" "}
            <span className="text-cyan-300">Radar Eğitimi</span>
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Radar hedefleri, çatışma riski ve güvenli geçiş analizleri için
            temel plotting sistemi.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 p-6">
            <div className="mb-5 flex items-center gap-3">
              <Radar className="h-6 w-6 text-cyan-300" />
              <h2 className="text-2xl font-black">Radar Inputs</h2>
            </div>

            <div className="grid gap-4">
              {[
                ["Target Bearing", targetBearing, setTargetBearing],
                ["Target Range", targetRange, setTargetRange],
                ["Target Course", targetCourse, setTargetCourse],
                ["Target Speed", targetSpeed, setTargetSpeed],
              ].map(([label, value, setter]) => (
                <label
                  key={label as string}
                  className="grid grid-cols-[1fr_120px] items-center gap-3"
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
                </label>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-cyan-300">
                  CPA
                </p>

                <div className="mt-2 text-4xl font-black">
                  {result.cpa.toFixed(1)} NM
                </div>
              </div>

              <div className="rounded-2xl border border-purple-300/25 bg-purple-300/10 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-purple-300">
                  TCPA
                </p>

                <div className="mt-2 text-4xl font-black">
                  {result.tcpa.toFixed(0)} min
                </div>
              </div>

              <div
                className={`rounded-2xl border p-4 ${
                  result.danger === "HIGH RISK"
                    ? "border-red-300/25 bg-red-300/10"
                    : result.danger === "WARNING"
                      ? "border-amber-300/25 bg-amber-300/10"
                      : "border-green-300/25 bg-green-300/10"
                }`}
              >
                <p className="text-xs font-black uppercase tracking-wider">
                  Collision Status
                </p>

                <div className="mt-2 text-3xl font-black">
                  {result.danger}
                </div>
              </div>
            </div>
          </aside>

          <div className="rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 p-6">
            <div className="mb-4 grid gap-2 text-sm font-semibold md:grid-cols-3">
              <div className="text-cyan-300">◎ Own Ship</div>
              <div className="text-red-300">● Radar Target</div>
              <div className="text-amber-300">━ Target Vector</div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900/70">
              <svg viewBox="0 0 640 640" className="relative w-full">
                <circle
                  cx="320"
                  cy="320"
                  r="280"
                  fill="rgba(2,8,23,0.65)"
                  stroke="rgba(34,211,238,0.22)"
                  strokeWidth="2"
                />

                <circle
                  cx="320"
                  cy="320"
                  r="210"
                  fill="none"
                  stroke="rgba(34,211,238,0.12)"
                />

                <circle
                  cx="320"
                  cy="320"
                  r="140"
                  fill="none"
                  stroke="rgba(34,211,238,0.10)"
                />

                <circle
                  cx="320"
                  cy="320"
                  r="70"
                  fill="none"
                  stroke="rgba(34,211,238,0.08)"
                />

                <line
                  x1="320"
                  y1="40"
                  x2="320"
                  y2="600"
                  stroke="rgba(255,255,255,0.12)"
                />

                <line
                  x1="40"
                  y1="320"
                  x2="600"
                  y2="320"
                  stroke="rgba(255,255,255,0.12)"
                />

                <text
                  x="320"
                  y="36"
                  textAnchor="middle"
                  fill="#ef4444"
                  fontSize="30"
                  fontWeight="900"
                >
                  N
                </text>

                <circle
                  cx={center.x}
                  cy={center.y}
                  r="14"
                  fill="#22d3ee"
                />

                <text
                  x={center.x + 20}
                  y={center.y - 12}
                  fill="#22d3ee"
                  fontSize="16"
                  fontWeight="900"
                >
                  OWN SHIP
                </text>

                <line
                  x1={center.x}
                  y1={center.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="rgba(239,68,68,0.35)"
                  strokeWidth="2"
                  strokeDasharray="7 7"
                />

                <circle
                  cx={target.x}
                  cy={target.y}
                  r="12"
                  fill="#ef4444"
                />

                <text
                  x={target.x + 18}
                  y={target.y - 10}
                  fill="#ef4444"
                  fontSize="16"
                  fontWeight="900"
                >
                  TARGET
                </text>

                <line
                  x1={target.x}
                  y1={target.y}
                  x2={targetVector.x}
                  y2={targetVector.y}
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <circle
                  cx={targetVector.x}
                  cy={targetVector.y}
                  r="7"
                  fill="#f59e0b"
                />

                <circle
                  cx="320"
                  cy="320"
                  r={result.cpa * 28}
                  fill="none"
                  stroke={
                    result.danger === "HIGH RISK"
                      ? "rgba(239,68,68,0.55)"
                      : result.danger === "WARNING"
                        ? "rgba(245,158,11,0.55)"
                        : "rgba(74,222,128,0.45)"
                  }
                  strokeWidth="5"
                  strokeDasharray="12 10"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-4 md:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-5">
            <Compass className="mb-3 h-6 w-6 text-cyan-300" />

            <h3 className="font-black text-cyan-100">Bearing</h3>

            <p className="mt-2 text-sm leading-7 text-slate-300">
              Radar hedefinin own ship’e göre yönü.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-300/25 bg-amber-300/10 p-5">
            <Target className="mb-3 h-6 w-6 text-amber-300" />

            <h3 className="font-black text-amber-100">CPA</h3>

            <p className="mt-2 text-sm leading-7 text-slate-300">
              En yakın yaklaşma mesafesi.
            </p>
          </div>

          <div className="rounded-2xl border border-purple-300/25 bg-purple-300/10 p-5">
            <Radar className="mb-3 h-6 w-6 text-purple-300" />

            <h3 className="font-black text-purple-100">TCPA</h3>

            <p className="mt-2 text-sm leading-7 text-slate-300">
              En yakın yaklaşmaya kalan süre.
            </p>
          </div>

          <div className="rounded-2xl border border-red-300/25 bg-red-950/20 p-5">
            <ShieldAlert className="mb-3 h-6 w-6 text-red-300" />

            <h3 className="font-black text-red-100">Collision Risk</h3>

            <p className="mt-2 text-sm leading-7 text-red-100">
              Sabit kerteriz + azalan mesafe çatışma riski göstergesidir.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-300" />

            <p className="text-sm leading-7 text-amber-100">
              Radar plotting eğitim amaçlıdır. Gerçek seyirde COLREG, görsel
              gözlem, AIS, radar doğrulaması ve bridge prosedürleri birlikte
              değerlendirilmelidir.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}