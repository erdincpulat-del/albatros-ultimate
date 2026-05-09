"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ElementType, ReactNode } from "react";

type GlowCardProps = {
  title: string;
  description?: string;
  href?: string;
  icon?: ElementType;
  badge?: string;
  children?: ReactNode;
  className?: string;
};

export default function GlowCard({
  title,
  description,
  href,
  icon: Icon,
  badge,
  children,
  className = "",
}: GlowCardProps) {
  const content = (
    <div
      className={`
        group relative h-full overflow-hidden rounded-2xl
        border border-cyan-300/15
        bg-[#061421]/80
        p-5
        transition duration-500
        hover:-translate-y-1
        hover:border-cyan-300/45
        hover:bg-cyan-300/10
        hover:shadow-[0_0_45px_rgba(34,211,238,0.14)]
        ${className}
      `}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_48%)] opacity-0 transition group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          {Icon ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
              <Icon className="h-7 w-7 text-cyan-300" />
            </div>
          ) : null}

          {badge ? (
            <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
              {badge}
            </span>
          ) : null}
        </div>

        <h3 className="mt-5 text-lg font-black text-white">
          {title}
        </h3>

        {description ? (
          <p className="mt-2 min-h-[44px] text-sm leading-6 text-slate-300">
            {description}
          </p>
        ) : null}

        {children}

        {href ? (
          <div className="mt-5 flex items-center gap-2 text-sm font-black text-cyan-300">
            Başla
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        ) : null}
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}