"use client";

import { ReactNode } from "react";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
};

export default function GlassPanel({
  children,
  className = "",
}: GlassPanelProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-[28px]
        border border-cyan-300/15
        bg-[rgba(5,12,30,0.72)]
        backdrop-blur-xl
        shadow-[0_0_60px_rgba(0,180,255,0.08)]
        transition-all duration-500
        hover:border-cyan-300/30
        hover:shadow-[0_0_80px_rgba(0,200,255,0.14)]
        ${className}
      `}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,180,255,0.10),transparent_55%)]" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}