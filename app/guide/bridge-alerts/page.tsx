"use client";

import { useMemo, useState } from "react";
import GlowPanel from "@/components/ui/GlowPanel";
import MetricCard from "@/components/ui/MetricCard";

type Priority = "INFO" | "CAUTION" | "WARNING" | "DISTRESS";
type AlertStatus = "ACTIVE" | "ACKNOWLEDGED";

type AlertItem = {
  id: string;
  source: string;
  title: string;
  priority: Priority;
  status: AlertStatus;
  reason: string;
  action: string;
  training: string;
};

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "collision",
    source: "RADAR / ARPA",
    title: "CPA/TCPA Collision Risk",
    priority: "DISTRESS",
    status: "ACTIVE",
    reason: "CPA 0.24 NM, TCPA 05:12. Hedef rota kesişiminde.",
    action: "COLREG değerlendirmesi yap, erken ve belirgin manevra planla.",
    training:
      "CPA en yakın yaklaşma mesafesidir. TCPA bu yaklaşmanın kaç dakika sonra olacağını gösterir.",
  },
  {
    id: "xte",
    source: "AUTOPILOT",
    title: "Cross Track Error",
    priority: "WARNING",
    status: "ACTIVE",
    reason: "XTE 0.32 NM. Tekne rota hattından uzaklaşıyor.",
    action: "Track intercept başlat, drift ve rudder limitlerini kontrol et.",
    training:
      "XTE rota çizgisine yanal sapmadır. Artarsa rota güvenliği ve emniyet koridoru bozulur.",
  },
  {
    id: "depth",
    source: "ECDIS",
    title: "Shallow Water Alarm",
    priority: "WARNING",
    status: "ACTIVE",
    reason: "Safety contour altında derinlik yaklaşımı algılandı.",
    action: "Güvenli suya rota düzeltmesi yap, depth contour kontrol et.",
    training:
      "ECDIS safety contour, geminin emniyetli derinlik sınırını takip eder.",
  },
  {
    id: "ais",
    source: "AIS",
    title: "AIS Target Lost",
    priority: "CAUTION",
    status: "ACTIVE",
    reason: "TGT-204 AIS sinyali kesildi.",
    action: "Radar echo ile hedefi doğrula, görsel gözcülüğü artır.",
    training:
      "AIS yardımcı sistemdir. AIS kaybında radar ve görsel gözcülük esas takip yöntemi olur.",
  },
  {
    id: "gps",
    source: "NAVIGATION",
    title: "GPS Signal Degraded",
    priority: "CAUTION",
    status: "ACTIVE",
    reason: "Position accuracy düşüşü algılandı.",
    action: "Alternatif pozisyon kontrolü, visual/radar fix ve dead reckoning uygula.",
    training:
      "GPS kaybında ECDIS verisi bağımsız yöntemlerle doğrulanmalıdır.",
  },
];

function priorityStyle(priority: Priority) {
  if (priority === "DISTRESS") {
    return "border-red-300/50 bg-red-500/20 text-red-100";
  }

  if (priority === "WARNING") {
    return "border-orange-300/50 bg-orange-400/20 text-orange-100";
  }

  if (priority === "CAUTION") {
    return "border-yellow-300/50 bg-yellow-400/20 text-yellow-100";
  }

  return "border-cyan-300/40 bg-cyan-400/10 text-cyan-100";
}

export default function Page() {
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [selectedId, setSelectedId] = useState("collision");
  const [silenced, setSilenced] = useState(false);

  const selected = useMemo(() => {
    return alerts.find((item) => item.id === selectedId) ?? alerts[0];
  }, [alerts, selectedId]);

  const activeCount = alerts.filter((item) => item.status === "ACTIVE").length;

  const distressCount = alerts.filter(
    (item) => item.priority === "DISTRESS" && item.status === "ACTIVE"
  ).length;

  function acknowledge(id: string) {
    setAlerts((previousAlerts) =>
      previousAlerts.map((item) =>
        item.id === id ? { ...item, status: "ACKNOWLEDGED" } : item
      )
    );
  }

  function resetAlerts() {
    setAlerts(INITIAL_ALERTS);
    setSelectedId("collision");
    setSilenced(false);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] px-4 py-8 text-white">
      <style>{`
        @keyframes alertPulse {
          0%, 100% {
            opacity: .45;
            transform: scale(.98);
          }

          50% {
            opacity: 1;
            transform: scale(1.03);
          }
        }

        .alert-pulse {
          animation: alertPulse 1.2s ease-in-out infinite;
        }
      `}</style>

      <section className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[34px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl md:p-7">
          <p className="text-xs font-black tracking-[0.35em] text-cyan-300">
            BRIDGE ALERT MANAGEMENT SYSTEM
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            Bridge Brain / Alert Center
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
            Radar, AIS, ECDIS, Autopilot ve Navigation uyarılarını tek merkezde
            toplayan köprüüstü alarm yönetim sistemi.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <MetricCard label="ACTIVE" value={`${activeCount}`} />
            <MetricCard label="DISTRESS" value={`${distressCount}`} />
            <MetricCard label="SILENCE" value={silenced ? "ON" : "OFF"} />
            <MetricCard label="SYSTEM" value="BAMS" />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <GlowPanel className="p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-xs font-black tracking-[0.3em] text-cyan-300">
                LIVE ALERT STACK
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSilenced((value) => !value)}
                  className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black text-cyan-100"
                >
                  {silenced ? "SOUND ON" : "SILENCE"}
                </button>

                <button
                  type="button"
                  onClick={resetAlerts}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black text-white"
                >
                  RESET
                </button>
              </div>
            </div>

            <div className="grid gap-3">
              {alerts.map((alert) => {
                const isActive = alert.status === "ACTIVE";
                const isSelected = selected.id === alert.id;

                return (
                  <button
                    key={alert.id}
                    type="button"
                    onClick={() => setSelectedId(alert.id)}
                    className={`rounded-3xl border p-4 text-left transition ${
                      isSelected
                        ? "border-cyan-300 bg-cyan-300/15"
                        : "border-white/10 bg-white/[0.03] hover:bg-cyan-300/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black tracking-[0.25em] text-cyan-300">
                          {alert.source}
                        </p>

                        <h2 className="mt-2 text-xl font-black">
                          {alert.title}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {alert.reason}
                        </p>
                      </div>

                      <div
                        className={`rounded-full border px-3 py-1 text-[10px] font-black ${priorityStyle(
                          alert.priority
                        )} ${
                          isActive && alert.priority !== "INFO"
                            ? "alert-pulse"
                            : ""
                        }`}
                      >
                        {alert.priority}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black ${
                          isActive
                            ? "bg-red-500/15 text-red-100"
                            : "bg-green-400/10 text-green-100"
                        }`}
                      >
                        {alert.status}
                      </span>

                      {isActive && (
                        <span className="text-xs font-black text-cyan-100">
                          SELECT TO ACK
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </GlowPanel>

          <GlowPanel className="p-5">
            <p className="text-xs font-black tracking-[0.3em] text-cyan-300">
              SELECTED ALERT DETAIL
            </p>

            <div className="mt-4 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
              <p className="text-xs font-black tracking-[0.25em] text-cyan-200">
                {selected.source}
              </p>

              <h2 className="mt-2 text-3xl font-black">{selected.title}</h2>

              <div
                className={`mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-black ${priorityStyle(
                  selected.priority
                )}`}
              >
                {selected.priority} · {selected.status}
              </div>
            </div>

            <InfoPanel title="NEDEN OLDU?" text={selected.reason} />

            <InfoPanel title="NE YAPILMALI?" text={selected.action} orange />

            <InfoPanel title="EĞİTİCİ AÇIKLAMA" text={selected.training} />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => acknowledge(selected.id)}
                className="rounded-2xl border border-green-300/30 bg-green-400/15 px-5 py-4 text-sm font-black text-green-100"
              >
                ACKNOWLEDGE
              </button>

              <button
                type="button"
                onClick={() => setSilenced(true)}
                className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-5 py-4 text-sm font-black text-cyan-100"
              >
                SILENCE ALARM
              </button>
            </div>
          </GlowPanel>
        </div>
      </section>
    </main>
  );
}

function InfoPanel({
  title,
  text,
  orange = false,
}: {
  title: string;
  text: string;
  orange?: boolean;
}) {
  return (
    <div
      className={`mt-5 rounded-3xl border p-5 ${
        orange
          ? "border-orange-300/20 bg-orange-400/10"
          : "border-cyan-300/20 bg-cyan-300/10"
      }`}
    >
      <p
        className={`text-xs font-black tracking-[0.25em] ${
          orange ? "text-orange-100" : "text-cyan-200"
        }`}
      >
        {title}
      </p>

      <p className="mt-3 text-sm leading-7 text-slate-100">{text}</p>
    </div>
  );
}
