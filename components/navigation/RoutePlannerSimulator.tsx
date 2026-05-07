"use client";

import { useMemo, useState } from "react";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export default function RoutePlannerSimulator() {
  const [distance, setDistance] = useState(24);
  const [speed, setSpeed] = useState(6);
  const [course, setCourse] = useState(90);
  const [currentSpeed, setCurrentSpeed] = useState(1.2);
  const [departureHour, setDepartureHour] = useState(10);

  const travelTime = useMemo(() => {
    if (speed <= 0) return 0;
    return distance / speed;
  }, [distance, speed]);

  const etaHour = useMemo(() => {
    return (departureHour + travelTime) % 24;
  }, [departureHour, travelTime]);

  const currentDrift = useMemo(() => {
    return currentSpeed * travelTime;
  }, [currentSpeed, travelTime]);

  const correctedCourse = useMemo(() => {
    return course + currentSpeed * 2;
  }, [course, currentSpeed]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <div className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/30 md:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Route Planner Simulator
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Seyir Planlama Simülatörü
          </h2>

          <p className="mt-4 max-w-4xl leading-8 text-slate-300">
            Mesafe, hız, rota ve akıntı etkisini kullanarak ETA, DR ve
            düzeltilmiş rota mantığını öğren.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <label className="block">
              <div className="mb-2 flex justify-between text-sm text-slate-300">
                <span>Mesafe</span>
                <strong className="text-cyan-200">
                  {distance} NM
                </strong>
              </div>

              <input
                type="range"
                min="1"
                max="120"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full accent-cyan-300"
              />
            </label>

            <label className="block">
              <div className="mb-2 flex justify-between text-sm text-slate-300">
                <span>Tekne Hızı</span>
                <strong className="text-cyan-200">
                  {speed} knot
                </strong>
              </div>

              <input
                type="range"
                min="1"
                max="15"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-cyan-300"
              />
            </label>

            <label className="block">
              <div className="mb-2 flex justify-between text-sm text-slate-300">
                <span>Planlanan Rota</span>
                <strong className="text-cyan-200">
                  {course}°
                </strong>
              </div>

              <input
                type="range"
                min="0"
                max="359"
                value={course}
                onChange={(e) => setCourse(Number(e.target.value))}
                className="w-full accent-cyan-300"
              />
            </label>

            <label className="block">
              <div className="mb-2 flex justify-between text-sm text-slate-300">
                <span>Akıntı Hızı</span>
                <strong className="text-cyan-200">
                  {currentSpeed.toFixed(1)} knot
                </strong>
              </div>

              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={currentSpeed}
                onChange={(e) => setCurrentSpeed(Number(e.target.value))}
                className="w-full accent-cyan-300"
              />
            </label>

            <label className="block">
              <div className="mb-2 flex justify-between text-sm text-slate-300">
                <span>Kalkış Saati</span>
                <strong className="text-cyan-200">
                  {pad(departureHour)}:00
                </strong>
              </div>

              <input
                type="range"
                min="0"
                max="23"
                value={departureHour}
                onChange={(e) => setDepartureHour(Number(e.target.value))}
                className="w-full accent-cyan-300"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
                Seyir Süresi
              </p>

              <div className="mt-4 text-5xl font-black text-cyan-100">
                {travelTime.toFixed(1)}
              </div>

              <p className="mt-2 text-slate-300">
                Saat
              </p>
            </div>

            <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
                ETA
              </p>

              <div className="mt-4 text-5xl font-black text-cyan-100">
                {pad(Math.floor(etaHour))}:
                {pad(Math.floor((etaHour % 1) * 60))}
              </div>

              <p className="mt-2 text-slate-300">
                Tahmini Varış
              </p>
            </div>

            <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-amber-200">
                DR Drift
              </p>

              <div className="mt-4 text-5xl font-black text-amber-100">
                {currentDrift.toFixed(1)}
              </div>

              <p className="mt-2 text-amber-100">
                NM sürüklenme
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">
                Düzeltilmiş Rota
              </p>

              <div className="mt-4 text-5xl font-black text-emerald-100">
                {correctedCourse.toFixed(0)}°
              </div>

              <p className="mt-2 text-emerald-100">
                CTS yaklaşımı
              </p>
            </div>

            <div className="md:col-span-2 rounded-3xl border border-white/10 bg-slate-950/60 p-6">
              <h3 className="text-xl font-bold text-cyan-100">
                Navigator Yorumu
              </h3>

              <div className="mt-4 space-y-4 leading-7 text-slate-300">
                <p>
                  {distance} NM mesafe, {speed} knot hız ile yaklaşık{" "}
                  <strong className="text-cyan-200">
                    {travelTime.toFixed(1)} saat
                  </strong>{" "}
                  sürer.
                </p>

                <p>
                  {currentSpeed.toFixed(1)} knot akıntı etkisi yaklaşık{" "}
                  <strong className="text-amber-200">
                    {currentDrift.toFixed(1)} NM
                  </strong>{" "}
                  sürüklenme oluşturabilir.
                </p>

                <p>
                  Bu nedenle rota yalnızca çizilmez; akıntı, leeway ve gerçek
                  deniz şartlarına göre sürekli yönetilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}