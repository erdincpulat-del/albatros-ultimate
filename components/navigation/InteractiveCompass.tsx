"use client";

import { useMemo, useState } from "react";

function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

function bearingName(angle: number) {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];

  return directions[Math.round(normalizeAngle(angle) / 22.5) % 16];
}

export default function InteractiveCompass() {
  const [heading, setHeading] = useState(45);
  const [targetBearing, setTargetBearing] = useState(90);

  const relativeBearing = useMemo(() => {
    const diff = normalizeAngle(targetBearing - heading);
    return diff > 180 ? diff - 360 : diff;
  }, [heading, targetBearing]);

  const instruction = useMemo(() => {
    if (Math.abs(relativeBearing) <= 5) {
      return "Hedef pruvada. Rotayı koru.";
    }

    if (relativeBearing > 0) {
      return `Hedef sancakta ${Math.abs(relativeBearing)}°. Sancağa dön.`;
    }

    return `Hedef iskelede ${Math.abs(relativeBearing)}°. İskeleye dön.`;
  }, [relativeBearing]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <div className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/90 p-6 shadow-2xl shadow-cyan-950/30 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Interactive Training Tool
            </p>

            <h2 className="mt-3 text-3xl font-black">
              İnteraktif Pusula ve Kerteriz Eğitimi
            </h2>

            <p className="mt-4 leading-8 text-slate-300">
              Bu panel, teknenin pruvası ile hedef kerteriz arasındaki farkı
              gösterir. Öğrenci; hedefin iskelede mi, sancakta mı olduğunu ve
              hangi yöne dönmesi gerektiğini görsel olarak öğrenir.
            </p>

            <div className="mt-6 space-y-5">
              <label className="block">
                <div className="mb-2 flex justify-between text-sm text-slate-300">
                  <span>Tekne Pruvası</span>
                  <strong className="text-cyan-200">
                    {heading}° / {bearingName(heading)}
                  </strong>
                </div>

                <input
                  type="range"
                  min="0"
                  max="359"
                  value={heading}
                  onChange={(e) => setHeading(Number(e.target.value))}
                  className="w-full accent-cyan-300"
                />
              </label>

              <label className="block">
                <div className="mb-2 flex justify-between text-sm text-slate-300">
                  <span>Hedef Kerteriz</span>
                  <strong className="text-cyan-200">
                    {targetBearing}° / {bearingName(targetBearing)}
                  </strong>
                </div>

                <input
                  type="range"
                  min="0"
                  max="359"
                  value={targetBearing}
                  onChange={(e) => setTargetBearing(Number(e.target.value))}
                  className="w-full accent-cyan-300"
                />
              </label>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
                Navigator Yorumu
              </p>
              <p className="mt-2 text-xl font-bold text-cyan-50">
                {instruction}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-[420px] rounded-full border border-cyan-300/30 bg-[radial-gradient(circle,rgba(34,211,238,0.16),rgba(15,23,42,0.95)_62%)] shadow-2xl shadow-cyan-950/50">
              <div className="absolute inset-6 rounded-full border border-white/10" />
              <div className="absolute inset-14 rounded-full border border-cyan-300/10" />

              {["N", "E", "S", "W"].map((dir) => {
                const positions: Record<string, string> = {
                  N: "left-1/2 top-4 -translate-x-1/2",
                  E: "right-4 top-1/2 -translate-y-1/2",
                  S: "bottom-4 left-1/2 -translate-x-1/2",
                  W: "left-4 top-1/2 -translate-y-1/2",
                };

                return (
                  <div
                    key={dir}
                    className={`absolute ${positions[dir]} text-lg font-black text-cyan-200`}
                  >
                    {dir}
                  </div>
                );
              })}

              <div
                className="absolute left-1/2 top-1/2 h-[42%] w-1 origin-bottom rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/40"
                style={{
                  transform: `translate(-50%, -100%) rotate(${targetBearing}deg)`,
                }}
              />

              <div
                className="absolute left-1/2 top-1/2 h-[38%] w-3 origin-bottom rounded-full bg-white"
                style={{
                  transform: `translate(-50%, -100%) rotate(${heading}deg)`,
                }}
              />

              <div className="absolute left-1/2 top-1/2 h-16 w-10 -translate-x-1/2 -translate-y-1/2 rounded-t-full border border-white/20 bg-slate-950 shadow-xl">
                <div className="mx-auto mt-2 h-7 w-1 rounded-full bg-cyan-300" />
              </div>

              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded-full border border-cyan-300/20 bg-slate-950/80 px-4 py-2 text-sm text-cyan-100">
                Fark: {relativeBearing > 0 ? "+" : ""}
                {relativeBearing}°
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}