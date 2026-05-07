"use client";

type Props = {
  xte: number;
  rudder: number;
  drift: number;
  mode: string;
};

export default function AutopilotAlarmPanel({
  xte,
  rudder,
  drift,
  mode,
}: Props) {
  const absXte = Math.abs(xte);
  const absRudder = Math.abs(rudder);
  const absDrift = Math.abs(drift);

  const level =
    absXte > 0.3 || absRudder > 28
      ? "DANGER"
      : absXte > 0.15 || absDrift > 12
      ? "CAUTION"
      : "NORMAL";

  const action =
    level === "DANGER"
      ? "Track intercept başlat. Rota sapması ve dümen yükü kritik."
      : level === "CAUTION"
      ? "Drift ve XTE takip edilmeli. Erken rota düzeltmesi önerilir."
      : "Sistem stabil. Heading ve track kontrol normal.";

  return (
    <div
      className={`rounded-3xl border p-4 ${
        level === "DANGER"
          ? "border-red-300/40 bg-red-500/15"
          : level === "CAUTION"
          ? "border-yellow-300/40 bg-yellow-400/15"
          : "border-cyan-300/20 bg-cyan-300/10"
      }`}
    >
      <p className="text-xs font-black tracking-[0.25em] text-cyan-200">
        AUTOPILOT ALARM
      </p>

      <h3 className="mt-2 text-2xl font-black text-white">{level}</h3>

      <p className="mt-3 text-sm leading-7 text-slate-100">{action}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
          MODE<br />
          <span className="font-black text-white">{mode.toUpperCase()}</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
          XTE<br />
          <span className="font-black text-white">{xte.toFixed(2)} NM</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
          RUDDER<br />
          <span className="font-black text-white">{rudder.toFixed(1)}°</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
          DRIFT<br />
          <span className="font-black text-white">{drift.toFixed(0)}°</span>
        </div>
      </div>
    </div>
  );
}