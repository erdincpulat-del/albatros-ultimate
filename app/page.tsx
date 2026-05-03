export default function HomePage() {
  return (
    <main className="section text-center">
      <h1 className="text-5xl font-black tracking-tight">
        Albatros Sailing
      </h1>

      <p className="mt-6 text-lg text-slate-300">
        YYE Eğitim Platformu — Yelkenli Simülasyon, Eğitim ve Gerçek Deniz Deneyimi
      </p>

      <div className="mt-10 flex justify-center gap-4">
        <a href="/simulator" className="btn-primary">
          Simülatöre Gir
        </a>

        <a href="#" className="glass px-6 py-3 rounded-full">
          Programları İncele
        </a>
      </div>
    </main>
  );
}