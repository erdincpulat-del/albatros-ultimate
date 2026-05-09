"use client";

import type { ReactNode } from "react";

export default function ScanFrame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -14,
          borderRadius: 36,
          background:
            "radial-gradient(circle at top, rgba(56,189,248,0.12), transparent 30%), radial-gradient(circle at bottom, rgba(34,197,94,0.08), transparent 28%)",
          filter: "blur(26px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}