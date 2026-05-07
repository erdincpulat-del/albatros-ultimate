"use client";

type Props = {
  heading: number;
  rudder?: number;
};

export default function AutopilotShip({
  heading,
  rudder = 0,
}: Props) {
  return (
    <div
      className="absolute left-1/2 top-1/2 h-28 w-28 transition-all duration-700"
      style={{
        transform: `translate(-50%, -50%) rotate(${heading}deg)`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute h-24 w-10 rounded-t-full rounded-b-md border border-cyan-200/40 bg-cyan-300/15 shadow-[0_0_50px_rgba(34,211,238,.35)] backdrop-blur-xl">
          <div className="absolute left-1/2 top-2 h-8 w-[2px] -translate-x-1/2 bg-cyan-100 shadow-[0_0_12px_rgba(255,255,255,.9)]" />

          <div
            className="absolute bottom-[-8px] left-1/2 h-4 w-[2px] bg-orange-300 transition-all duration-500"
            style={{
              transform: `translateX(-50%) rotate(${rudder * 1.4}deg)`,
              transformOrigin: "top center",
            }}
          />
        </div>
      </div>

      <div className="absolute inset-0 rounded-full border border-cyan-300/10" />
    </div>
  );
}