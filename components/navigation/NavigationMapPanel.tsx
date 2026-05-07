"use client";

import { useMemo, useState } from "react";

type Waypoint = {
  id: string;
  name: string;
  x: number;
  y: number;
};

const waypoints: Waypoint[] = [
  { id: "wp1", name: "WP-01", x: 18, y: 72 },
  { id: "wp2", name: "WP-02", x: 36, y: 52 },
  { id: "wp3", name: "WP-03", x: 58, y: 42 },
  { id: "wp4", name: "WP-04", x: 78, y: 26 },
];

export default function NavigationMapPanel() {
  const [activeWaypoint, setActiveWaypoint] = useState("wp2");
  const [showDr, setShowDr] = useState(true);
  const [showDanger, setShowDanger] = useState(true);

  const selectedWaypoint = useMemo(
    () => waypoints.find((item) => item.id === activeWaypoint) ?? waypoints[1],
    [activeWaypoint]
  );

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <div className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/30 md:p-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Visual Navigation Engine
            </p>
            <h2 className="mt-2 text-3xl font-black">
              Canlı Harita ve Rota Eğitim Paneli
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-300">
              Bu panel; waypoint, rota hattı, DR tahmini, tehlike alanı ve
              navigator karar mantığını görsel olarak öğretmek için tasarlandı.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowDr((value) => !value)}
              className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100"
            >
              DR {showDr ? "Açık" : "Kapalı"}
            </button>

            <button
              onClick={() => setShowDanger((value) => !value)}
              className="rounded-full border border-red-300/30 bg-red-300/10 px-4 py-2 text-sm font-bold text-red-100"
            >
              Risk {showDanger ? "Açık" : "Kapalı"}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-cyan-300/20 bg-slate-950">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.18),transparent_28%)]" />

            <div className="absolute left-[8%] top-[18%] h-[42%] w-[24%] rounded-[50%] border border-emerald-300/30 bg-emerald-300/10 blur-[0.2px]" />
            <div className="absolute bottom-[8%] right-[8%] h-[34%] w-[30%] rounded-[48%] border border-emerald-300/25 bg-emerald-300/10" />

            {showDanger && (
              <div className="absolute left-[50%] top-[54%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-300/50 bg-red-500/15 shadow-lg shadow-red-500/20">
                <div className="absolute inset-3 rounded-full border border-red-200/30" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-black text-red-100">
                  SHALLOW
                </span>
              </div>
            )}

            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
              <polyline
                points={waypoints.map((wp) => `${wp.x},${wp.y}`).join(" ")}
                fill="none"
                stroke="rgba(103,232,249,0.95)"
                strokeWidth="0.8"
                strokeDasharray="2 1.5"
              />

              {showDr && (
                <polyline
                  points="18,72 31,63 46,61 62,58 76,50"
                  fill="none"
                  stroke="rgba(251,191,36,0.95)"
                  strokeWidth="0.7"
                  strokeDasharray="1.5 1.5"
                />
              )}

              <circle cx={selectedWaypoint.x} cy={selectedWaypoint.y} r="3" fill="rgba(34,211,238,0.25)" />
              <circle cx={selectedWaypoint.x} cy={selectedWaypoint.y} r="1.2" fill="rgb(103,232,249)" />
            </svg>

            {waypoints.map((wp) => (
              <button
                key={wp.id}
                onClick={() => setActiveWaypoint(wp.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${wp.x}%`, top: `${wp.y}%` }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-200/60 bg-slate-950 text-[10px] font-black text-cyan-100 shadow-lg shadow-cyan-400/20">
                  {wp.name.replace("WP-", "")}
                </span>
              </button>
            ))}

            <div className="absolute bottom-4 left-4 rounded-2xl border border-cyan-300/20 bg-slate-950/80 px-4 py-3 text-sm text-cyan-100 backdrop-blur">
              Active: {selectedWaypoint.name}
            </div>

            <div className="absolute right-4 top-4 h-24 w-24 rounded-full border border-cyan-300/30 bg-slate-950/70">
              <div className="absolute left-1/2 top-2 h-10 w-1 -translate-x-1/2 rounded-full bg-cyan-300" />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-cyan-100">
                N
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-6">
            <h3 className="text-2xl font-black text-cyan-100">
              Navigator Yorumu
            </h3>

            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
              <p>
                Seçili waypoint:{" "}
                <span className="font-bold text-cyan-200">
                  {selectedWaypoint.name}
                </span>
              </p>

              <p>
                Mavi kesikli çizgi planlanan rota hattını gösterir. Sarı kesikli
                çizgi DR tahmini track olarak okunur.
              </p>

              <p>
                Eğer DR hattı planlanan rotadan uzaklaşırsa navigator; akıntı,
                rüzgâr, dümen hatası veya hız hesabını yeniden değerlendirir.
              </p>

              <p className="rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-red-100">
                Kırmızı alan, sığ su / tehlike bölgesidir. Profesyonel rota,
                bu alanın emniyet payıyla dışından geçirilmelidir.
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              {waypoints.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => setActiveWaypoint(wp.id)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                    activeWaypoint === wp.id
                      ? "border-cyan-300/50 bg-cyan-300/15 text-cyan-100"
                      : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-300/30"
                  }`}
                >
                  {wp.name} — rota noktası
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}