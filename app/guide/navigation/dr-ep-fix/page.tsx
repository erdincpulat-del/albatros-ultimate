"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calculator,
  Compass,
  Crosshair,
  MapPinned,
  Navigation,
  ShieldAlert,
  Waves,
} from "lucide-react";

function toNumber(value: string) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function Page() {
  const [course, setCourse] = useState("090");
  const [speed, setSpeed] = useState("6");
  const [time, setTime] = useState("2");
  const [setDirection, setSetDirection] = useState("160");
  const [currentSpeed, setCurrentSpeed] = useState("1.5");

  const result = useMemo(() => {
    const courseDeg = toNumber(course);
    const boatSpeed = toNumber(speed);
    const hours = toNumber(time);
    const setDeg = toNumber(setDirection);
    const current = toNumber(currentSpeed);

    const distance = boatSpeed * hours;
    const drift = current * hours;

    const courseRad = (courseDeg * Math.PI) / 180;
    const setRad = (setDeg * Math.PI) / 180;

    const drX = Math.sin(courseRad) * distance;
    const drY = -Math.cos(courseRad) * distance;

    const driftX = Math.sin(setRad) * drift;
    const driftY = -Math.cos(setRad) * drift;

    const epX = drX + driftX;
    const epY = drY + driftY;

    return {
      distance,
      drift,
      drX,
      drY,
      epX,
      epY,
      fixX: epX + 18,
      fixY: epY - 12,
    };
  }, [course, speed, time, setDirection, currentSpeed]);

  const start = { x: 160, y: 260 };
  const scale = 12;

  const dr = {
    x: clamp(start.x + result.drX * scale, 40, 560),
    y: clamp(start.y + result.drY * scale, 40, 360),
  };

  const ep = {
    x: clamp(start.x + result.epX * scale, 40, 560),
    y: clamp(start.y + result.epY * scale, 40, 360),
  };

  const fix = {
    x: clamp(start.x + result.fixX * scale, 40, 560),
    y: clamp(start.y + result.fixY * scale, 40, 360),
  };

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="relative overflow-hidden border-b border-cyan-300/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_35%)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(34,211,238,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.16)_1px,transparent_1px)] bg-[size:44px_44px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
          <Link
            href="/guide/navigation"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Navigation Academy
          </Link>

          <p className="mt-10 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            DR / EP / FIX Plotter
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight md:text-7xl">
            Mevki Hesaplama ve{" "}
            <span className="text-cyan-300">Plotting Eğitimi</span>
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            DR teorik mevkiyi, EP çevresel etkiler eklenmiş tahmini mevkiyi,
            FIX ise gözlemle doğrulanmış gerçek mevkiyi gösterir.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 p-6 shadow-2xl shadow-cyan-950/20">
            <div className="mb-5 flex items-center gap-3">
              <Calculator className="h-6 w-6 text-cyan-300" />
              <h2 className="text-2xl font-black">Plotting Değerleri</h2>
            </div>

            <div className="grid gap-4">
              {[
                ["Course", course, setCourse, "°"],
                ["Speed", speed, setSpeed, "kt"],
                ["Time", time, setTime, "saat"],
                ["Current Set", setDirection, setSetDirection, "°"],
                ["Current Speed", currentSpeed, setCurrentSpeed, "kt"],
              ].map(([label, value, setter, unit]) => (
                <label
                  key={label as string}
                  className="grid grid-cols-[1fr_120px_45px] items-center gap-3"
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

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-4 font-mono text-sm font-black text-cyan-100">
                DR = Son Mevki + Course × Speed × Time
              </div>

              <div className="rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4 font-mono text-sm font-black text-amber-100">
                EP = DR + Set & Drift
              </div>

              <div className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-4 font-mono text-sm font-black text-emerald-100">
                FIX = Bearing / Range / Observation
              </div>
            </div>
          </aside>

          <div className="rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 p-6 shadow-2xl shadow-cyan-950/20">
            <div className="mb-4 grid gap-2 text-sm font-semibold md:grid-cols-4">
              <div className="text-cyan-300">━ Course Track</div>
              <div className="text-amber-300">● DR Position</div>
              <div className="text-purple-300">● EP Position</div>
              <div className="text-emerald-300">◎ FIX Position</div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900/70">
              <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[size:34px_34px]" />

              <svg viewBox="0 0 620 420" className="relative w-full">
                <path
                  d="M40 320 C120 260 190 310 260 235 C360 130 470 170 585 85"
                  stroke="rgba(16,185,129,0.22)"
                  strokeWidth="46"
                  fill="none"
                  strokeLinecap="round"
                />

                <circle cx={start.x} cy={start.y} r="9" fill="#22d3ee" />
                <text x={start.x - 28} y={start.y + 30} fill="#22d3ee" fontSize="15" fontWeight="900">
                  START
                </text>

                <line
                  x1={start.x}
                  y1={start.y}
                  x2={dr.x}
                  y2={dr.y}
                  stroke="#22d3ee"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                <line
                  x1={dr.x}
                  y1={dr.y}
                  x2={ep.x}
                  y2={ep.y}
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeDasharray="8 7"
                  strokeLinecap="round"
                />

                <line
                  x1={ep.x}
                  y1={ep.y}
                  x2={fix.x}
                  y2={fix.y}
                  stroke="#4ade80"
                  strokeWidth="4"
                  strokeDasharray="7 7"
                  strokeLinecap="round"
                />

                <circle cx={dr.x} cy={dr.y} r="11" fill="#f59e0b" />
                <text x={dr.x + 14} y={dr.y - 10} fill="#f59e0b" fontSize="16" fontWeight="900">
                  DR
                </text>

                <circle cx={ep.x} cy={ep.y} r="11" fill="#a855f7" />
                <text x={ep.x + 14} y={ep.y - 10} fill="#c084fc" fontSize="16" fontWeight="900">
                  EP
                </text>

                <circle cx={fix.x} cy={fix.y} r="15" fill="none" stroke="#4ade80" strokeWidth="5" />
                <circle cx={fix.x} cy={fix.y} r="5" fill="#4ade80" />
                <text x={fix.x + 18} y={fix.y - 12} fill="#4ade80" fontSize="16" fontWeight="900">
                  FIX
                </text>

                <circle cx="510" cy="95" r="42" fill="none" stroke="rgba(34,211,238,0.25)" />
                <text x="490" y="100" fill="#22d3ee" fontSize="16" fontWeight="900">
                  N
                </text>
              </svg>
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
              Çevresel etkiler hesaba katılmadan hesaplanan teorik mevkidir.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-300/25 bg-amber-300/10 p-5">
            <Waves className="mb-3 h-6 w-6 text-amber-300" />
            <h3 className="font-black text-amber-100">EP</h3>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              DR üzerine akıntı, rüzgar ve leeway etkileri eklenmiş tahmini mevkidir.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-5">
            <Crosshair className="mb-3 h-6 w-6 text-emerald-300" />
            <h3 className="font-black text-emerald-100">FIX</h3>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Kerteriz, radar mesafesi, derinlik veya görsel gözlemle doğrulanmış mevkidir.
            </p>
          </div>

          <div className="rounded-2xl border border-red-300/25 bg-red-950/20 p-5">
            <ShieldAlert className="mb-3 h-6 w-6 text-red-300" />
            <h3 className="font-black text-red-100">Emniyet</h3>
            <p className="mt-2 text-sm leading-7 text-red-100">
              DR ve EP kesin mevki değildir. Kıyı seyri ve sığ sularda FIX ile doğrulanmalıdır.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}