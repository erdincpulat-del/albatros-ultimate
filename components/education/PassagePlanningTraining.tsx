"use client";

import { useMemo, useState } from "react";

type PlanId =
  | "bodrum-knidos"
  | "knidos-datca"
  | "datca-simi"
  | "tss-crossing"
  | "heavy-weather"
  | "alternate-harbor";

type AlertLevel = "NORMAL" | "CAUTION" | "DANGER";

type PassagePlan = {
  id: PlanId;
  title: string;
  tr: string;
  from: string;
  to: string;
  route: string;
  distance: string;
  eta: string;
  speed: string;
  wind: string;
  current: string;
  depth: string;
  fuel: string;
  alternate: string;
  alert: AlertLevel;
  note: string;
  action: string;
};

const PLANS: PassagePlan[] = [
  {
    id: "bodrum-knidos",
    title: "Bodrum → Knidos",
    tr: "Kıyı Seyri Planı",
    from: "Bodrum",
    to: "Knidos",
    route: "WP1 → WP2 → WP3 → WP4",
    distance: "38 NM",
    eta: "05:25",
    speed: "7.0 kn",
    wind: "NW 14 kn",
    current: "0.4 kn W",
    depth: "35–80 m",
    fuel: "42 L",
    alternate: "Yalıkavak / Datça",
    alert: "NORMAL",
    note: "Rota güvenli su içinde, kıyı mesafesi ve derinlik emniyetli.",
    action: "Planı onayla, WP yaklaşım ve gece dönüş noktalarını izle.",
  },
  {
    id: "knidos-datca",
    title: "Knidos → Datça",
    tr: "Kısa Geçiş Planı",
    from: "Knidos",
    to: "Datça",
    route: "WP4 → WP5 → WP6",
    distance: "18 NM",
    eta: "02:30",
    speed: "7.2 kn",
    wind: "W 10 kn",
    current: "0.2 kn E",
    depth: "22–60 m",
    fuel: "19 L",
    alternate: "Palamutbükü",
    alert: "NORMAL",
    note: "Kısa rota; waypoint dönüşleri ve kıyı yaklaşması dikkatle izlenmeli.",
    action: "Arrival checklist hazırlansın, liman yaklaşması önceden brief edilsin.",
  },
  {
    id: "datca-simi",
    title: "Datça → Simi",
    tr: "Açık Su / Sınır Geçişi",
    from: "Datça",
    to: "Simi",
    route: "WP6 → WP7 → WP8",
    distance: "24 NM",
    eta: "03:35",
    speed: "6.8 kn",
    wind: "NW 18 kn",
    current: "0.6 kn SW",
    depth: "60–120 m",
    fuel: "31 L",
    alternate: "Datça / Bozburun",
    alert: "CAUTION",
    note: "Açık su geçişi; rüzgar açısı, dalga ve dönüş limanı planı kritik.",
    action: "Hava güncellemesini kontrol et, alternate harbor hazır tut.",
  },
  {
    id: "tss-crossing",
    title: "Traffic Separation Crossing",
    tr: "TSS Geçiş Planı",
    from: "Approach WP",
    to: "Exit WP",
    route: "WP9 → TSS ENTRY → TSS EXIT",
    distance: "12 NM",
    eta: "01:45",
    speed: "7.5 kn",
    wind: "N 12 kn",
    current: "0.3 kn S",
    depth: "70 m",
    fuel: "15 L",
    alternate: "Holding Area",
    alert: "CAUTION",
    note: "TSS geçişinde trafik akışı, AIS/ARPA takibi ve COLREG Rule 10 önemlidir.",
    action: "TSS mümkün olduğunca dik açıyla geçilsin, CPA limiti sıkı izlenmeli.",
  },
  {
    id: "heavy-weather",
    title: "Heavy Weather Route",
    tr: "Sert Hava Planı",
    from: "Offshore WP",
    to: "Shelter WP",
    route: "WP10 → SAFE LEG → SHELTER",
    distance: "31 NM",
    eta: "05:50",
    speed: "5.4 kn",
    wind: "NW 28 kn",
    current: "0.8 kn SE",
    depth: "45–95 m",
    fuel: "48 L",
    alternate: "Nearest Shelter",
    alert: "DANGER",
    note: "Rüzgar ve dalga koşulları rota güvenliğini etkiliyor.",
    action: "Rota kısaltılsın, sığınak liman planı aktif edilsin.",
  },
  {
    id: "alternate-harbor",
    title: "Alternate Harbor Decision",
    tr: "Alternatif Liman Kararı",
    from: "Current Position",
    to: "Alternate Harbor",
    route: "CURRENT → ALT WP → HARBOR",
    distance: "14 NM",
    eta: "02:10",
    speed: "6.5 kn",
    wind: "W 22 kn",
    current: "0.5 kn E",
    depth: "28–65 m",
    fuel: "24 L",
    alternate: "Primary route suspended",
    alert: "CAUTION",
    note: "Ana rota yerine alternatif limana yönelme kararı değerlendiriliyor.",
    action: "Mürettebat bilgilendirilsin, yeni ETA ve yaklaşma planı oluşturulsun.",
  },
];

export default function PassagePlanningTraining() {
  const [selected, setSelected] = useState<PlanId>("bodrum-knidos");

  const active = useMemo(
    () => PLANS.find((item) => item.id === selected) ?? PLANS[0],
    [selected]
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] px-4 py-8 text-white">
      <style>{`
        @keyframes routePulse {
          0%,100% { opacity:.55; stroke-width:4; }
          50% { opacity:1; stroke-width:7; }
        }

        @keyframes vesselMove {
          0%,100% { transform:translate(-50%,-50%) translateX(-8px); }
          50% { transform:translate(-50%,-50%) translateX(10px); }
        }

        @keyframes alertBlink {
          0%,100% { opacity:.25; }
          50% { opacity:1; }
        }

        @keyframes windDrift {
          0% { transform:translateX(-30px); opacity:.15; }
          50% { opacity:.45; }
          100% { transform:translateX(30px); opacity:.15; }
        }

        .route-pulse { animation: routePulse 2s ease-in-out infinite; }
        .vessel-move { animation: vesselMove 4s ease-in-out infinite; }
        .alert-blink { animation: alertBlink 1s ease-in-out infinite; }
        .wind-line { animation: windDrift 6s ease-in-out infinite alternate; }
      `}</style>

      <section className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[34px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl md:p-7">
          <p className="text-xs font-black tracking-[0.35em] text-cyan-300">
            ALBATROS SAILING
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            Passage Planning Room
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
            Rota planlama, waypoint zinciri, ETA, yakıt, hava, akıntı,
            alternatif liman ve risk kararlarını tek eğitim ekranında öğren.
            Sertifika bağlantısı yoktur.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="relative min-h-[740px] overflow-hidden rounded-[36px] border border-cyan-300/20 bg-[#06111f] shadow-[0_0_90px_rgba(34,211,238,.12)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.18),transparent_62%)]" />

            <div className="absolute inset-6 rounded-[30px] border border-cyan-300/15 bg-[#081827]">
              <ChartGrid />
              <SeaZones />
              <WindOverlay />
              <NoGoAreas active={active.id} />
              <RouteMap active={active.id} />
              <OwnShip active={active.id} />

              <div className="absolute left-6 top-6 rounded-2xl border border-cyan-300/20 bg-black/55 px-4 py-3">
                <p className="text-[10px] font-black tracking-[0.25em] text-cyan-300">
                  PASSAGE DISPLAY
                </p>
                <p className="mt-1 text-sm font-black text-white">
                  APPRAISAL · PLANNING · EXECUTION · MONITORING
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
                {["WX CHECK", "FUEL CHECK", "ALT HARBOR", "CREW BRIEF"].map(
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
          </section>

          <aside className="rounded-[36px] border border-white/10 bg-black/55 p-5 backdrop-blur-xl">
            <p className="text-xs font-black tracking-[0.3em] text-cyan-300">
              ACTIVE PASSAGE PLAN
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
              STATUS: {active.alert}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Metric label="FROM" value={active.from} />
              <Metric label="TO" value={active.to} />
              <Metric label="DIST" value={active.distance} />
              <Metric label="ETA" value={active.eta} />
              <Metric label="SPEED" value={active.speed} />
              <Metric label="FUEL" value={active.fuel} />
              <Metric label="WIND" value={active.wind} />
              <Metric label="CURRENT" value={active.current} />
              <Metric label="DEPTH" value={active.depth} />
              <Metric label="ALTERNATE" value={active.alternate} />
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-300">
              {active.note}
            </p>

            <div className="mt-5 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <p className="text-xs font-black tracking-[0.25em] text-cyan-200">
                RECOMMENDED ACTION
              </p>
              <p className="mt-2 text-lg font-black">{active.action}</p>
            </div>

            <div className="mt-6 grid gap-3">
              {PLANS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item.id)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    selected === item.id
                      ? "border-cyan-300 bg-cyan-300/20 text-cyan-100"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-cyan-300/10"
                  }`}
                >
                  <p className="font-black">{item.title}</p>
                  <p className="mt-1 text-xs">{item.tr}</p>
                </button>
              ))}
            </div>
          </aside>
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

function SeaZones() {
  return (
    <>
      <div className="absolute left-[5%] top-[10%] h-[80%] w-[32%] rounded-[40%] bg-cyan-300/10 blur-sm" />
      <div className="absolute right-[8%] top-[18%] h-[58%] w-[28%] rounded-[45%] bg-blue-500/10 blur-sm" />
      <div className="absolute bottom-[8%] left-[38%] h-[28%] w-[32%] rounded-[50%] bg-yellow-300/10 blur-sm" />
    </>
  );
}

function WindOverlay() {
  return (
    <div className="absolute inset-0 opacity-45">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="wind-line absolute h-px w-full bg-cyan-100/40"
          style={{ top: `${8 + i * 9}%` }}
        />
      ))}
    </div>
  );
}

function NoGoAreas({ active }: { active: PlanId }) {
  return (
    <>
      <div
        className={`absolute right-[18%] top-[22%] flex h-28 w-28 rotate-45 items-center justify-center border ${
          active === "heavy-weather"
            ? "alert-blink border-red-300 bg-red-500/30"
            : "border-red-300/20 bg-red-500/10"
        }`}
      >
        <span className="-rotate-45 text-xs font-black text-red-100">
          NO GO
        </span>
      </div>

      <div
        className={`absolute left-[16%] bottom-[18%] flex h-24 w-24 rotate-45 items-center justify-center border ${
          active === "heavy-weather"
            ? "alert-blink border-yellow-200 bg-yellow-400/30"
            : "border-yellow-200/20 bg-yellow-400/10"
        }`}
      >
        <span className="-rotate-45 text-xs font-black text-yellow-100">
          WX
        </span>
      </div>
    </>
  );
}

function RouteMap({ active }: { active: PlanId }) {
  const warning =
    active === "heavy-weather" ||
   
    active === "tss-crossing";

  return (
    <svg className="absolute inset-0 h-full w-full">
      <polyline
        className={warning ? "route-pulse" : ""}
        points="90,540 220,430 360,360 510,260 700,210"
        fill="none"
        stroke={warning ? "#facc15" : "#22d3ee"}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <polyline
        points="90,540 220,430 360,360 510,260 700,210"
        fill="none"
        stroke="#67e8f9"
        strokeWidth="1"
        strokeDasharray="8 12"
        opacity="0.7"
      />

      {[90, 220, 360, 510, 700].map((x, i) => {
        const y = [540, 430, 360, 260, 210][i];
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

      <path
        d="M120 610 L250 570 L430 590 L690 540"
        fill="none"
        stroke="#facc15"
        strokeWidth="2"
        strokeDasharray="10 10"
        opacity="0.55"
      />
      <text x="130" y="635" fill="#fde68a" fontSize="12" fontWeight="900">
        ALTERNATE ROUTE
      </text>
    </svg>
  );
}

function OwnShip({ active }: { active: PlanId }) {
  const pos =
    active === "bodrum-knidos"
      ? "left-[44%] top-[51%]"
      : active === "knidos-datca"
      ? "left-[53%] top-[43%]"
      : active === "datca-simi"
      ? "left-[62%] top-[36%]"
      : active === "tss-crossing"
      ? "left-[48%] top-[55%]"
      : active === "heavy-weather"
      ? "left-[26%] top-[70%]"
      : "left-[66%] top-[34%]";

  return (
    <div className={`vessel-move absolute ${pos}`}>
      <div className="relative h-20 w-11 -translate-x-1/2 -translate-y-1/2 rounded-[60%_60%_45%_45%] border border-white/30 bg-white/15 shadow-[0_0_35px_rgba(255,255,255,.2)]">
        <div className="absolute left-1/2 top-2 h-14 w-[2px] -translate-x-1/2 bg-white/70" />
        <div className="absolute bottom-3 left-1/2 h-8 w-7 -translate-x-1/2 rounded-b-full bg-blue-500/70" />
      </div>

      <div className="mt-2 -translate-x-1/2 rounded-xl border border-cyan-300/20 bg-black/60 px-3 py-1 text-[10px] font-black text-cyan-100">
        OWN SHIP
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-center">
      <p className="text-[10px] font-black tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}