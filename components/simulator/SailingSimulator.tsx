"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Vec2 = { x: number; y: number };

type SliderProps = {
  label: string;
  value: number;
  setValue: (value: number) => void;
  max: number;
};

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
  const [autoPilot, setAutoPilot] = useState(false);
  const [showLearning, setShowLearning] = useState(true);

  const [currentHeading, setCurrentHeading] = useState(30);
  const [boatSpeed, setBoatSpeed] = useState(0);
  const [movementAngle, setMovementAngle] = useState(30);
  const [driftAngle, setDriftAngle] = useState(0);
  const [wavePhase, setWavePhase] = useState(0);

  const headingVelocityRef = useRef(0);
  const velocityRef = useRef<Vec2>({ x: 0, y: 0 });

  const liveDataRef = useRef({
    driveForce: 0,
    sideForce: 0,
    idealTrim: 16,
    recommendedHeading: 30,
  });

  useEffect(() => {
    let frame: number;
    let last = performance.now();

    const update = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.035);
      last = now;

      setWavePhase((p) => p + dt);

      if (autoPilot) {
        const recommended = liveDataRef.current.recommendedHeading;

        setTargetHeading((old) =>
          normalizeAngle(old + shortestAngleDiff(recommended, old) * 0.035)
        );

        setSail((old) =>
          Math.round(old + (liveDataRef.current.idealTrim - old) * 0.045)
        );
      }

      setCurrentHeading((current) => {
        const diff = shortestAngleDiff(targetHeading, current);
        const spring = diff * 0.85;
        const damping = 0.97;
        const turnMass = 1.8;

        headingVelocityRef.current =
          (headingVelocityRef.current + (spring / turnMass) * dt) * damping;

        if (
          Math.abs(diff) < 0.05 &&
          Math.abs(headingVelocityRef.current) < 0.02
        ) {
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
  }, [targetHeading, currentHeading, autoPilot]);

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
          Math.sin(
            (Math.min(apparentRelative, 180 - apparentRelative) * Math.PI) / 180
          ) *
            sailPressure *
            0.86,
          0,
          100
        );

    const recommendedHeading =
      apparentRelative < 35
        ? normalizeAngle(trueWind + 50)
        : apparentRelative > 140
          ? normalizeAngle(trueWind + 160)
          : normalizeAngle(trueWind + 55);

    liveDataRef.current = {
      driveForce,
      sideForce,
      idealTrim,
      recommendedHeading,
    };

    const heel = noGo ? 0 : clamp((sideForce / 100) * 24, 0, 24);
    const wakePower = clamp(boatSpeed / 8, 0.12, 1);
    const wavePower = clamp(boatSpeed / 8, 0.16, 1);
    const efficiency = clamp(Math.round(driveForce), 0, 100);
    const sailAlpha = clamp(0.35 + (sailPressure / 100) * 0.65, 0.35, 1);

    const message =
      noGo
        ? "No-Go Zone: rüzgâra fazla yakınsın."
        : sailPressure < 30
          ? "Trim kötü. Yelkeni apparent rüzgâra göre yeniden ayarla."
          : sailPressure > 60 && driftAngle <= 5
            ? "Verimli sürüş. Hız ve trim dengeli."
            : driftAngle > 5
              ? "Aşırı yan kayma. Tekneyi biraz daha kontrollü açıya al."
              : "Trim geliştirilebilir. Gücü koru, yelkeni ince ayarla.";

    const aiInstructor =
      noGo
        ? "Eğitmen: Rüzgâra çok yaklaştın. Başını 10–15 derece aç, hız yeniden gelsin."
        : driftAngle > 6
          ? "Eğitmen: Yan kuvvet arttı. Yelkeni biraz boşla ve tekneyi daha dengeli açıya getir."
          : sailPressure < 35
            ? "Eğitmen: Yelken basıncı düşük. Trim açısını ideal noktaya yaklaştır."
            : sailPressure > 70
              ? "Eğitmen: Güzel. Tekne güç aldı. Şimdi rotayı sabit tut ve hızı koru."
              : "Eğitmen: Dengeli seyirdesin. Küçük trim düzeltmeleriyle verimi artırabilirsin.";

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
      recommendedHeading,
      message,
      aiInstructor,
      point: pointOfSail(apparentRelative),
    };
  }, [trueWind, currentHeading, sail, boatSpeed, driftAngle]);

  const mainSailPath =
    data.sailPressure >= 75
      ? "M250 210 C372 222 370 335 262 365 Z"
      : data.sailPressure >= 45
        ? "M250 210 C345 230 350 322 262 358 Z"
        : "M250 210 C315 238 328 305 262 346 Z";

  const waveOffset =
    Math.sin(wavePhase * 0.8) * 2.5 +
    Math.sin(wavePhase * 2.5 + boatSpeed * 0.5) * 1.2 +
    Math.sin(wavePhase * 6 + boatSpeed) * 0.4;

  const pitchOffset = Math.sin(wavePhase * 1.9 + boatSpeed * 0.4) * 1.8;
  const rollOffset = Math.sin(wavePhase * 1.35) * 1.4;
  const realisticHeel = data.heel + rollOffset + driftAngle * 0.18;
  const bowLift = clamp(boatSpeed / 8, 0, 1) * -3 + pitchOffset;

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-8 text-white md:px-6 md:py-10">
      <style>{`
        @keyframes shimmerSea {
          0% { opacity: .22; transform: translateX(-60px); }
          50% { opacity: .55; transform: translateX(10px); }
          100% { opacity: .22; transform: translateX(70px); }
        }
        @keyframes windParticle {
          0% { opacity: .1; transform: translateX(-32px); }
          50% { opacity: .9; transform: translateX(8px); }
          100% { opacity: .16; transform: translateX(45px); }
        }
        @keyframes wakePulse {
          0% { opacity: .12; transform: scaleY(.82) scaleX(.9); }
          50% { opacity: .52; transform: scaleY(1.2) scaleX(1.08); }
          100% { opacity: .12; transform: scaleY(.82) scaleX(.9); }
        }
        @keyframes sailPulse {
          0% { opacity: .72; }
          50% { opacity: 1; }
          100% { opacity: .72; }
        }
        .wave-line { animation: shimmerSea 7s ease-in-out infinite alternate; }
        .wind-dot { animation: windParticle 3s ease-in-out infinite alternate; }
        .wake-pulse { animation: wakePulse 2.2s ease-in-out infinite; transform-origin: 250px 395px; }
        .sail-pulse { animation: sailPulse 2s ease-in-out infinite; }
      `}</style>

      <section className="mx-auto max-w-7xl">
        <p className="text-xs tracking-[0.35em] text-cyan-300">
          ALBATROS SAILING
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl md:text-6xl">
          YYE Sailing Simulator
        </h1>

        <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300 md:text-base">
          AI eğitmen, gerçekçi tekne hareketi, dalga hissi, inertia smoothing,
          autopilot training mode ve canlı learning overlay ile geliştirilmiş YYE eğitim simülatörü.
        </p>

        <div className="mt-4 text-xs tracking-[0.35em] text-cyan-300">
          LIVE TRAINING ENGINE ACTIVE
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-sky-950 via-slate-950 to-cyan-950 shadow-[0_0_70px_rgba(34,211,238,0.16)]">
          <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="relative min-h-[420px] overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,0.32),rgba(2,6,23,0.96)_58%)] p-5 md:p-8">
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cyan-950/70 to-transparent" />
              <div className="relative z-10">
                <p className="text-xs font-bold tracking-[0.35em] text-cyan-200">
                  SAIL TRIM TRAINING MODE
                </p>
                <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">
                  What Is Sail Trim?
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                  Yelken trimi; apparent rüzgâra göre yelken açısını ayarlayarak temiz akış,
                  daha fazla hız ve daha az yatma elde etmektir.
                </p>
              </div>

              <svg viewBox="0 0 760 420" className="relative z-10 mt-4 h-auto w-full">
                <defs>
                  <filter id="trimGlow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="trainingSea" x1="0" x2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.26" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.08" />
                  </linearGradient>
                </defs>

                <rect x="0" y="300" width="760" height="120" fill="url(#trainingSea)" />
                <path d="M0 318 C80 292 150 346 230 318 C320 284 410 348 500 318 C600 290 680 340 760 316" fill="none" stroke="#7dd3fc" strokeWidth="3" opacity="0.45" />
                <path d="M0 352 C90 330 150 378 230 352 C315 325 420 382 510 352 C610 328 690 370 760 350" fill="none" stroke="#bae6fd" strokeWidth="2" opacity="0.32" />

                <g transform="translate(390 225)">
                  <path d="M0 -160 C68 -70 78 72 0 150 C-78 72 -68 -70 0 -160 Z" fill="rgba(255,255,255,0.86)" stroke="#e0f2fe" strokeWidth="5" filter="url(#trimGlow)" />
                  <path d="M0 -132 C40 -60 48 58 0 118 C-48 58 -40 -60 0 -132 Z" fill="rgba(15,23,42,0.16)" />
                  <line x1="0" y1="-160" x2="0" y2="155" stroke="#0f172a" strokeWidth="4" opacity="0.45" />
                  <path d="M0 -72 C86 -50 96 42 8 100 Z" fill="rgba(34,211,238,0.68)" stroke="#67e8f9" strokeWidth="4" filter="url(#trimGlow)" />
                  <path d="M0 -72 C-68 -48 -72 42 -8 92 Z" fill="rgba(255,255,255,0.55)" stroke="#e2e8f0" strokeWidth="4" />
                </g>

                <g opacity="0.8">
                  <path d="M110 100 C205 62 282 114 350 86 C438 48 510 92 638 66" fill="none" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" />
                  <path d="M110 145 C220 112 288 162 370 132 C455 98 545 145 650 112" fill="none" stroke="#93c5fd" strokeWidth="5" strokeLinecap="round" />
                  <path d="M110 190 C215 158 300 208 386 178 C470 145 560 190 650 160" fill="none" stroke="#60a5fa" strokeWidth="5" strokeLinecap="round" />
                  <polygon points="98,100 138,78 132,124" fill="#facc15" />
                  <text x="54" y="82" fill="#fde68a" fontSize="18" fontWeight="900">APPARENT WIND</text>
                </g>

                <g transform="translate(42 250)">
                  <circle cx="52" cy="52" r="48" fill="rgba(14,165,233,0.18)" stroke="#7dd3fc" />
                  <path d="M52 18 L78 92 L52 78 L26 92 Z" fill="#e2e8f0" />
                  <text x="52" y="126" textAnchor="middle" fill="#e0f2fe" fontSize="15" fontWeight="800">Wind Angle</text>
                </g>

                <g transform="translate(605 86)">
                  <text x="0" y="0" fill="#bbf7d0" fontSize="20" fontWeight="900">✓ Increase Speed</text>
                  <text x="0" y="36" fill="#bbf7d0" fontSize="20" fontWeight="900">✓ Smooth Airflow</text>
                  <text x="0" y="72" fill="#bbf7d0" fontSize="20" fontWeight="900">✓ Reduce Heel</text>
                </g>

                <g transform="translate(70 352)">
                  <rect x="0" y="0" width="176" height="54" rx="16" fill="rgba(15,23,42,0.74)" stroke="rgba(255,255,255,0.12)" />
                  <text x="88" y="22" textAnchor="middle" fill="#fecaca" fontSize="16" fontWeight="900">TOO LOOSE</text>
                  <text x="88" y="42" textAnchor="middle" fill="#fca5a5" fontSize="12" fontWeight="700">Luffing</text>
                </g>

                <g transform="translate(292 352)">
                  <rect x="0" y="0" width="176" height="54" rx="16" fill="rgba(15,23,42,0.74)" stroke="rgba(255,255,255,0.12)" />
                  <text x="88" y="22" textAnchor="middle" fill="#fde68a" fontSize="16" fontWeight="900">TOO TIGHT</text>
                  <text x="88" y="42" textAnchor="middle" fill="#facc15" fontSize="12" fontWeight="700">Stalling</text>
                </g>

                <g transform="translate(514 352)">
                  <rect x="0" y="0" width="176" height="54" rx="16" fill="rgba(15,23,42,0.74)" stroke="rgba(34,197,94,0.36)" />
                  <text x="88" y="22" textAnchor="middle" fill="#bbf7d0" fontSize="16" fontWeight="900">JUST RIGHT</text>
                  <text x="88" y="42" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="700">Drawing Well</text>
                </g>
              </svg>
            </div>

            <div className="border-t border-white/10 bg-black/25 p-5 md:p-8 lg:border-l lg:border-t-0">
              <p className="text-xs font-bold tracking-[0.3em] text-cyan-300">
                LIVE STATUS
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <p className="text-xs text-slate-400">Trim Durumu</p>
                  <p className="mt-1 text-2xl font-black text-white">
                    {data.sailPressure < 30
                      ? "Too Loose / Zayıf Akış"
                      : data.sailPressure > 70
                        ? "Just Right / Temiz Akış"
                        : "Adjusting / İnce Ayar"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                    <p className="text-xs text-slate-400">Apparent</p>
                    <p className="mt-1 text-lg font-black text-cyan-100">
                      {data.apparentWind}° / {data.apparentWindSpeed} kn
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                    <p className="text-xs text-slate-400">Ideal Trim</p>
                    <p className="mt-1 text-lg font-black text-cyan-100">
                      {data.idealTrim.toFixed(0)}°
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
                  {data.aiInstructor}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl md:p-5">
            <h2 className="mb-5 text-xl font-bold">Kontroller</h2>

            <div className="grid gap-5 md:grid-cols-3">
              <Slider label="True Wind" value={trueWind} setValue={setTrueWind} max={360} />
              <Slider label="Hedef Tekne Yönü" value={targetHeading} setValue={setTargetHeading} max={360} />
              <Slider label="Yelken" value={sail} setValue={setSail} max={90} />
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <button
                type="button"
                onClick={() => setAutoPilot((v) => !v)}
                className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                  autoPilot
                    ? "border-cyan-300 bg-cyan-300 text-slate-950"
                    : "border-white/10 bg-white/10 text-white"
                }`}
              >
                {autoPilot ? "Autopilot Training: ON" : "Autopilot Training: OFF"}
              </button>

              <button
                type="button"
                onClick={() => setShowLearning((v) => !v)}
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white"
              >
                Learning Overlay {showLearning ? "Açık" : "Kapalı"}
              </button>

              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
                Autopilot açıkken sistem rüzgâra göre güvenli seyir açısı ve yelken trimini otomatik düzeltir.
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-slate-200">
              {data.aiInstructor}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-300/20 bg-[#06111f] p-3 shadow-[0_0_70px_rgba(34,211,238,0.18)] md:p-4">
            <div className="flex min-h-[420px] items-center justify-center rounded-[24px] border border-white/10 bg-[#020b16] p-2 md:min-h-[540px] lg:min-h-[620px]">
              <svg viewBox="0 0 500 500" className="h-auto w-full max-w-[500px]">
                <defs>
                  <radialGradient id="seaGlow" cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#155e75" stopOpacity="0.64" />
                    <stop offset="65%" stopColor="#020617" stopOpacity="0.96" />
                    <stop offset="100%" stopColor="#020617" stopOpacity="1" />
                  </radialGradient>

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

                  <linearGradient id="hull" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>
                </defs>

                <rect width="500" height="500" fill="url(#seaGlow)" />

                <g opacity={0.18 + data.wavePower * 0.55}>
                  <path className="wave-line" d="M-80 92 C70 35 145 150 280 95 C390 50 480 105 580 82" fill="none" stroke="#bae6fd" strokeWidth="1.5" />
                  <path className="wave-line" d="M-80 150 C70 100 160 210 285 158 C390 115 480 165 580 142" fill="none" stroke="#67e8f9" strokeWidth="2" />
                  <path className="wave-line" d="M-80 220 C90 165 170 285 295 228 C400 185 490 235 580 210" fill="none" stroke="#bae6fd" strokeWidth="1.5" />
                  <path className="wave-line" d="M-80 300 C90 250 170 365 300 310 C400 270 490 315 580 295" fill="none" stroke="#67e8f9" strokeWidth="2" />
                  <path className="wave-line" d="M-80 390 C80 345 190 455 312 402 C410 360 485 410 580 386" fill="none" stroke="#bae6fd" strokeWidth="1.5" />
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
                  <circle className="wind-dot" cx="145" cy="135" r="2.8" fill="#67e8f9" />
                  <circle className="wind-dot" cx="325" cy="155" r="2.5" fill="#67e8f9" />
                  <circle className="wind-dot" cx="205" cy="385" r="2" fill="#67e8f9" />
                  <circle className="wind-dot" cx="370" cy="345" r="2" fill="#67e8f9" />
                  <circle className="wind-dot" cx="130" cy="285" r="2.6" fill="#67e8f9" />
                  <circle className="wind-dot" cx="405" cy="245" r="2" fill="#67e8f9" />
                </g>

                <g transform={`rotate(${movementAngle} 250 250)`} opacity="0.8">
                  <line x1="250" y1="250" x2="250" y2="390" stroke="#facc15" strokeWidth="2" strokeDasharray="6 8" />
                  <text x="250" y="410" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="800">TRACK</text>
                </g>

                <g className="wake-pulse" opacity={data.wakePower} transform={`rotate(${movementAngle} 250 250)`}>
                  <path d="M250 386 C228 346 272 346 250 386 Z" fill="#22d3ee" opacity="0.3" filter="url(#softBlur)" />
                  <path d="M250 425 C215 355 285 355 250 425 Z" fill="#67e8f9" opacity="0.18" filter="url(#softBlur)" />
                  <path d="M250 462 C195 360 305 360 250 462 Z" fill="#a5f3fc" opacity="0.11" filter="url(#softBlur)" />
                </g>

                <g
                  transform={`
                    translate(0 ${waveOffset + bowLift})
                    rotate(${currentHeading} 250 250)
                    rotate(${realisticHeel} 250 320)
                  `}
                >
                  <path d="M250 108 C298 166 306 327 250 398 C194 327 202 166 250 108 Z" fill="url(#hull)" stroke="#f8fafc" strokeWidth="4" filter="url(#glow)" />
                  <path d="M250 135 C280 185 286 305 250 365 C214 305 220 185 250 135 Z" fill="#0f172a" opacity="0.18" />
                  <line x1="250" y1="148" x2="250" y2="358" stroke="#0f172a" strokeWidth="3" opacity="0.55" />
                  <ellipse cx="250" cy="215" rx="22" ry="42" fill="#0f172a" opacity="0.22" />

                  <g transform={`rotate(${sail} 250 210)`}>
                    <path className="sail-pulse" d={mainSailPath} fill={`rgba(34,211,238,${data.sailAlpha})`} stroke="#a5f3fc" strokeWidth="3" filter="url(#glow)" />
                  </g>

                  <g transform={`rotate(${-sail / 2} 250 210)`}>
                    <path d="M250 210 C178 235 170 310 240 350 Z" fill="rgba(255,255,255,.58)" stroke="rgba(255,255,255,.88)" strokeWidth="3" />
                  </g>
                </g>

                {showLearning && (
                  <foreignObject x="18" y="18" width="230" height="168">
                    <div className="rounded-2xl border border-cyan-300/20 bg-black/45 px-4 py-3 text-white backdrop-blur">
                      <div className="text-xs uppercase tracking-[0.25em] text-cyan-200">
                        AI Instructor
                      </div>
                      <div className="mt-2 text-sm font-black">{data.point}</div>
                      <div className="mt-1 text-xs text-slate-300">
                        Apparent: {data.apparentWind}° / {data.apparentWindSpeed} kn
                      </div>
                      <div className="text-xs text-slate-300">
                        İdeal trim: {data.idealTrim.toFixed(0)}°
                      </div>
                      <p className="mt-2 text-xs font-bold text-cyan-100">
                        {data.message}
                      </p>
                      <p className="mt-2 text-[11px] leading-4 text-cyan-200 opacity-90">
                        {data.aiInstructor}
                      </p>
                    </div>
                  </foreignObject>
                )}

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

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
              {autoPilot
                ? "Autopilot: güvenli seyir açısı ve ideal trim hedefleniyor."
                : data.message}
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