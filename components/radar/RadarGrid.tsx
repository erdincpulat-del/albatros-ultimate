export default function RadarGrid() {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-cyan-300/10"
          style={{
            width: `${120 + i * 90}px`,
            height: `${120 + i * 90}px`,
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
      ))}

      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-cyan-300/10" />

      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-cyan-300/10" />
    </>
  );
}