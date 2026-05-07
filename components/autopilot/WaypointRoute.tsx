"use client";

type Props = {
  xte: number;
  drift: number;
};

const waypoints = [
  { x: 18, y: 72, label: "WP1" },
  { x: 34, y: 58, label: "WP2" },
  { x: 50, y: 50, label: "WP3" },
  { x: 68, y: 38, label: "WP4" },
  { x: 82, y: 26, label: "WP5" },
];

export default function WaypointRoute({ xte, drift }: Props) {
  const offset = xte * 80;

  return (
    <div className="absolute inset-0">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        <polyline
          points={waypoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="rgba(34,211,238,.9)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <polyline
          points={waypoints.map((p) => `${p.x},${p.y + offset}`).join(" ")}
          fill="none"
          stroke="rgba(250,204,21,.75)"
          strokeWidth="0.35"
          strokeDasharray="1.4 1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {waypoints.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="1.2" fill="rgb(103,232,249)" />
            <text
              x={p.x + 1.6}
              y={p.y - 1.6}
              fill="rgb(207,250,254)"
              fontSize="2.5"
              fontWeight="900"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>

      <div
        className="absolute left-[12%] top-[16%] rounded-2xl border border-cyan-300/20 bg-black/55 px-3 py-2 text-[10px] font-black text-cyan-100"
        style={{
          transform: `translateX(${drift * 1.2}px)`,
        }}
      >
        CURRENT SET {drift > 0 ? "→" : "←"} {Math.abs(drift).toFixed(0)}°
      </div>

      <div
        className="absolute left-[18%] top-[22%] h-px w-24 origin-left bg-gradient-to-r from-cyan-300 to-transparent"
        style={{
          transform: `rotate(${90 + drift * 3}deg)`,
        }}
      />
    </div>
  );
}