"use client";

export default function TrackLine() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-[80%] w-[2px] overflow-hidden rounded-full bg-cyan-400/20">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-cyan-300 via-cyan-400 to-transparent" />
      </div>
    </div>
  );
}