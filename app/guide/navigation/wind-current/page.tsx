"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Compass,
  Navigation,
  Wind,
  Waves,
  Gauge,
  ShieldAlert,
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

function formatDeg(value: number) {
  return String(Math.round(clamp360(value))).padStart(3, "0");
}

export default function Page() {
  const [mounted, setMounted] = useState(false);

  const [plannedCourse, setPlannedCourse] = useState("080");
  const [boatSpeed, setBoatSpeed] = useState("6");

  const [currentDirection, setCurrentDirection] = useState("180");
  const [currentSpeed, setCurrentSpeed] = useState("2");

  const [windDirection, setWindDirection] = useState("130");
  const [windForce, setWindForce] = useState("18");

  const [leewayAngle, setLeewayAngle] = useState("8");

  useEffect(() => {
    setMounted(true);
  }, []);

  const result = useMemo(() => {
    const course = clamp360(toNumber(plannedCourse));
    const speed = Math.max(0, toNumber(boatSpeed));

    const currentDir = clamp360(toNumber(currentDirection));
    const current = Math.max(0, toNumber(currentSpeed));

    const windDir = clamp360(toNumber(windDirection));
    const wind = Math.max(0, toNumber(windForce));

    const leeway = toNumber(leewayAngle);

    const courseRad = (course * Math.PI) / 180;
    const currentRad = (currentDir * Math.PI) / 180;

    const windLeewayDirection = clamp360(course + leeway);
    const windLeewayRad = (windLeewayDirection * Math.PI) / 180;

    const boatX = Math.sin(courseRad) * speed;
    const boatY = Math.cos(courseRad) * speed;

    const currentX = Math.sin(currentRad) * current;
    const currentY = Math.cos(currentRad) * current;

    const windEffect = wind * 0.03;

    const windX = Math.sin(windLeewayRad) * windEffect;
    const windY = Math.cos(windLeewayRad) * windEffect;

    const finalX = boatX + currentX + windX;
    const finalY = boatY + currentY + windY;

    const cog = clamp360(
      (Math.atan2(finalX, finalY) * 180) / Math.PI
    );

    const sog = Math.sqrt(finalX ** 2 + finalY ** 2);

    const correction = ((course - cog + 540) % 360) - 180;

    const cts = clamp360(course + correction);

    return {
      course,
      cog,
      sog,
      cts,
      correction,
      currentDir,
      windDir,
      windEffect,
    };
  }, [
    plannedCourse,
    boatSpeed,
    currentDirection,
    currentSpeed,
    windDirection,
    windForce,
    leewayAngle,
  ]);

  const center = { x: 320, y: 320 };

  const plannedEnd = polarPoint(center.x, center.y, result.course, 185);

  const currentEnd = polarPoint(
    center.x,
    center.y,
    result.currentDir,
    220
  );

  const windEnd = polarPoint(center.x, center.y, result.windDir, 240);

  const cogEnd = polarPoint(center.x, center.y, result.cog, 250);

  const ctsEnd = polarPoint(center.x, center.y, result.cts, 205);

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_82%_22%,rgba(168,85,247,0.16),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-10 md:px-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link
              href="/guide/navigation"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Navigation Academy
            </Link>

            <div className="rounded-xl border border-cyan-300/20 bg-slate-950/70 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
              Wind + Current Navigation
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
                Combined Navigation Simulator
              </p>

              <h1 className="mt-3 text-4xl font-black md:text-6xl">
                Wind + Current Combined CTS
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                Akıntı ve rüzgar birlikte değerlendirildiğinde gerçek COG
                değişir. Navigator, düzeltme yaparak tekneyi planlanan hatta
                tutar.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-300/25 bg-slate-950/70 p-5">
              <div className="flex gap-3">
                <Compass className="mt-1 h-6 w-6 shrink-0 text-cyan-300" />

                <p className="text-sm leading-7 text-slate-200">
                  Bu sistem:
                  <br />
                  • Akıntı
                  <br />
                  • Rüzgar
                  <br />
                  • Leeway
                  <br />
                  • Gerçek COG
                  <br />
                  • Düzeltilmiş CTS
                  hesaplarını birlikte gösterir.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
            <div className="rounded-[2rem] border border-cyan-300/25 bg-slate-950/75 p-5">
              <div className="mb-4 grid gap-2 text-sm font-semibold md:grid-cols-2 lg:grid-cols-5">
                <div className="text-cyan-300">━ Planned Course</div>
                <div className="text-red-300">━ Current Vector</div>
                <div className="text-purple-300">━ Wind Vector</div>
                <div className="text-green-300">┅ Real COG</div>
                <div className="text-yellow-300">┅ Corrected CTS</div>
              </div>

              <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900/70">
                <svg viewBox="0 0 640 640" className="relative w-full">
                  <circle
                    cx="320"
                    cy="320"
                    r="285"
                    fill="rgba(2,8,23,0.65)"
                    stroke="rgba(34,211,238,0.24)"
                    strokeWidth="2"
                  />

                  <circle
                    cx="320"
                    cy="320"
                    r="220"
                    fill="none"
                    stroke="rgba(34,211,238,0.12)"
                  />

                  <circle
                    cx="320"
                    cy="320"
                    r="150"
                    fill="none"
                    stroke="rgba(34,211,238,0.10)"
                  />

                  {mounted &&
                    Array.from({ length: 72 }).map((_, i) => {
                      const deg = i * 5;

                      const outer = polarPoint(320, 320, deg, 286);

                      const inner = polarPoint(
                        320,
                        320,
                        deg,
                        i % 6 === 0 ? 248 : 268
                      );

                      return (
                        <line
                          key={deg}
                          x1={outer.x}
                          y1={outer.y}
                          x2={inner.x}
                          y2={inner.y}
                          stroke="rgba(255,255,255,0.55)"
                          strokeWidth={i % 6 === 0 ? 2 : 1}
                        />
                      );
                    })}

                  <text
                    x="320"
                    y="42"
                    textAnchor="middle"
                    fill="#ef4444"
                    fontSize="32"
                    fontWeight="900"
                  >
                    N
                  </text>

                  <text
                    x="598"
                    y="326"
                    textAnchor="middle"
                    fill="#22d3ee"
                    fontSize="26"
                    fontWeight="900"
                  >
                    E
                  </text>

                  <text
                    x="320"
                    y="612"
                    textAnchor="middle"
                    fill="#ef4444"
                    fontSize="32"
                    fontWeight="900"
                  >
                    S
                  </text>

                  <text
                    x="42"
                    y="326"
                    textAnchor="middle"
                    fill="#e2e8f0"
                    fontSize="26"
                    fontWeight="900"
                  >
                    W
                  </text>

                  <circle
                    cx={center.x}
                    cy={center.y}
                    r="12"
                    fill="rgba(255,255,255,0.95)"
                  />

                  <line
                    x1={center.x}
                    y1={center.y}
                    x2={plannedEnd.x}
                    y2={plannedEnd.y}
                    stroke="#22d3ee"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  <line
                    x1={center.x}
                    y1={center.y}
                    x2={currentEnd.x}
                    y2={currentEnd.y}
                    stroke="#ef4444"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <line
                    x1={center.x}
                    y1={center.y}
                    x2={windEnd.x}
                    y2={windEnd.y}
                    stroke="#a855f7"
                    strokeWidth="4"
                    strokeDasharray="10 8"
                    strokeLinecap="round"
                  />

                  <line
                    x1={center.x}
                    y1={center.y}
                    x2={cogEnd.x}
                    y2={cogEnd.y}
                    stroke="#4ade80"
                    strokeWidth="5"
                    strokeDasharray="10 8"
                    strokeLinecap="round"
                  />

                  <line
                    x1={center.x}
                    y1={center.y}
                    x2={ctsEnd.x}
                    y2={ctsEnd.y}
                    stroke="#fde047"
                    strokeWidth="5"
                    strokeDasharray="10 8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <aside className="grid gap-5">
              <div className="rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 p-5">
                <h2 className="mb-5 text-xl font-black text-cyan-300">
                  Navigation Inputs
                </h2>

                <div className="grid gap-4">
                  {[
                    ["Planned Course", plannedCourse, setPlannedCourse],
                    ["Boat Speed", boatSpeed, setBoatSpeed],
                    [
                      "Current Direction",
                      currentDirection,
                      setCurrentDirection,
                    ],
                    ["Current Speed", currentSpeed, setCurrentSpeed],
                    ["Wind Direction", windDirection, setWindDirection],
                    ["Wind Force", windForce, setWindForce],
                    ["Leeway Angle", leewayAngle, setLeewayAngle],
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
                          (
                            setter as React.Dispatch<
                              React.SetStateAction<string>
                            >
                          )(e.target.value)
                        }
                        className="rounded-xl border border-cyan-300/20 bg-slate-900 px-3 py-2 text-lg font-black text-white outline-none focus:border-cyan-300"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-5">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Navigation className="h-5 w-5" />
                    <p className="text-xs font-black uppercase tracking-wider">
                      Real COG
                    </p>
                  </div>

                  <div className="mt-3 text-5xl font-black">
                    {formatDeg(result.cog)}°
                  </div>
                </div>

                <div className="rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-5">
                  <div className="flex items-center gap-2 text-yellow-300">
                    <Compass className="h-5 w-5" />
                    <p className="text-xs font-black uppercase tracking-wider">
                      Corrected CTS
                    </p>
                  </div>

                  <div className="mt-3 text-5xl font-black">
                    {formatDeg(result.cts)}°
                  </div>
                </div>

                <div className="rounded-2xl border border-green-300/25 bg-green-300/10 p-5">
                  <div className="flex items-center gap-2 text-green-300">
                    <Gauge className="h-5 w-5" />
                    <p className="text-xs font-black uppercase tracking-wider">
                      Final SOG
                    </p>
                  </div>

                  <div className="mt-3 text-5xl font-black">
                    {result.sog.toFixed(1)}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-cyan-300/25 bg-slate-950/75 p-5">
              <h3 className="text-xl font-black text-cyan-300">
                Planned Course
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Teknenin gitmek istediği teorik rota hattıdır.
              </p>
            </div>

            <div className="rounded-2xl border border-red-300/25 bg-slate-950/75 p-5">
              <h3 className="flex items-center gap-2 text-xl font-black text-red-300">
                <Waves className="h-5 w-5" />
                Current + Wind
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Akıntı ve rüzgar tekneyi sürükleyerek gerçek COG değerini
                değiştirir.
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-300/25 bg-slate-950/75 p-5">
              <h3 className="flex items-center gap-2 text-xl font-black text-yellow-300">
                <Wind className="h-5 w-5" />
                Corrected CTS
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Navigator, planlanan hatta kalabilmek için dümen yönünü CTS ile
                düzeltir.
              </p>
            </div>
          </section>

          <div className="mt-6 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-300" />

              <p className="text-sm leading-7 text-amber-100">
                Bu simülasyon eğitim amaçlıdır. Gerçek seyirde hava, deniz
                durumu, akıntı, leeway, yük durumu, radar ve görsel doğrulama
                birlikte değerlendirilmelidir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}