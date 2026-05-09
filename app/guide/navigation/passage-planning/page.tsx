"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Compass,
  MapPinned,
  Navigation,
  RotateCcw,
  ShieldAlert,
  ShipWheel,
} from "lucide-react";

type Side = "E" | "W";

type Waypoint = {
  name: string;
  cts: string;
  distance: string;
  currentSet: string;
  currentSpeed: string;
};

function toNumber(value: string) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function clamp360(value: number) {
  return ((value % 360) + 360) % 360;
}

function formatDeg(value: number) {
  return `${String(Math.round(clamp360(value))).padStart(3, "0")}°`;
}

function formatHour(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "00:00";
  const h = Math.floor(value);
  const m = Math.round((value - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function vectorFromCourse(course: number, distance: number, scale = 12) {
  const rad = (course * Math.PI) / 180;
  return {
    x: Math.sin(rad) * distance * scale,
    y: -Math.cos(rad) * distance * scale,
  };
}

const defaultWaypoints: Waypoint[] = Array.from({ length: 9 }).map((_, i) => ({
  name: `WPT.${i + 1}`,
  cts: i === 0 ? "090" : "",
  distance: i === 0 ? "12" : "",
  currentSet: i === 0 ? "160" : "",
  currentSpeed: i === 0 ? "1.5" : "",
}));

export default function Page() {
  const [date, setDate] = useState("");
  const [boatName, setBoatName] = useState("");
  const [departurePort, setDeparturePort] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalPort, setArrivalPort] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [captain, setCaptain] = useState("");
  const [assistant, setAssistant] = useState("");
  const [crew1, setCrew1] = useState("");
  const [crew2, setCrew2] = useState("");
  const [notes, setNotes] = useState("");

  const [boatSpeed, setBoatSpeed] = useState("6");
  const [compassCourse, setCompassCourse] = useState("090");
  const [deviation, setDeviation] = useState("2");
  const [deviationSide, setDeviationSide] = useState<Side>("W");
  const [variation, setVariation] = useState("4");
  const [variationSide, setVariationSide] = useState<Side>("W");

  const [emergencyPort1, setEmergencyPort1] = useState("");
  const [emergencyPort2, setEmergencyPort2] = useState("");
  const [hw1, setHw1] = useState("");
  const [lw1, setLw1] = useState("");
  const [hw2, setHw2] = useState("");
  const [lw2, setLw2] = useState("");

  const [waypoints, setWaypoints] = useState<Waypoint[]>(defaultWaypoints);
  const [plotVersion, setPlotVersion] = useState(0);

  const result = useMemo(() => {
    const compass = clamp360(toNumber(compassCourse));
    const devValue = toNumber(deviation);
    const varValue = toNumber(variation);

    const magnetic =
      deviationSide === "W"
        ? clamp360(compass + devValue)
        : clamp360(compass - devValue);

    const trueCourse =
      variationSide === "W"
        ? clamp360(magnetic + varValue)
        : clamp360(magnetic - varValue);

    const activeWaypoints = waypoints.filter(
      (w) => toNumber(w.distance) > 0 && w.cts.trim() !== ""
    );

    const totalDistance = activeWaypoints.reduce(
      (sum, w) => sum + Math.max(0, toNumber(w.distance)),
      0
    );

    const speed = Math.max(0.1, toNumber(boatSpeed));

    const totalCurrentPenalty = activeWaypoints.reduce((sum, w) => {
      return sum + Math.max(0, toNumber(w.currentSpeed)) * 0.08;
    }, 0);

    const correctedSpeed = Math.max(0.5, speed - totalCurrentPenalty);
    const eta = totalDistance / correctedSpeed;

    const start = { x: 80, y: 340 };
    let cursor = { ...start };

    const plotPoints = activeWaypoints.map((w, index) => {
      const course = clamp360(toNumber(w.cts));
      const dist = Math.max(0, toNumber(w.distance));
      const v = vectorFromCourse(course, dist, 12);

      const dr = {
        x: cursor.x + v.x,
        y: cursor.y + v.y,
      };

      const drift = vectorFromCourse(
        clamp360(toNumber(w.currentSet)),
        Math.max(0, toNumber(w.currentSpeed)) * 0.7,
        12
      );

      const ep = {
        x: dr.x + drift.x,
        y: dr.y + drift.y,
      };

      const leg = {
        index,
        name: w.name,
        from: cursor,
        dr,
        ep,
        course,
        distance: dist,
        currentSet: clamp360(toNumber(w.currentSet)),
        currentSpeed: Math.max(0, toNumber(w.currentSpeed)),
      };

      cursor = ep;
      return leg;
    });

    return {
      magnetic,
      trueCourse,
      totalDistance,
      correctedSpeed,
      eta,
      plotPoints,
    };
  }, [
    compassCourse,
    deviation,
    deviationSide,
    variation,
    variationSide,
    waypoints,
    boatSpeed,
  ]);

  function updateWaypoint(index: number, key: keyof Waypoint, value: string) {
    setWaypoints((prev) =>
      prev.map((w, i) => (i === index ? { ...w, [key]: value } : w))
    );
  }

  function reset() {
    setDate("");
    setBoatName("");
    setDeparturePort("");
    setDepartureTime("");
    setArrivalPort("");
    setArrivalTime("");
    setCaptain("");
    setAssistant("");
    setCrew1("");
    setCrew2("");
    setNotes("");
    setBoatSpeed("6");
    setCompassCourse("090");
    setDeviation("2");
    setDeviationSide("W");
    setVariation("4");
    setVariationSide("W");
    setEmergencyPort1("");
    setEmergencyPort2("");
    setHw1("");
    setLw1("");
    setHw2("");
    setLw2("");
    setWaypoints(defaultWaypoints);
    setPlotVersion((p) => p + 1);
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="relative border-b border-cyan-300/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_36%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
          <Link
            href="/guide/navigation"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Navigation Academy
          </Link>

          <p className="mt-10 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            Offshore Route Planning
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight md:text-7xl">
            Passage Planning{" "}
            <span className="text-cyan-300">Worksheet Engine</span>
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Kağıttaki passage planning formunun dijital karşılığı: Compass,
            Deviation, Magnetic, Variation, True, WPT, CTS, mesafe, akıntı,
            ETA ve harita plot sistemi birlikte çalışır.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Result title="Total Distance" value={`${result.totalDistance.toFixed(2)} NM`} />
          <Result title="Corrected Speed" value={`${result.correctedSpeed.toFixed(2)} kt`} />
          <Result title="ETA" value={formatHour(result.eta)} />
          <Result title="True Course" value={formatDeg(result.trueCourse)} />
        </div>

        <div className="rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 p-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <Input label="Tarih" value={date} setValue={setDate} />
            <Input label="Tekne İsmi" value={boatName} setValue={setBoatName} />
            <Input label="Hareket Limanı" value={departurePort} setValue={setDeparturePort} />
            <Input label="Hareket Tarihi / Saat" value={departureTime} setValue={setDepartureTime} />
            <Input label="Varış Limanı" value={arrivalPort} setValue={setArrivalPort} />
            <Input label="Varış Tarihi / Saat" value={arrivalTime} setValue={setArrivalTime} />
            <Input label="Kaptan" value={captain} setValue={setCaptain} />
            <Input label="Yardımcı" value={assistant} setValue={setAssistant} />
            <Input label="Ekip 1" value={crew1} setValue={setCrew1} />
            <Input label="Ekip 2" value={crew2} setValue={setCrew2} />
          </div>

          <div className="mt-6">
            <label className="text-sm font-black uppercase tracking-wider text-cyan-300">
              Notlar
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 min-h-28 w-full rounded-2xl border border-cyan-300/20 bg-slate-900/80 p-4 text-white outline-none"
              placeholder="Hava, rota, trafik, liman, emniyet notları..."
            />
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Compass className="h-6 w-6 text-cyan-300" />
                <h2 className="text-2xl font-black">Compass → True</h2>
              </div>

              <button
                type="button"
                onClick={reset}
                className="rounded-xl border border-white/10 bg-white/5 p-2"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-cyan-300/20 bg-slate-900/80 p-4">
              <svg viewBox="0 0 920 260" className="h-56 w-full">
                <defs>
                  <marker id="arrowCyan" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                    <path d="M0,0 L10,5 L0,10 Z" fill="#67e8f9" />
                  </marker>
                  <marker id="arrowAmber" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                    <path d="M0,0 L10,5 L0,10 Z" fill="#fbbf24" />
                  </marker>
                </defs>

                <path d="M120 85 C230 15, 340 15, 450 85" fill="none" stroke="#67e8f9" strokeWidth="3" markerEnd="url(#arrowCyan)" />
                <path d="M450 165 C340 235, 230 235, 120 165" fill="none" stroke="#67e8f9" strokeWidth="3" markerEnd="url(#arrowCyan)" />

                <path d="M485 85 C595 15, 705 15, 815 85" fill="none" stroke="#fbbf24" strokeWidth="3" markerEnd="url(#arrowAmber)" />
                <path d="M815 165 C705 235, 595 235, 485 165" fill="none" stroke="#fbbf24" strokeWidth="3" markerEnd="url(#arrowAmber)" />

                <text x="60" y="135" fill="#e2e8f0" fontSize="24" fontWeight="900">Compass</text>
                <text x="245" y="135" fill="#67e8f9" fontSize="18" fontWeight="900">± Deviation</text>

                <rect x="420" y="108" width="120" height="42" rx="10" fill="#facc15" />
                <text x="438" y="135" fill="#020817" fontSize="18" fontWeight="900">Magnetic</text>

                <text x="620" y="135" fill="#fbbf24" fontSize="18" fontWeight="900">± Variation</text>
                <text x="805" y="135" fill="#e2e8f0" fontSize="24" fontWeight="900">True</text>

                <text x="190" y="50" fill="#94a3b8" fontSize="15" fontWeight="900">+ West  - East</text>
                <text x="565" y="50" fill="#94a3b8" fontSize="15" fontWeight="900">+ West  - East</text>
                <text x="190" y="215" fill="#94a3b8" fontSize="15" fontWeight="900">- West  + East</text>
                <text x="565" y="215" fill="#94a3b8" fontSize="15" fontWeight="900">- West  + East</text>
              </svg>
            </div>

            <div className="mt-6 grid gap-4">
              <Input label="Compass" value={compassCourse} setValue={setCompassCourse} suffix="°" />
              <SignedInput label="Deviation" value={deviation} setValue={setDeviation} side={deviationSide} setSide={setDeviationSide} />
              <Input label="Magnetic" value={formatDeg(result.magnetic)} readOnly />
              <SignedInput label="Variation" value={variation} setValue={setVariation} side={variationSide} setSide={setVariationSide} />
              <Input label="True" value={formatDeg(result.trueCourse)} readOnly />
              <Input label="Boat Speed" value={boatSpeed} setValue={setBoatSpeed} suffix="kt" />
            </div>

            <div className="mt-6 grid grid-cols-5 gap-2 text-center">
              <Mini title="Compass" value={formatDeg(toNumber(compassCourse))} />
              <Mini title="Deviation" value={`${deviation}° ${deviationSide}`} amber />
              <Mini title="Magnetic" value={formatDeg(result.magnetic)} green />
              <Mini title="Variation" value={`${variation}° ${variationSide}`} amber />
              <Mini title="True" value={formatDeg(result.trueCourse)} green />
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 p-6">
            <div className="mb-5 flex items-center gap-3">
              <MapPinned className="h-6 w-6 text-cyan-300" />
              <h2 className="text-2xl font-black">WPT Chart Plot</h2>
            </div>

            <div
              className="relative min-h-[560px] overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-900/70"
              style={{
                backgroundImage: "url('/images/navigation/gokova-chart.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-[#020817]/45" />

              <svg key={plotVersion} viewBox="0 0 720 460" preserveAspectRatio="xMidYMid slice" className="relative z-10 h-full w-full">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <circle cx="80" cy="340" r="13" fill="#22d3ee" className="animate-pulse" />
                <text x="98" y="328" fill="#67e8f9" fontSize="15" fontWeight="900">START</text>

                {result.plotPoints.map((leg) => (
                  <g key={leg.name}>
                    <line x1={leg.from.x} y1={leg.from.y} x2={leg.dr.x} y2={leg.dr.y} stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" filter="url(#glow)" />
                    <line x1={leg.dr.x} y1={leg.dr.y} x2={leg.ep.x} y2={leg.ep.y} stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 7" />

                    <circle cx={leg.dr.x} cy={leg.dr.y} r="10" fill="#f59e0b" />
                    <circle cx={leg.ep.x} cy={leg.ep.y} r="13" fill="#4ade80" className="animate-pulse" />

                    <text x={leg.ep.x + 14} y={leg.ep.y - 12} fill="#4ade80" fontSize="14" fontWeight="900">
                      {leg.name}
                    </text>

                    <text x={(leg.from.x + leg.dr.x) / 2 + 8} y={(leg.from.y + leg.dr.y) / 2 - 8} fill="#e2e8f0" fontSize="12" fontWeight="900">
                      CTS {formatDeg(leg.course)} / {leg.distance.toFixed(1)} NM
                    </text>
                  </g>
                ))}

                <circle cx="610" cy="80" r="45" fill="rgba(34,211,238,0.12)" stroke="rgba(34,211,238,0.45)" />
                <text x="600" y="88" fill="#67e8f9" fontSize="22" fontWeight="900">N</text>
              </svg>
            </div>

            <button
              type="button"
              onClick={() => setPlotVersion((p) => p + 1)}
              className="mt-5 w-full rounded-2xl border border-cyan-300/40 bg-cyan-300/15 px-5 py-4 text-lg font-black text-cyan-100"
            >
              Hesapla ve Haritada Plotla
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-cyan-300/25 bg-slate-950/80 p-6">
          <div className="mb-5 flex items-center gap-3">
            <Navigation className="h-6 w-6 text-cyan-300" />
            <h2 className="text-2xl font-black">Waypoint Passage Plan</h2>
          </div>

          <div className="grid gap-3">
            {waypoints.map((w, index) => (
              <div key={w.name} className="grid gap-3 rounded-2xl border border-cyan-300/15 bg-white/[0.03] p-4 lg:grid-cols-[90px_1fr_1fr_1fr_1fr]">
                <div className="flex items-center text-lg font-black text-cyan-300">{w.name}</div>
                <Input label="CTS" value={w.cts} setValue={(v) => updateWaypoint(index, "cts", v)} suffix="°" />
                <Input label="Mesafe" value={w.distance} setValue={(v) => updateWaypoint(index, "distance", v)} suffix="NM" />
                <Input label="Akıntı/Rüzgar Yön" value={w.currentSet} setValue={(v) => updateWaypoint(index, "currentSet", v)} suffix="°" />
                <Input label="Akıntı/Rüzgar Hız" value={w.currentSpeed} setValue={(v) => updateWaypoint(index, "currentSpeed", v)} suffix="kt" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-red-300/25 bg-red-950/20 p-6">
          <div className="mb-5 flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-red-300" />
            <h2 className="text-2xl font-black text-red-100">Acil Durum</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Input label="Acil Liman 1" value={emergencyPort1} setValue={setEmergencyPort1} />
            <Input label="Acil Liman 2" value={emergencyPort2} setValue={setEmergencyPort2} />
            <Input label="HW Time 1" value={hw1} setValue={setHw1} />
            <Input label="LW Time 1" value={lw1} setValue={setLw1} />
            <Input label="HW Time 2" value={hw2} setValue={setHw2} />
            <Input label="LW Time 2" value={lw2} setValue={setLw2} />
          </div>
        </div>
      </section>
    </main>
  );
}

function Input({
  label,
  value,
  setValue,
  suffix,
  readOnly,
}: {
  label: string;
  value: string;
  setValue?: (value: string) => void;
  suffix?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-black uppercase tracking-wider text-slate-400">{label}</div>
      <div className="flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-slate-900/80 px-3 py-2">
        <input
          value={value}
          readOnly={readOnly}
          onChange={(e) => setValue?.(e.target.value)}
          className="w-full bg-transparent text-lg font-black text-white outline-none"
        />
        {suffix ? <span className="text-sm font-black text-cyan-300">{suffix}</span> : null}
      </div>
    </label>
  );
}

function SignedInput({
  label,
  value,
  setValue,
  side,
  setSide,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  side: Side;
  setSide: (side: Side) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-black uppercase tracking-wider text-slate-400">{label}</div>
      <div className="grid grid-cols-[1fr_76px] gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="rounded-xl border border-cyan-300/20 bg-slate-900/80 px-3 py-2 text-lg font-black text-white outline-none"
        />
        <select
          value={side}
          onChange={(e) => setSide(e.target.value as Side)}
          className="rounded-xl border border-amber-300/25 bg-slate-900 px-2 py-2 text-lg font-black text-amber-200 outline-none"
        >
          <option value="W">W</option>
          <option value="E">E</option>
        </select>
      </div>
    </label>
  );
}

function Result({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-4">
      <div className="text-xs font-black uppercase tracking-wider text-cyan-200">{title}</div>
      <div className="mt-2 text-2xl font-black text-white">{value}</div>
    </div>
  );
}

function Mini({
  title,
  value,
  amber,
  green,
}: {
  title: string;
  value: string;
  amber?: boolean;
  green?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        green
          ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
          : amber
            ? "border-amber-300/30 bg-amber-300/10 text-amber-200"
            : "border-cyan-300/30 bg-cyan-300/10 text-cyan-200"
      }`}
    >
      <div className="text-[10px] uppercase tracking-wider opacity-75">{title}</div>
      <div className="mt-1 font-black">{value}</div>
    </div>
  );
}