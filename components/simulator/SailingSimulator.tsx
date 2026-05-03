"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SliderProps = {
  label: string;
  value: number;
  setValue: (value: number) => void;
  max: number;
};

type Vec2 = { x: number; y: number };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

function shortestAngleDiff(target: number, current: number) {
  let diff = normalizeAngle(target) - normalizeAngle(current);
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}

function angleDiff(a: number, b: number) {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function vectorFromAngle(angle: number, magnitude: number): Vec2 {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: Math.cos(rad) * magnitude,
    y: Math.sin(rad) * magnitude,
  };
}

function angleFromVector(x: number, y: number) {
  const rad = Math.atan2(y, x);
  return normalizeAngle((rad * 180) / Math.PI + 90);
}

function vectorLength(v: Vec2) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

function pointOfSail(relative: number) {
  if (relative < 35) return "No-Go Zone";
  if (relative < 55) return "Orsa";
  if (relative < 80) return "Dar Apaz";
  if (relative < 120) return "Apaz";
  if (relative < 155) return "Geniş Apaz";
  return "Pupa";
}

export default function SailingSimulator() {
  const [trueWind, setTrueWind] = useState(135);
  const [targetHeading, setTargetHeading] = useState(30);
  const [sail, setSail] = useState(16);

  const [currentHeading, setCurrentHeading] = useState(30);
  const [boatSpeed, setBoatSpeed] = useState(0);
  const [movementAngle, setMovementAngle] = useState(30);
  const [driftAngle, setDriftAngle] = useState(0);

  const headingVelocityRef = useRef(0);
  const velocityRef = useRef<Vec2>({ x: 0, y: 0 });

  const liveDataRef = useRef({
    driveForce: 0,
    sideForce: 0,
  });

  useEffect(() => {
    let frame: number;
    let last = performance.now();

    const update = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.035);
      last = now;

      setCurrentHeading((current) => {
        const diff = shortestAngleDiff(targetHeading, current);
        const acceleration = diff * 0.9;

        headingVelocityRef.current =
          (headingVelocityRef.current + acceleration * dt) * 0.94;

        if (Math.abs(diff) < 0.05 && Math.abs(headingVelocityRef.current) < 0.02) {
          headingVelocityRef.current = 0;
          return normalizeAngle(targetHeading);
        }

        return normalizeAngle(current + headingVelocityRef.current);
      });

      const headingVec = vectorFromAngle(currentHeading, 1);
      const sideVec = vectorFromAngle(currentHeading + 90, 1);

      const drive = liveDataRef.current.driveForce / 100;
      const side = liveDataRef.current.sideForce / 100;

      const mass = 0.85;
      const waterDrag = 0.22;
      const sideResistance = 0.82;

      const v = velocityRef.current;
      const speedNow = vectorLength(v);

      const driveAccel = drive * 8.5;
      const sideAccel = side * 0.72;

      v.x += ((headingVec.x * driveAccel + sideVec.x * sideAccel) / mass) * dt;
      v.y += ((headingVec.y * driveAccel + sideVec.y * sideAccel) / mass) * dt;

      const drag = speedNow * speedNow * waterDrag * dt;
      const dragFactor = clamp(1 - drag, 0.82, 1);

      v.x *= dragFactor;
      v.y *= dragFactor;

      v.x *= 1 - sideResistance * 0.03 * dt;
      v.y *= 1 - sideResistance * 0.03 * dt;

      const newSpeed = vectorLength(v);
      const moveAngle = newSpeed > 0.02 ? angleFromVector(v.x, v.y) : currentHeading;
      const drift = Math.abs(shortestAngleDiff(moveAngle, currentHeading));

      setBoatSpeed(Number((newSpeed * 4.8).toFixed(1)));
      setMovementAngle(Math.round(moveAngle));
      setDriftAngle(Number(drift.toFixed(1)));

      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [targetHeading, currentHeading]);

  const data = useMemo(() => {
    const trueWindSpeed = 16;

    const boatVector = vectorFromAngle(currentHeading, boatSpeed);
    const trueWindVector = vectorFromAngle(trueWind, trueWindSpeed);

    const apparentVector = {
      x: trueWindVector.x - boatVector.x,
      y: trueWindVector.y - boatVector.y,
    };

    const apparentWind = angleFromVector(apparentVector.x, apparentVector.y);
    const apparentWindSpeed = vectorLength(apparentVector);

    const apparentRelative = angleDiff(apparentWind, currentHeading);
    const noGo = apparentRelative < 35;

    const idealTrim = clamp(apparentRelative / 2.5, 5, 82);
    const trimError = Math.abs(sail - idealTrim);

    const trimQuality = noGo ? 0 : clamp(1 - trimError / 45, 0, 1);
    const anglePower = noGo
      ? 0
      : clamp(Math.sin((apparentRelative * Math.PI) / 180), 0, 1);

    const pressureBase = clamp(apparentWindSpeed / 18, 0.25, 1.45);

    const sailPressure = noGo
      ? 0
      : clamp(trimQuality * anglePower * pressureBase * 100, 0, 100);

    const driveForce = noGo
      ? 0
      : clamp(Math.sin((apparentRelative * Math.PI) / 180) * sailPressure, 0, 100);

    const sideForce = noGo
      ? 0
      : clamp(
          Math.sin((Math.min(apparentRelative, 180 - apparentRelative) * Math.PI) / 180) *
            sailPressure *
            0.86,
          0,
          100
        );

    liveDataRef.current = { driveForce, sideForce };

    const heel = noGo ? 0 : clamp((sideForce / 100) * 22, 0, 22);
    const wakePower = clamp(boatSpeed / 8, 0.12, 1);
    const wavePower = clamp(boatSpeed / 8, 0.16, 1);
    const efficiency = clamp(Math.round(driveForce), 0, 100);
    const sailAlpha = clamp(0.35 + (sailPressure / 100) * 0.65, 0.35, 1);

    return {
      apparentWind: Math.round(apparentWind),
      apparentWindSpeed: apparentWindSpeed.toFixed(1),
      apparentRelative: Math.round(apparentRelative),
      idealTrim,
      sailPressure,
      driveForce,
      sideForce,
      efficiency,
      heel,
      wakePower,
      wavePower,
      sailAlpha,
      noGo,
      point: pointOfSail(apparentRelative),
    };
  }, [trueWind, currentHeading, sail, boatSpeed]);

  const mainSailPath =
    data.sailPressure >= 75
      ? "M250 210 C372 222 370 335 262 365 Z"
      : data.sailPressure >= 45
        ? "M250 210 C345 230 350 322 262 358 Z"
        : "M250 210 C315 238 328 305 262 346 Z";

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-8 text-white md:px-6 md:py-10">
      <style>{`
        @keyframes seaCurrent {
          0% { transform: translateX(-55px) translateY(0px); opacity: .18; }
          50% { transform: translateX(15px) translateY(10px); opacity: .52; }
          100% { transform: translateX(70px) translateY(-4px); opacity: .22; }
        }
        @keyframes swellLong {
          0% { transform: translateX(-45px) translateY(-6px); opacity: .16; }
          50% { transform: translateX(10px) translateY(8px); opacity: .42; }
          100% { transform: translateX(55px) translateY(-3px); opacity: .18; }
        }
        @keyframes windFlow {
          0% { transform: translateX(-35px); opacity: .12; }
          50% { transform: translateX(5px); opacity: .85; }
          100% { transform: translateX(45px); opacity: .18; }
        }
        @keyframes hullInertia {
          0% { transform: translateY(-3px) rotate(-1.2deg); }
          25% { transform: translateY(2px) rotate(.8deg); }
          50% { transform: translateY(5px) rotate(1.5deg); }
          75% { transform: translateY(1px) rotate(-.5deg); }
          100% { transform: translateY(-3px) rotate(-1.2deg); }
        }
        @keyframes wakeBreath {
          0% { opacity: .10; transform: scaleY(.85) scaleX(.9); }
          50% { opacity: .48; transform: scaleY(1.18) scaleX(1.08); }
          100% { opacity: .10; transform: scaleY(.85) scaleX(.9); }
        }
        @keyframes sailPressurePulse {
          0% { opacity: .72; }
          50% { opacity: 1; }
          100% { opacity: .72; }
        }
        .sea-current { animation: seaCurrent 6s ease-in-out infinite alternate; }
        .swell-line { animation: swellLong 8s ease-in-out infinite alternate; }
        .wind-particle { animation: windFlow 3s ease-in-out infinite alternate; }
        .hull-inertia { animation: hullInertia 3.8s ease-in-out infinite; transform-origin: 250px 320px; }
        .wake-breath { animation: wakeBreath 2.2s ease-in-out infinite; transform-origin: 250px 395px; }
        .sail-pressure { animation: sailPressurePulse 2s ease-in-out infinite; }
      `}</style>

      <section className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.35em] text-cyan-300">
          ALBATROS SAILING
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl md:text-6xl">
          YYE Sailing Simulator
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
          PHYSICS engine: kuvvet → ivme → hız, su direnci, momentum, yan kayma ve
          apparent wind birlikte çalışır.
        </p>

        <div className="mt-8 grid gap-5 xl:grid-cols-[320px_minmax(520px,1fr)_320px]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl md:p-5">
            <h2 className="mb-5 text-xl font-bold">Kontroller</h2>

            <Slider label="True Wind" value={trueWind} setValue={setTrueWind} max={360} />
            <Slider label="Hedef Tekne Yönü" value={targetHeading} setValue={setTargetHeading} max={360} />
            <Slider label="Yelken" value={sail} setValue={setSail} max={90} />

            <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
              Tekne baktığı yere direkt gitmez; momentum ve su direnciyle kayarak
              hareket eder.
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-300/20 bg-[#06111f] p-3 shadow-[0_0_70px_rgba(34,211,238,0.18)] md:p-4">
            <div className="flex min-h-[360px] items-center justify-center rounded-[24px] border border-white/10 bg-[#020b16] p-2 sm:min-h-[460px] lg:min-h-[560px]">
              <svg viewBox="0 0 500 500" className="h-auto w-full max-w-[520px]">
                <defs>
                  <radialGradient id="seaGlow" cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#155e75" stopOpacity="0.58" />
                    <stop offset="68%" stopColor="#020617" stopOpacity="0.96" />
                    <stop offset="100%" stopColor="#020617" stopOpacity="1" />
                  </radialGradient>

                  <linearGradient id="hull" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>

                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <filter id="softBlur">
                    <feGaussianBlur stdDeviation="2" />
                  </filter>
                </defs>

                <rect width="500" height="500" fill="url(#seaGlow)" />

                <g opacity={0.2 + data.wavePower * 0.45}>
                  <path className="swell-line" d="M-70 95 C75 35 145 150 280 95 C390 50 480 105 570 82" fill="none" stroke="#bae6fd" strokeWidth="1.5" />
                  <path className="sea-current" d="M-70 155 C70 100 160 210 285 158 C390 115 480 165 570 142" fill="none" stroke="#67e8f9" strokeWidth="2" />
                  <path className="swell-line" d="M-70 225 C90 165 170 285 295 228 C400 185 490 235 570 210" fill="none" stroke="#bae6fd" strokeWidth="1.5" />
                  <path className="sea-current" d="M-70 305 C90 250 170 365 300 310 C400 270 490 315 570 295" fill="none" stroke="#67e8f9" strokeWidth="2" />
                  <path className="swell-line" d="M-70 395 C80 345 190 455 312 402 C410 360 485 410 570 386" fill="none" stroke="#bae6fd" strokeWidth="1.5" />
                </g>

                <circle cx="250" cy="250" r="212" fill="none" stroke="rgba(125,211,252,.24)" />
                <circle cx="250" cy="250" r="152" fill="none" stroke="rgba(125,211,252,.16)" />
                <circle cx="250" cy="250" r="92" fill="none" stroke="rgba(125,211,252,.10)" />

                <text x="250" y="35" textAnchor="middle" fill="#a5f3fc" fontSize="14" fontWeight="700">N</text>
                <text x="250" y="477" textAnchor="middle" fill="#a5f3fc" fontSize="14" fontWeight="700">S</text>
                <text x="472" y="255" textAnchor="middle" fill="#a5f3fc" fontSize="14" fontWeight="700">E</text>
                <text x="28" y="255" textAnchor="middle" fill="#a5f3fc" fontSize="14" fontWeight="700">W</text>

                <g transform={`rotate(${data.apparentWind} 250 250)`}>
                  <path d="M250 250 L170 65 A215 215 0 0 1 330 65 Z" fill="rgba(239,68,68,.23)" stroke="rgba(248,113,113,.5)" strokeWidth="2" />
                  <text x="250" y="92" textAnchor="middle" fill="#fecaca" fontSize="13" fontWeight="800">NO-GO</text>
                </g>

                <g transform={`rotate(${trueWind} 250 250)`} opacity="0.28">
                  <line x1="250" y1="250" x2="250" y2="78" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                  <polygon points="250,55 238,82 262,82" fill="#93c5fd" />
                </g>

                <g transform={`rotate(${data.apparentWind} 250 250)`} filter="url(#glow)">
                  <line x1="250" y1="250" x2="250" y2="66" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" />
                  <polygon points="250,42 234,76 266,76" fill="#22d3ee" />
                </g>

                <g transform={`rotate(${data.apparentWind} 250 250)`} opacity="0.95">
                  <circle className="wind-particle" cx="145" cy="135" r="2.8" fill="#67e8f9" />
                  <circle className="wind-particle" cx="325" cy="155" r="2.5" fill="#67e8f9" />
                  <circle className="wind-particle" cx="205" cy="385" r="2" fill="#67e8f9" />
                  <circle className="wind-particle" cx="370" cy="345" r="2" fill="#67e8f9" />
                  <circle className="wind-particle" cx="130" cy="285" r="2.6" fill="#67e8f9" />
                  <circle className="wind-particle" cx="405" cy="245" r="2" fill="#67e8f9" />
                </g>

                <g transform={`rotate(${movementAngle} 250 250)`} opacity="0.8">
                  <line x1="250" y1="250" x2="250" y2="390" stroke="#facc15" strokeWidth="2" strokeDasharray="6 8" />
                  <text x="250" y="410" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="800">TRACK</text>
                </g>

                <g className="wake-breath" opacity={data.wakePower} transform={`rotate(${movementAngle} 250 250)`}>
                  <path d="M250 386 C228 346 272 346 250 386 Z" fill="#22d3ee" opacity="0.3" filter="url(#softBlur)" />
                  <path d="M250 425 C215 355 285 355 250 425 Z" fill="#67e8f9" opacity="0.18" filter="url(#softBlur)" />
                  <path d="M250 462 C195 360 305 360 250 462 Z" fill="#a5f3fc" opacity="0.11" filter="url(#softBlur)" />
                </g>

                <g className="hull-inertia" transform={`rotate(${currentHeading} 250 250) rotate(${data.heel} 250 320)`}>
                  <path d="M250 108 C298 166 306 327 250 398 C194 327 202 166 250 108 Z" fill="url(#hull)" stroke="#f8fafc" strokeWidth="4" filter="url(#glow)" />
                  <path d="M250 135 C280 185 286 305 250 365 C214 305 220 185 250 135 Z" fill="#0f172a" opacity="0.18" />
                  <line x1="250" y1="148" x2="250" y2="358" stroke="#0f172a" strokeWidth="3" opacity="0.55" />
                  <ellipse cx="250" cy="215" rx="22" ry="42" fill="#0f172a" opacity="0.22" />

                  <g transform={`rotate(${sail} 250 210)`}>
                    <path className="sail-pressure" d={mainSailPath} fill={`rgba(34,211,238,${data.sailAlpha})`} stroke="#a5f3fc" strokeWidth="3" filter="url(#glow)" />
                  </g>

                  <g transform={`rotate(${-sail / 2} 250 210)`}>
                    <path d="M250 210 C178 235 170 310 240 350 Z" fill="rgba(255,255,255,.58)" stroke="rgba(255,255,255,.88)" strokeWidth="3" />
                  </g>
                </g>

                <foreignObject x="22" y="22" width="170" height="88">
                  <div className="rounded-2xl border border-cyan-300/20 bg-black/35 px-4 py-3 text-white backdrop-blur">
                    <div className="text-xs text-slate-400">Apparent Wind</div>
                    <div className="text-xl font-black text-cyan-200">{data.apparentWind}°</div>
                    <div className="text-xs text-slate-400">{data.apparentWindSpeed} kn</div>
                  </div>
                </foreignObject>

                <foreignObject x="330" y="400" width="150" height="84">
                  <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white backdrop-blur">
                    <div className="text-xs text-slate-400">Physics Speed</div>
                    <div className="text-lg font-black">{boatSpeed.toFixed(1)} kn</div>
                    <div className="text-xs text-slate-400">Drift {driftAngle.toFixed(1)}°</div>
                  </div>
                </foreignObject>
              </svg>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl md:p-5">
            <h2 className="mb-5 text-xl font-bold">YYE Performans</h2>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Metric label="Seyir tipi" value={data.point} />
              <Metric label="Apparent bağıl rüzgâr" value={`${data.apparentRelative}°`} />
              <Metric label="Apparent wind" value={`${data.apparentWind}° / ${data.apparentWindSpeed} kn`} />
              <Metric label="İdeal trim" value={`${data.idealTrim.toFixed(0)}°`} />
              <Metric label="Sail pressure" value={`${data.sailPressure.toFixed(0)}%`} />
              <Metric label="Drive force" value={`${data.driveForce.toFixed(0)}%`} />
              <Metric label="Side force" value={`${data.sideForce.toFixed(0)}%`} />
              <Metric label="Physics speed" value={`${boatSpeed.toFixed(1)} knot`} />
              <Metric label="Movement track" value={`${movementAngle}°`} />
              <Metric label="Drift angle" value={`${driftAngle.toFixed(1)}°`} />
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm font-bold text-cyan-50">
              {data.noGo
                ? "No-Go Zone: apparent rüzgâra fazla yakınsın."
                : data.efficiency >= 80
                  ? "İyi trim. Kuvvetten hıza geçiş dengeli."
                  : "Trim geliştirilebilir. Su direnci ve yan kuvvet hızı düşürüyor."}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Slider({ label, value, setValue, max }: SliderProps) {
  const updateValue = (rawValue: string) => setValue(Number(rawValue));

  return (
    <div className="relative z-20 mb-5 last:mb-0">
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-bold text-cyan-200">{value}°</span>
      </div>

      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={value}
        onInput={(e) => updateValue(e.currentTarget.value)}
        onChange={(e) => updateValue(e.currentTarget.value)}
        className="relative z-30 w-full cursor-pointer accent-cyan-300"
      />

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => setValue(Math.max(0, value - 5))}
          className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-xs"
        >
          -5
        </button>

        <button
          type="button"
          onClick={() => setValue(Math.min(max, value + 5))}
          className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-xs"
        >
          +5
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}