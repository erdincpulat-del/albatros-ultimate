"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  Gauge,
  Info,
  Navigation,
  RotateCcw,
  ShieldAlert,
  Waves,
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

function ResultCard({
  title,
  value,
  suffix,
  color,
  icon,
}: {
  title: string;
  value: string;
  suffix?: string;
  color: "cyan" | "amber" | "green" | "purple" | "red";
  icon?: React.ReactNode;
}) {
  const styles = {
    cyan: "border-cyan-300/30 bg-cyan-300/10 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.08)]",
    amber:
      "border-amber-300/30 bg-amber-300/10 text-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.08)]",
    green:
      "border-green-300/30 bg-green-300/10 text-green-300 shadow-[0_0_30px_rgba(74,222,128,0.08)]",
    purple:
      "border-purple-300/30 bg-purple-300/10 text-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.08)]",
    red: "border-red-300/30 bg-red-300/10 text-red-300 shadow-[0_0_30px_rgba(248,113,113,0.08)]",
  };

  return (
    <div className={`rounded-2xl border p-5 ${styles[color]}`}>
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
        {icon}
        {title}
      </div>

      <div className="mt-3 flex items-end gap-2">
        <span className="text-4xl font-black text-white">{value}</span>
        {suffix ? (
          <span className="pb-1 text-sm font-black">{suffix}</span>
        ) : null}
      </div>
    </div>
  );
}

export default function Page() {
  const [mounted, setMounted] = useState(false);

  const [plannedCourse, setPlannedCourse] = useState("080");
  const [boatSpeed, setBoatSpeed] = useState("6.0");
  const [currentDirection, setCurrentDirection] = useState("180");
  const [currentSpeed, setCurrentSpeed] = useState("4.0");
  const [timeHours, setTimeHours] = useState("2");

  useEffect(() => {
    setMounted(true);
  }, []);

  const result = useMemo(() => {
    const course = clamp360(toNumber(plannedCourse));
    const speed = Math.max(0, toNumber(boatSpeed));
    const set = clamp360(toNumber(currentDirection));
    const current = Math.max(0, toNumber(currentSpeed));
    const time = Math.max(0, toNumber(timeHours));

    const boatDistance = speed * time;
    const drift = current * time;

    const courseRad = (course * Math.PI) / 180;
    const setRad = (set * Math.PI) / 180;

    const boatX = Math.sin(courseRad) * speed;
    const boatY = Math.cos(courseRad) * speed;

    const currentX = Math.sin(setRad) * current;
    const currentY = Math.cos(setRad) * current;

    const resultX = boatX + currentX;
    const resultY = boatY + currentY;

    const cog = clamp360((Math.atan2(resultX, resultY) * 180) / Math.PI);
    const sog = Math.sqrt(resultX ** 2 + resultY ** 2);

    const desiredX = Math.sin(courseRad);
    const desiredY = Math.cos(courseRad);

    const rightX = Math.cos(courseRad);
    const rightY = -Math.sin(courseRad);

    const currentAlong = currentX * desiredX + currentY * desiredY;
    const currentCross = currentX * rightX + currentY * rightY;

    const ratio = speed > 0 ? -currentCross / speed : 0;
    const attainable = Math.abs(ratio) <= 1;

    const correctionDeg = attainable ? (Math.asin(ratio) * 180) / Math.PI : 0;
    const cts = attainable ? clamp360(course + correctionDeg) : course;

    const correctedSog = attainable
      ? speed * Math.cos((correctionDeg * Math.PI) / 180) + currentAlong
      : 0;

    const correctionAbs = Math.abs(correctionDeg);

    const quality =
      !attainable || correctedSog <= 0
        ? "KRİTİK"
        : correctionAbs > 45
          ? "DİKKAT"
          : "MÜKEMMEL";

    return {
      course,
      speed,
      set,
      current,
      time,
      boatDistance,
      drift,
      cog,
      sog,
      cts,
      correctionDeg,
      correctionAbs,
      correctedSog,
      attainable,
      quality,
    };
  }, [plannedCourse, boatSpeed, currentDirection, currentSpeed, timeHours]);

  const center = { x: 310, y: 310 };
  const plannedEnd = polarPoint(center.x, center.y, result.course, 190);
  const setEnd = polarPoint(center.x, center.y, result.set, 210);
  const driftEnd = polarPoint(plannedEnd.x, plannedEnd.y, result.set, 105);
  const cogEnd = polarPoint(center.x, center.y, result.cog, 225);
  const ctsEnd = polarPoint(center.x, center.y, result.cts, 215);

  function resetValues() {
    setPlannedCourse("080");
    setBoatSpeed("6.0");
    setCurrentDirection("180");
    setCurrentSpeed("4.0");
    setTimeHours("2");
  }

  const tickLines = mounted
    ? Array.from({ length: 72 }).map((_, i) => {
        const deg = i * 5;
        const outer = polarPoint(310, 310, deg, 282);
        const inner = polarPoint(310, 310, deg, i % 6 === 0 ? 250 : 266);

        return (
          <line
            key={`tick-${deg}`}
            x1={outer.x}
            y1={outer.y}
            x2={inner.x}
            y2={inner.y}
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={i % 6 === 0 ? 2 : 1}
          />
        );
      })
    : null;

  const degreeLabels = mounted
    ? Array.from({ length: 12 }).map((_, i) => {
        const deg = i * 30;
        const p = polarPoint(310, 310, deg, 235);

        return (
          <text
            key={`degree-${deg}`}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.78)"
            fontSize="18"
            fontWeight="800"
          >
            {String(deg).padStart(3, "0")}
          </text>
        );
      })
    : null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020817] text-white">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_12%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_82%_22%,rgba(59,130,246,0.16),transparent_35%)]" />

        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.04] bg-[linear-gradient(rgba(34,211,238,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.16)_1px,transparent_1px)] bg-[size:38px_38px]" />

        <div className="relative z-20 mx-auto max-w-7xl px-5 pt-24 pb-16 md:px-8">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/guide/navigation"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.10)] hover:bg-cyan-300/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Navigation Academy
            </Link>

            <div className="rounded-xl border border-cyan-300/25 bg-slate-950/80 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
              Tidal Stream & Current
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
                Akıntı Vektör Simülasyonu
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] md:text-6xl">
                Pusula Üzerinde{" "}
                <span className="text-cyan-300 drop-shadow-[0_0_24px_rgba(34,211,238,0.4)]">
                  CTS Hesabı
                </span>
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                Planlanan rota, akıntı yönü, drift, gerçek rota ve düzeltilmiş
                rota aynı pusula üzerinde renkli vektörlerle gösterilir.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-[#0b2236]/90 via-[#081520]/90 to-[#041018]/95 p-5 shadow-[0_0_50px_rgba(34,211,238,0.10)] backdrop-blur-xl">
              <div className="flex gap-3">
                <Info className="mt-1 h-6 w-6 shrink-0 text-cyan-300" />

                <p className="text-sm leading-7 text-slate-200">
                  Akıntı tekneyi set yönünde sürükler. Planlanan hatta kalmak
                  için dümen, hesaplanan CTS değerine çevrilir.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
            <div className="rounded-[2rem] border border-cyan-300/30 bg-gradient-to-br from-[#081827]/90 via-[#061421]/85 to-[#020817]/95 p-5 shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-xl">
              <div className="mb-4 grid gap-2 text-sm font-semibold md:grid-cols-2 lg:grid-cols-3">
                <div className="text-cyan-300">━ Planlanan Rota</div>
                <div className="text-red-300">━ Akıntı Yönü</div>
                <div className="text-amber-300">┅ Drift</div>
                <div className="text-green-300">┅ Gerçek Rota / COG</div>
                <div className="text-purple-300">┅ Düzeltilmiş Rota / CTS</div>
              </div>

              <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/25 bg-slate-900/70 shadow-[0_0_80px_rgba(34,211,238,0.12)]">
                <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[size:34px_34px]" />

                <svg
                  viewBox="0 0 620 620"
                  className="relative w-full scale-[1.02] transition-all duration-700"
                >
                  <circle
                    cx="310"
                    cy="310"
                    r="280"
                    fill="rgba(2,8,23,0.55)"
                    stroke="rgba(34,211,238,0.28)"
                    strokeWidth="2"
                  />

                  <circle cx="310" cy="310" r="220" fill="none" stroke="rgba(34,211,238,0.12)" />
                  <circle cx="310" cy="310" r="160" fill="none" stroke="rgba(34,211,238,0.11)" />
                  <circle cx="310" cy="310" r="100" fill="none" stroke="rgba(34,211,238,0.10)" />

                  {tickLines}
                  {degreeLabels}

                  <text x="310" y="34" textAnchor="middle" fill="#ef4444" fontSize="32" fontWeight="900">
                    N
                  </text>
                  <text x="586" y="316" textAnchor="middle" fill="#22d3ee" fontSize="26" fontWeight="900">
                    E
                  </text>
                  <text x="310" y="594" textAnchor="middle" fill="#ef4444" fontSize="32" fontWeight="900">
                    S
                  </text>
                  <text x="34" y="316" textAnchor="middle" fill="#e2e8f0" fontSize="26" fontWeight="900">
                    W
                  </text>

                  <polygon points="310,70 328,310 310,292 292,310" fill="rgba(255,255,255,0.14)" />
                  <polygon points="310,550 292,310 310,328 328,310" fill="rgba(255,255,255,0.08)" />
                  <polygon points="70,310 310,292 292,310 310,328" fill="rgba(255,255,255,0.08)" />
                  <polygon points="550,310 310,328 328,310 310,292" fill="rgba(255,255,255,0.12)" />

                  <circle cx={center.x} cy={center.y} r="12" fill="rgba(255,255,255,0.95)" />
                  <circle cx={center.x} cy={center.y} r="6" fill="#22d3ee" />

                  <line x1={center.x} y1={center.y} x2={plannedEnd.x} y2={plannedEnd.y} stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" />
                  <circle cx={plannedEnd.x} cy={plannedEnd.y} r="8" fill="#22d3ee" />
                  <text x={plannedEnd.x + 12} y={plannedEnd.y - 8} fill="#22d3ee" fontSize="22" fontWeight="900">
                    {formatDeg(result.course)}°
                  </text>

                  <line x1={center.x} y1={center.y} x2={setEnd.x} y2={setEnd.y} stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                  <circle cx={setEnd.x} cy={setEnd.y} r="8" fill="#ef4444" />
                  <text x={setEnd.x} y={setEnd.y + 34} textAnchor="middle" fill="#ef4444" fontSize="22" fontWeight="900">
                    {formatDeg(result.set)}°
                  </text>

                  <line x1={plannedEnd.x} y1={plannedEnd.y} x2={driftEnd.x} y2={driftEnd.y} stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeDasharray="9 7" />

                  <line x1={center.x} y1={center.y} x2={cogEnd.x} y2={cogEnd.y} stroke="#4ade80" strokeWidth="5" strokeLinecap="round" strokeDasharray="10 8" />
                  <circle cx={cogEnd.x} cy={cogEnd.y} r="8" fill="#4ade80" />
                  <text x={cogEnd.x + 12} y={cogEnd.y + 4} fill="#4ade80" fontSize="22" fontWeight="900">
                    {formatDeg(result.cog)}°
                  </text>

                  <line x1={center.x} y1={center.y} x2={ctsEnd.x} y2={ctsEnd.y} stroke="#a855f7" strokeWidth="5" strokeLinecap="round" strokeDasharray="10 8" />
                  <circle cx={ctsEnd.x} cy={ctsEnd.y} r="8" fill="#a855f7" />
                  <text x={ctsEnd.x - 48} y={ctsEnd.y - 8} fill="#c084fc" fontSize="22" fontWeight="900">
                    {formatDeg(result.cts)}°
                  </text>
                </svg>
              </div>
            </div>

            <aside className="grid gap-5">
              <div className="rounded-[2rem] border border-cyan-300/30 bg-gradient-to-br from-[#0b2236]/90 via-[#081520]/90 to-[#041018]/95 p-5 shadow-[0_0_55px_rgba(34,211,238,0.10)] backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl font-black text-cyan-300">
                    <Calculator className="h-5 w-5" />
                    Girdiler
                  </h2>

                  <button
                    type="button"
                    onClick={resetValues}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/10"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Sıfırla
                  </button>
                </div>

                <div className="grid gap-4">
                  {[
                    ["Planlanan Rota", plannedCourse, setPlannedCourse, "°"],
                    ["Tekne Hızı", boatSpeed, setBoatSpeed, "kt"],
                    ["Akıntı Yönü / Set", currentDirection, setCurrentDirection, "°"],
                    ["Akıntı Hızı", currentSpeed, setCurrentSpeed, "kt"],
                    ["Süre", timeHours, setTimeHours, "saat"],
                  ].map(([label, value, setter, unit]) => (
                    <label key={label as string} className="grid grid-cols-[1fr_110px_42px] items-center gap-3">
                      <span className="text-sm font-bold text-slate-200">{label as string}</span>

                      <input
                        value={value as string}
                        onChange={(e) =>
                          (setter as React.Dispatch<React.SetStateAction<string>>)(
                            e.target.value
                          )
                        }
                        className="rounded-xl border border-cyan-300/25 bg-slate-900 px-3 py-2 text-lg font-black text-white outline-none transition focus:border-cyan-300"
                      />

                      <span className="text-sm font-bold text-slate-300">{unit as string}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-cyan-300/30 bg-gradient-to-br from-[#0b2236]/90 via-[#081520]/90 to-[#041018]/95 p-5 shadow-[0_0_55px_rgba(34,211,238,0.10)] backdrop-blur-xl">
                <h2 className="mb-4 text-xl font-black text-cyan-300">Sonuçlar</h2>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                  <ResultCard title="Drift" value={result.drift.toFixed(2)} suffix="NM" color="amber" />
                  <ResultCard title="COG" value={`${formatDeg(result.cog)}°`} color="green" />
                  <ResultCard title="SOG" value={result.sog.toFixed(2)} suffix="kt" color="cyan" />
                  <ResultCard
                    title="CTS"
                    value={result.attainable ? `${formatDeg(result.cts)}°` : "No safe CTS"}
                    color="purple"
                  />
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Düzeltme Açısı
                  </p>
                  <p className="mt-2 text-4xl font-black">
                    {result.correctionAbs.toFixed(1)}°
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Planlanan hatta kalmak için teknenin burnu yaklaşık bu kadar
                    düzeltilir.
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-green-300/30 bg-green-300/10 p-4 shadow-[0_0_30px_rgba(74,222,128,0.08)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-black uppercase tracking-wider text-green-300">
                        Rota Kalitesi
                      </p>
                      <p className="mt-1 text-2xl font-black text-green-300">
                        {result.quality}
                      </p>
                    </div>

                    <CheckCircle2 className="h-10 w-10 text-green-300" />
                  </div>
                </div>
              </div>
            </aside>
          </div>

                    <div className="mt-5 grid overflow-hidden rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-[#081827]/85 via-[#061421]/80 to-[#020817]/90 shadow-[0_0_60px_rgba(34,211,238,0.10)] backdrop-blur-xl md:grid-cols-5">
            <ResultCard
              title="Boat Distance"
              value={result.boatDistance.toFixed(2)}
              suffix="NM"
              color="cyan"
              icon={<Waves className="h-5 w-5" />}
            />

            <ResultCard
              title="Drift"
              value={result.drift.toFixed(2)}
              suffix="NM"
              color="amber"
            />

            <ResultCard
              title="COG"
              value={`${formatDeg(result.cog)}°`}
              color="green"
            />

            <ResultCard
              title="SOG"
              value={result.sog.toFixed(2)}
              suffix="kt"
              color="cyan"
              icon={<Gauge className="h-5 w-5" />}
            />

                        <ResultCard
              title="CTS"
              value={
                result.attainable
                  ? `${formatDeg(result.cts)}°`
                  : "000°"
              }
              color="purple"
              icon={<Navigation className="h-5 w-5" />}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 shadow-[0_0_35px_rgba(245,158,11,0.08)]">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-300" />

              <p className="text-sm leading-7 text-amber-100">
                Bu simülasyon eğitim amaçlıdır. Gerçek seyirde tidal atlas,
                pilot book, güncel hava, derinlik, emniyet marjı ve
                görsel/radar doğrulaması birlikte değerlendirilmelidir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}