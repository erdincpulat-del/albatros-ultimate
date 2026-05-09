"use client";

import GlowCard from "@/components/ui/GlowCard";
import StatusBadge from "@/components/ui/StatusBadge";

type Props = {
  title: string;
  description: string;
  href: string;
  icon: any;
  level?: string;
  difficulty?: "basic" | "intermediate" | "advanced";
};

export default function AcademyModuleCard({
  title,
  description,
  href,
  icon,
  level = "YYE",
  difficulty = "basic",
}: Props) {
  const difficultyTone =
    difficulty === "advanced"
      ? "red"
      : difficulty === "intermediate"
        ? "amber"
        : "green";

  const difficultyLabel =
    difficulty === "advanced"
      ? "ADVANCED"
      : difficulty === "intermediate"
        ? "INTERMEDIATE"
        : "BASIC";

  return (
    <GlowCard
      title={title}
      description={description}
      href={href}
      icon={icon}
      className="min-h-[255px]"
    >
      <div className="mt-5 flex flex-wrap gap-2">
        <StatusBadge
          label={level}
          tone="cyan"
        />

        <StatusBadge
          label={difficultyLabel}
          tone={difficultyTone as any}
        />
      </div>
    </GlowCard>
  );
}