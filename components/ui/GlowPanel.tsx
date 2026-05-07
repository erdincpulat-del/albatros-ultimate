type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function GlowPanel({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`
        rounded-[32px]
        border
        border-cyan-300/20
        bg-white/[0.04]
        backdrop-blur-xl
        shadow-[0_0_80px_rgba(34,211,238,.08)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
