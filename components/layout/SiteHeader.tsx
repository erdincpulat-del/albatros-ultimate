import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
        <Link href="/" className="group">
          <div className="text-sm tracking-[0.35em] text-cyan-300">
            ALBATROS
          </div>
          <div className="-mt-1 text-xl font-black tracking-tight text-white">
            Sailing
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <Link className="transition hover:text-cyan-300" href="/">
            Ana Sayfa
          </Link>

          <Link className="transition hover:text-cyan-300" href="/simulator">
            Simülatör
          </Link>

          <Link className="transition hover:text-cyan-300" href="/#egitim-modulleri">
            Eğitim Modülleri
          </Link>
        </nav>

        <a
          href="https://wa.me/905000000000"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-xs font-black text-white transition hover:bg-cyan-300/20 md:px-5 md:text-sm"
        >
          WhatsApp
        </a>
      </div>

      <div className="border-t border-white/10 bg-[#020617]/95 px-4 py-3">
        <div className="mx-auto flex max-w-7xl justify-center">
          <Link
            href="/#egitim-modulleri"
            className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-xs font-black tracking-[0.22em] text-cyan-100 transition hover:bg-cyan-300/20"
          >
            EĞİTİM MODÜLLERİ
          </Link>
        </div>
      </div>
    </header>
  );
}