"use client";

type Props = {
  heading: number;
};

const marks = Array.from({ length: 72 }, (_, i) => i * 5);

export default function CompassRose({ heading }: Props) {
  return (
    <div
      className="absolute inset-0 rounded-full transition-all duration-700"
      style={{
        transform: `rotate(${-heading}deg)`,
      }}
    >
      {marks.map((deg) => {
        const major = deg % 30 === 0;

        return (
          <div
            key={deg}
            className="absolute left-1/2 top-1/2 origin-bottom"
            style={{
              height: "50%",
              transform: `translateX(-50%) rotate(${deg}deg)`,
            }}
          >
            <div
              className={`mx-auto rounded-full ${
                major
                  ? "h-8 w-[3px] bg-cyan-100 shadow-[0_0_12px_rgba(255,255,255,.6)]"
                  : "h-3 w-[1px] bg-cyan-300/40"
              }`}
            />
          </div>
        );
      })}

      <CompassLabel deg={0} label="N" />
      <CompassLabel deg={90} label="E" />
      <CompassLabel deg={180} label="S" />
      <CompassLabel deg={270} label="W" />
    </div>
  );
}

function CompassLabel({
  deg,
  label,
}: {
  deg: number;
  label: string;
}) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        transform: `rotate(${deg}deg) translateY(-310px) rotate(${-deg}deg)`,
      }}
    >
      <div className="text-xs font-black tracking-[0.25em] text-cyan-100">
        {label}
      </div>
    </div>
  );
}