"use client";

type StatusBadgeProps = {
  label?: string;
  tone?: "cyan" | "green" | "amber" | "red" | "purple";
  className?: string;
};

export default function StatusBadge({
  label = "ACTIVE",
  tone = "cyan",
  className = "",
}: StatusBadgeProps) {
  const styles = {
    cyan: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
    green: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
    amber: "border-amber-300/25 bg-amber-300/10 text-amber-200",
    red: "border-red-300/25 bg-red-300/10 text-red-200",
    purple: "border-purple-300/25 bg-purple-300/10 text-purple-200",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border
        px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]
        ${styles[tone]}
        ${className}
      `}
    >
      {label}
    </span>
  );
}