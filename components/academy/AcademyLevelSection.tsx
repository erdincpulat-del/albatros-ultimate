"use client";

import GlowCard from "@/components/ui/GlowCard";
import GlassPanel from "@/components/ui/GlassPanel";
import StatusBadge from "@/components/ui/StatusBadge";

type ModuleItem = {
  title: string;
  desc: string;
  href: string;
  icon: any;
};

type Props = {
  level: string;
  title: string;
  desc: string;
  modules: ModuleItem[];
};

export default function AcademyLevelSection({
  level,
  title,
  desc,
  modules,
}: Props) {
  return (
    <GlassPanel className="p-5 md:p-7">
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <div className="border-b border-cyan-300/10 pb-5 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-6">
          <div className="flex items-center gap-4">
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-3xl border border-cyan-300/20 bg-cyan-300/10">
              <span className="text-xs font-black tracking-[0.25em] text-cyan-200">
                YYE
              </span>

              <span className="text-5xl font-black text-cyan-300">
                {level.replace("YYE ", "")}
              </span>
            </div>

            <div>
              <StatusBadge label="ACADEMY" />

              <h2 className="mt-3 text-2xl font-black text-white">
                {title}
              </h2>
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-slate-300">
            {desc}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {modules.map((module) => (
            <GlowCard
              key={`${level}-${module.href}`}
              title={module.title}
              description={module.desc}
              href={module.href}
              icon={module.icon}
              className="min-h-[240px]"
            />
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}