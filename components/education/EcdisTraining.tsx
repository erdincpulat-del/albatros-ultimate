"use client";

import { useMemo, useState } from "react";

import GlowPanel from "@/components/ui/GlowPanel";
import MetricCard from "@/components/ui/MetricCard";
import OwnShip from "@/components/radar/OwnShip";

type ScenarioId =
  | "route-planning"
  | "xte-warning"
  | "shallow-water"
  | "tss-crossing"
  | "waypoint-approach"
  | "danger-area";

type Alert = "NORMAL" | "CAUTION" | "DANGER";

type Scenario = {
  id: ScenarioId;
  title: string;
  tr: string;
  rule: string;
  alert: Alert;
  route: string;
  speed: string;
  xte: string;
  depth: string;
  eta: string;
  desc: string;
  action: string;
  shipX: number;
  shipY: number;
};

const SCENARIOS: Scenario[] = [
  {
    id: "route-planning",
    title: "Passage Planning",
    tr: "Rota Planlama",
    rule: "Appraisal · Planning · Execution · Monitoring",
    alert: "NORMAL",
    route: "WP1 → WP2 → WP3",
    speed: "7.2 kn",
    xte: "0.02 NM",
    depth: "42 m",
    eta: "01:45",
    desc: "Rota güvenli su içinde, derinlik emniyetli ve XTE sınır içinde.",
    action: "Rotayı izle, waypoint yaklaşımını takip et.",
    shipX: 48,
    shipY: 48,
  },
  {
    id: "xte-warning",
    title: "Cross Track Error",
    tr: "Rota Dışı Sapma",
    rule: "XTE Monitoring",
    alert: "CAUTION",
    route: "WP2 → WP3",
    speed: "7.8 kn",
    xte: "0.18 NM",
    depth: "36 m",
    eta: "00:58",
    desc: "Tekne planlanan rotadan sapıyor. XTE değeri uyarı seviyesinde.",
    action: "Rotaya kontrollü dönüş yap, trafik ve derinliği kontrol et.",
    shipX: 43,
    shipY: 55,
  },
  {
    id: "shallow-water",
    title: "Shallow Water Alarm",
    tr: "Sığ Su Alarmı",
    rule: "Safety Contour",
    alert: "DANGER",
    route: "WP3 → WP4",
    speed: "6.4 kn",
    xte: "0.06 NM",
    depth: "4.8 m",
    eta: "00:34",
    desc: "Derinlik emniyet konturunun altına yaklaşıyor.",
    action: "Hemen güvenli derinliğe rota düzeltmesi yap.",
    shipX: 26,
    shipY: 69,
  },
  {
    id: "tss-crossing",
    title: "TSS Crossing",
    tr: "Trafik Ayrım Düzeni",
    rule: "COLREG Rule 10",
    alert: "CAUTION",
    route: "TSS ENTRY → TSS EXIT",
    speed: "8.1 kn",
    xte: "0.04 NM",
    depth: "58 m",
    eta: "02:12",
    desc: "TSS hattı geçiliyor. Trafik akışı ve geçiş açısı kontrol edilmeli.",
    action: "Mümkün olduğunca dik açıyla geç, CPA limitini izle.",
    shipX: 50,
    shipY: 56,
  },
  {
    id: "waypoint-approach",
    title: "Waypoint Approach",
    tr: "Waypoint Yaklaşımı",
    rule: "Turn Radius Monitoring",
    alert: "NORMAL",
    route: "WP5 → WP6",
    speed: "7.0 kn",
    xte: "0.01 NM",
    depth: "31 m",
    eta: "00:08",
    desc: "Waypoint dönüş noktasına yaklaşılıyor.",
    action: "Dönüş yarıçapını kontrol et, yeni course leg’e hazırlan.",
    shipX: 62,
    shipY: 39,
  },
  {
    id: "danger-area",
    title: "Danger Area",
    tr: "Tehlikeli Alan",
    rule: "Chart Object Alarm",
    alert: "DANGER",
    route: "WP6 → WP7",
    speed: "6.9 kn",
    xte: "0.09 NM",
    depth: "18 m",
    eta: "00:21",
    desc: "Rota yasak veya tehlikeli alana yaklaşıyor.",
    action: "Rota planını değiştir, güvenli suya çık.",
    shipX: 66,
    shipY: 34,
  },
];

export default function EcdisTraining() {
  const [selectedId, setSelectedId] = useState<ScenarioId>("route-planning");

  const active = useMemo(
    () => SCENARIOS.find((item) => item.id === selectedId) ?? SCENARIOS[0],
    [selectedId]
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] px-4 py-8 text-white">
      <style>{`
        @keyframes vesselMove {
          0%,100% { transform: translate(-50%, -50%) translateX(-7px); }
          50% { transform: translate(-50%, -50%) translateX(9px); }
        }

        @keyframes routePulse {
          0%,100% { opacity:.55; stroke-width:4; }
          50% { opacity:1; stroke-width:7; }
        }

        @keyframes alertBlink {
          0%,100% { opacity:.25; }
          50% { opacity:1; }
        }

        @keyframes chartGlow {
          0%,100% { opacity:.25; transform:scale(.96); }
          50% { opacity:1; transform:scale(1.04); }
        }

        .vessel-move { animation: vesselMove 4s ease-in-out infinite; }
        .route-pulse { animation: routePulse 2s ease-in-out infinite; }
        .alert-blink { animation: alertBlink 1s ease-in-out infinite; }
        .chart-glow { animation: chartGlow 2s ease-in-out infinite; }
      `}</style>

      <section className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[34px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl md:p-7">
          <p className="text-xs font-black tracking-[0.35em] text-cyan-300">
            ALBATROS SAILING
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            ECDIS Bridge Engine
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
            Elektronik seyir haritası, rota planlama, XTE, safety contour,
            waypoint yaklaşımı ve tehlikeli alan uyarılarını öğren. Sertifika
            bağlantısı yoktur.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <MetricCard label="ROUTE" value={active.route} />
            <MetricCard label="XTE" value={active.xte} />
            <MetricCard label="DEPTH" value={active.depth} />
            <MetricCard label="ETA" value={active.eta} />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <GlowPanel className="relative min-h-[720px] overflow-hidden p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.16),transparent_62%)]" />

            <div className="relative h-full min-h-[660px] overflow-hidden rounded-[30px] border border-cyan-300/15 bg-[#081827]">
              <ChartGrid />
              <DepthAreas />
              <TssLane />
              <DangerZones active={active.id} />
              <RouteLine active={active.id} />
              <EcdisOwnShip x={active.shipX} y={active.shipY} />

              <div className="absolute left-6 top-6 rounded-2xl border border-cyan-300/20 bg-black/55 px-4 py-3">
                <p className="text-[10px] font-black tracking-[0.25em] text-cyan-300">
                  ECDIS DISPLAY
                </p>
                <p className="mt-1 text-sm font-black text-white">
                  SCALE 1:25.000 · NORTH UP
                </p>
              </div>

              {active.alert !== "NORMAL" && (
                <div
                  className={`alert-blink absolute left-1/2 top-6 -translate-x-1/2 rounded-2xl border px-5 py-3 text-sm font-black ${
                    active.alert === "DANGER"
                      ? "border-red-300/50 bg-red-500/20 text-red-100"
                      : "border-yellow-200/50 bg-yellow-400/20 text-yellow-100"
                  }`}
                >
                  {active.alert} · {active.title}
                </div>
              )}

              <div className="absolute bottom-6 left-6 rounded-2xl border border-cyan-300/20 bg-black/55 px-4 py-3 text-xs font-black text-cyan-100">
                ROUTE: {active.route}
              </div>

              <div className="absolute bottom-6 right-6 grid gap-2">
                {["GPS OK", "ENC LOADED", "XTE MONITOR", "DEPTH ALARM"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-cyan-300/20 bg-black/65 px-3 py-2 text-[10px] font-black text-cyan-100"
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </GlowPanel>

          <GlowPanel className="p-5">
            <p className="text-xs font-black tracking-[0.3em] text-cyan-300">
              ACTIVE ECDIS SCENARIO
            </p>

            <div className="mt-4 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <h2 className="text-3xl font-black">{active.title}</h2>
              <p className="mt-1 text-sm font-bold text-cyan-100">
                {active.tr}
              </p>
            </div>

            <div
              className={`mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-black ${
                active.alert === "DANGER"
                  ? "border-red-300/40 bg-red-500/10 text-red-200"
                  : active.alert === "CAUTION"
                  ? "border-yellow-200/40 bg-yellow-400/10 text-yellow-100"
                  : "border-green-300/40 bg-green-400/10 text-green-100"
              }`}
            >
              ALERT: {active.alert}
            </div>

            <div className="mt-4 inline-flex rounded-full border border-yellow-200/20 bg-yellow-200/10 px-3 py-1 text-xs font-black text-yellow-100">
              {active.rule}
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-300">
              {active.desc}
            </p>

            <div className="mt-5 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <p className="text-xs font-black tracking-[0.25em] text-cyan-200">
                RECOMMENDED ACTION
              </p>

              <p className="mt-2 text-sm leading-7 text-slate-100">
                {active.action}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MetricCard label="SOG" value={active.speed} />
              <MetricCard label="XTE" value={active.xte} />
              <MetricCard label="DEPTH" value={active.depth} />
              <MetricCard label="ETA" value={active.eta} />
              <MetricCard label="ROUTE" value={active.route} />
              <MetricCard label="STATUS" value={active.alert} />
            </div>

            <div className="mt-6 grid gap-3">
              {SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setSelectedId(scenario.id)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    active.id === scenario.id
                      ? "border-cyan-300 bg-cyan-300/20 text-cyan-100"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-cyan-300/10"
                  }`}
                >
                  <p className="font-black">{scenario.title}</p>
                  <p className="mt-1 text-xs">
                    {scenario.tr} · {scenario.alert}
                  </p>
                </button>
              ))}
            </div>
          </GlowPanel>
        </div>
      </section>
    </main>
  );
}

function ChartGrid() {
  return (
    <>
      {[...Array(12)].map((_, i) => (
        <div
          key={`v-${i}`}
          className="absolute top-0 h-full w-px bg-cyan-300/8"
          style={{ left: `${8 + i * 8}%` }}
        />
      ))}

      {[...Array(12)].map((_, i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 h-px w-full bg-cyan-300/8"
          style={{ top: `${8 + i * 8}%` }}
        />
      ))}
    </>
  );
}

function DepthAreas() {
  return (
    <>
      <div className="absolute left-[5%] top-[10%] h-[80%] w-[32%] rounded-[40%] bg-cyan-300/10 blur-sm" />
      <div className="absolute right-[8%] top-[18%] h-[58%] w-[28%] rounded-[45%] bg-blue-500/10 blur-sm" />
      <div className="absolute bottom-[8%] left-[38%] h-[28%] w-[32%] rounded-[50%] bg-yellow-300/10 blur-sm" />
    </>
  );
}

function TssLane() {
  return (
    <div className="absolute left-[10%] top-[55%] h-[80px] w-[80%] -rotate-12 rounded-3xl border border-cyan-300/15 bg-cyan-300/5">
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 border-t border-dashed border-cyan-200/30" />
      <p className="absolute left-6 top-3 text-[10px] font-black tracking-[0.25em] text-cyan-100">
        TSS LANE
      </p>
    </div>
  );
}

function DangerZones({ active }: { active: ScenarioId }) {
  return (
    <>
      <div
        className={`absolute right-[18%] top-[22%] flex h-28 w-28 rotate-45 items-center justify-center border ${
          active === "danger-area"
            ? "chart-glow border-red-300 bg-red-500/30"
            : "border-red-300/20 bg-red-500/10"
        }`}
      >
        <span className="-rotate-45 text-xs font-black text-red-100">
          DANGER
        </span>
      </div>

      <div
        className={`absolute left-[16%] bottom-[18%] flex h-24 w-24 rotate-45 items-center justify-center border ${
          active === "shallow-water"
            ? "chart-glow border-yellow-200 bg-yellow-400/30"
            : "border-yellow-200/20 bg-yellow-400/10"
        }`}
      >
        <span className="-rotate-45 text-xs font-black text-yellow-100">
          5m
        </span>
      </div>
    </>
  );
}

function RouteLine({ active }: { active: ScenarioId }) {
  const warning =
    active === "xte-warning" ||
    active === "shallow-water" ||
    active === "danger-area" ||
    active === "tss-crossing";

  return (
    <svg className="absolute inset-0 h-full w-full">
      <polyline
        className={warning ? "route-pulse" : ""}
        points="90,520 230,420 370,350 520,260 700,210"
        fill="none"
        stroke={warning ? "#facc15" : "#22d3ee"}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <polyline
        points="90,520 230,420 370,350 520,260 700,210"
        fill="none"
        stroke="#67e8f9"
        strokeWidth="1"
        strokeDasharray="8 12"
        opacity="0.7"
      />

      {[90, 230, 370, 520, 700].map((x, i) => {
        const y = [520, 420, 350, 260, 210][i];

        return (
          <g key={i}>
            <circle cx={x} cy={y} r="8" fill="#22d3ee" />
            <text
              x={x + 12}
              y={y - 10}
              fill="#cffafe"
              fontSize="11"
              fontWeight="900"
            >
              WP{i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function EcdisOwnShip({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="vessel-move absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      <OwnShip className="scale-75" />
    </div>
  );
}