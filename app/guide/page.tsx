const modules = [
  {
    title: "IALA Buoyage Engine",
    desc: "Lateral, cardinal, safe water, isolated danger, wreck ve special marks.",
    href: "/guide/buoyage",
  },
  {
    title: "Cardinal Simulator",
    desc: "North, East, South, West cardinal karar ve gece ışık eğitimi.",
    href: "/guide/cardinals",
  },
  {
    title: "Night Lights Engine",
    desc: "Gece seyir fenerleri ve tekne durumları.",
    href: "/guide/night-lights",
  },
  {
    title: "Sound Signals",
    desc: "Kısa/uzun düdük, sis ve manevra işaretleri.",
    href: "/guide/sound-signals",
  },
];

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#020617] px-4 py-10 text-white">
      <section className="mx-auto max-w-7xl">
        <p className="text-xs font-black tracking-[0.35em] text-cyan-300">
          ALBATROS SAILING
        </p>

        <h1 className="mt-3 text-4xl font-black md:text-6xl">
          Maritime Training Hub
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
          Sertifika bağlantısı olmayan bağımsız eğitim modülleri.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {modules.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
            >
              <h2 className="text-2xl font-black">{item.title}</h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                {item.desc}
              </p>

              <p className="mt-5 text-sm font-black text-cyan-200">
                Modüle Gir →
              </p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}