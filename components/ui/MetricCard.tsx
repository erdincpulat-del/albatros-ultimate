type Props = {
  label: string;
  value: string;
};

export default function MetricCard({
  label,
  value,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">
        {label}
      </p>

      <p className="mt-2 text-sm font-black text-white">
        {value}
      </p>
    </div>
  );
}
