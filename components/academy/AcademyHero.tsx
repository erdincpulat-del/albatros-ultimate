import Link from "next/link";
import {
  Anchor,
  ArrowRight,
  BookOpen,
  Compass,
  Route,
  Shield,
} from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

export default function AcademyHero() {
  const stats = [
    { value: "5", label: "YYE Seviye", icon: Compass },
    { value: "25+", label: "Eğitim Modülü", icon: BookOpen },
    { value: "40+", label: "Uygulama", icon: Route },
    { value: "100%", label: "Emniyet Odaklı", icon: Shield },
  ];

  return (
    <section className="relative overflow-hidden border-b border-cyan-300/20">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: "url('/images/navigation/hero-chart.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#020817] via-[#020817]/82 to-[#020817]/28" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/30 via-transparent to-[#020817]" />
      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(34,211,238,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.18)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            Albatros Sailing Academy
          </p>

          <h1 className="mt-5 text-5xl font-black leading-[0.92] tracking-tight md:text-7xl">
            ACADEMY
            <br />
            LIBRARY
            <br />
            <span className="text-cyan-300">YYE SYSTEM</span>
          </h1>

          <p className="mt-6 max-w-xl text-xl font-black leading-8">
            Dersleri seviyeye göre gör. Eksikleri fark et. Profesyonel denizcilik
            yolculuğunu düzenli ilerlet.
          </p>

          <p className="mt-4 max-w-2xl leading-8 text-slate-300">
            Navigation, radar, AIS, COLREG, GMDSS, passage planning ve bridge
            systems başlıkları YYE 1’den YYE 5’e kadar seviyelendirilmiş eğitim
            kütüphanesi içinde toplanır.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/guide/navigation"
              className="inline-flex items-center gap-3 rounded-2xl bg-cyan-300 px-6 py-4 text-sm font-black uppercase tracking-wider text-slate-950 transition hover:bg-cyan-200"
            >
              Navigation Academy
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/guide/navigation/formulas"
              className="inline-flex items-center gap-3 rounded-2xl border border-cyan-300/35 bg-slate-950/55 px-6 py-4 text-sm font-black uppercase tracking-wider text-cyan-100 backdrop-blur transition hover:bg-cyan-300/10"
            >
              Formüller
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <GlassPanel className="mt-8 max-w-xl p-5">
            <div className="flex gap-4">
              <Anchor className="h-7 w-7 shrink-0 text-cyan-300" />
              <p className="text-sm font-semibold leading-7 text-slate-200">
                Elektronik cihazlar yardımcıdır; gerçek navigator haritayı,
                pusulayı, zamanı, mesafeyi ve denizi birlikte okuyabilen kişidir.
              </p>
            </div>
          </GlassPanel>
        </div>

        <div className="mt-10 grid overflow-hidden rounded-3xl border border-cyan-300/25 bg-slate-950/70 shadow-[0_0_60px_rgba(34,211,238,0.14)] backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="flex items-center gap-5 border-b border-cyan-300/15 p-5 sm:border-r lg:border-b-0 last:border-r-0"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10">
                  <Icon className="h-8 w-8 text-cyan-300" />
                </div>

                <div>
                  <div className="text-3xl font-black text-white">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-black uppercase tracking-wider text-slate-300">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}