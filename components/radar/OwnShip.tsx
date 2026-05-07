"use client";

export default function OwnShip({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-10 w-10 items-center justify-center ${className}`}
    >
      <div className="absolute h-16 w-16 rounded-full bg-cyan-400/10 blur-xl" />

      <div className="h-8 w-4 rounded-t-full rounded-b-sm bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />

      <div className="absolute top-0 h-0 w-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-cyan-200" />
    </div>
  );
}
