"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Compass,
  Eye,
  Gauge,
  Layers,
  Map,
  Navigation,
  RotateCcw,
  ShieldAlert,
  Sun,
  Waves,
  Wind,
  XCircle,
} from "lucide-react";

type WeatherType =
  | "isobar"
  | "fronts"
  | "clouds"
  | "fog"
  | "wind"
  | "regional"
  | "squall"
  | "storm"
  | "pressure"
  | "decision";

type WeatherModule = {
  id: string;
  title: string;
  type: WeatherType;
  level: "CORE" | "SAFETY" | "PRO";
  image?: string;
  summary: string;
  meaning: string;
  symbols: string;
  decision: string;
  danger: string;
};

const modules: WeatherModule[] = [
  {
    id: "isobar",
    title: "Isobar Reading",
    type: "isobar",
    level: "CORE",
    image: "/images/weather/isobar-map.jpg",
    summary:
      "İzobarlar aynı basınçtaki noktaları birleştirir. Çizgiler sıklaştıkça pressure gradient artar ve rüzgar güçlenir.",
    meaning:
      "İzobar okuma, harita üzerindeki basınç dağılımını görerek rüzgarın yönünü, gücünü ve sistemin karakterini anlamaktır.",
    symbols:
      "High pressure genelde H, low pressure L ile gösterilir. Sık izobarlar güçlü rüzgar, açık izobarlar daha zayıf rüzgar anlamına gelir.",
    decision:
      "Seyir planında açık denize çıkış, rota seçimi, reef zamanı ve güvenli liman kararı izobar yapısına göre değerlendirilir.",
    danger:
      "Sık izobar + düşen basınç + koyulaşan bulutlar yaklaşan sert hava uyarısıdır.",
  },
  {
    id: "fronts",
    title: "Front Systems",
    type: "fronts",
    level: "CORE",
    image: "/images/weather/isobar-map.jpg",
    summary:
      "Cold front, warm front, occluded front ve stationary front hava değişimlerinin ana çizgileridir.",
    meaning:
      "Cephe, farklı sıcaklık ve nem özelliklerine sahip hava kütlelerinin sınırıdır. Deniz üzerinde rüzgar, yağış ve görüşü hızla değiştirebilir.",
    symbols:
      "Cold front üçgenlerle, warm front yarım dairelerle, occluded front karma sembolle, stationary front karşılıklı sembollerle gösterilir.",
    decision:
      "Cephe geçişi öncesi reef alınır, güverte hazırlanır, rota ve emniyet limanı tekrar değerlendirilir.",
    danger:
      "Cold front geçişinde ani rüzgar değişimi, sağanak, squall, yıldırım ve kısa sürede yükselen deniz görülebilir.",
  },
  {
    id: "clouds",
    title: "Cloud Interpretation",
    type: "clouds",
    level: "CORE",
    image: "/images/weather/cumulus.jpg",
    summary:
      "Bulutlar denizde hava tahmininin canlı göstergesidir. Cirrus, cumulus, cumulonimbus, stratocumulus, nimbostratus ve mammatus okunmalıdır.",
    meaning:
      "Bulut okuma; yaklaşan cepheyi, konveksiyonu, yağış sistemini, squall riskini ve görüş düşüşünü önceden fark etmektir.",
    symbols:
      "Cirrus ince yüksek bulut, cumulus pamuksu bulut, cumulonimbus dikey gelişmiş fırtına bulutu, stratocumulus alçak tabaka, nimbostratus uzun yağış bulutudur.",
    decision:
      "CB gelişimi görülürse reef hazırlığı, rota kaçışı, yıldırım önlemi ve güverte emniyeti düşünülmelidir.",
    danger:
      "Cumulonimbus; yıldırım, dolu, ani rüzgar, microburst, waterspout ve yoğun yağış riski taşır.",
  },
  {
    id: "fog",
    title: "Fog / Restricted Visibility",
    type: "fog",
    level: "SAFETY",
    image: "/images/weather/fog-sea.jpg",
    summary:
      "Sis görüşü düşürür, mesafe algısını bozar ve collision riskini yükseltir. COLREG Rule 19 mantığıyla yönetilmelidir.",
    meaning:
      "Fog; deniz üzerinde görüşün azalmasıdır. Sea fog, advection fog, radiation fog ve frontal fog farklı oluşumlara sahiptir.",
    symbols:
      "Meteoroloji haritalarında sis düşük görüş, nem ve sıcaklık farkı ile ilişkilendirilir. Operasyonda radar, AIS ve sound signal birlikte kullanılır.",
    decision:
      "Güvenli hız, sürekli lookout, radar takibi, motor hazır, ses işaretleri ve dar kanal/TSS risk analizi gerekir.",
    danger:
      "AIS'e kör güvenmek tehlikelidir. Radarda küçük hedefler kaybolabilir, ses yönü yanıltabilir.",
  },
  {
    id: "wind",
    title: "Wind Directions",
    type: "wind",
    level: "CORE",
    image: "/images/weather/wind-directions-tr.jpg",
    summary:
      "Rüzgar yönleri, ana yönler ve ara yönlerle okunur. True wind, apparent wind ve wind shift kararları etkiler.",
    meaning:
      "Rüzgar geldiği yönden isimlendirilir. Kuzey rüzgarı kuzeyden eser. Seyirde gerçek rüzgar ve görünen rüzgar ayrımı önemlidir.",
    symbols:
      "N, NE, E, SE, S, SW, W, NW temel yönlerdir. 16 nokta rüzgar gülü daha hassas ara yön okuması sağlar.",
    decision:
      "Seyir planı, yelken trim, reef, rota seçimi ve sığınak kararı rüzgar yönüne göre verilir.",
    danger:
      "Ani yön değişimi yaklaşan cephe, kara/deniz meltemi değişimi veya squall habercisi olabilir.",
  },
  {
    id: "regional",
    title: "Regional Winds",
    type: "regional",
    level: "PRO",
    image: "/images/weather/front-cloud-line.jpg",
    summary:
      "Meltemi, Bora, Sirocco, Mistral ve katabatik rüzgarlar bölgesel denizcilikte çok önemlidir.",
    meaning:
      "Bölgesel rüzgar sistemleri coğrafya, basınç farkı, dağ geçitleri, sıcaklık ve kara-deniz etkileşimiyle oluşur.",
    symbols:
      "Meltemi Ege'de kuvvetli kuzeyli yaz rüzgarı; Bora soğuk ve sert katabatik; Sirocco sıcak ve nemli/güneyli; Mistral soğuk kuzeybatılı rüzgardır.",
    decision:
      "Rota, demir yeri, liman seçimi ve kalkış zamanı bölgesel rüzgar bilgisiyle belirlenir.",
    danger:
      "Katabatik rüzgar gece ve dağlık kıyılarda aniden hızlanabilir. Demirde ciddi sürüklenme riski yaratır.",
  },
  {
    id: "squall",
    title: "Squall Prediction",
    type: "squall",
    level: "SAFETY",
    image: "/images/weather/squall-sea.jpg",
    summary:
      "Squall kısa sürede gelen sert rüzgar ve yağış hattıdır. Yelkenli teknelerde önceden reef alınmalıdır.",
    meaning:
      "Squall; konvektif bulut, cephe hattı veya lokal hücreyle aniden oluşan kuvvetli rüzgar artışıdır.",
    symbols:
      "Koyu bulut tabanı, hızla yaklaşan yağış perdesi, ani sıcaklık düşüşü ve deniz yüzeyinde koyulaşma görülebilir.",
    decision:
      "Reef erken alınır, güverte boşaltılır, ekip emniyete alınır, rota kaçış açısı düşünülür.",
    danger:
      "Geç reef, broach, kontrol kaybı, yelken hasarı ve MOB riski yaratabilir.",
  },
  {
    id: "storm",
    title: "Storm / Lightning / Hail",
    type: "storm",
    level: "SAFETY",
    image: "/images/weather/rain-clouds.jpg",
    summary:
      "Fırtına, yıldırım, dolu, yoğun yağmur, microburst ve waterspout denizde yüksek risk oluşturur.",
    meaning:
      "Thunderstorm ve CB hücreleri çok hızlı gelişebilir. Yıldırım, sert rüzgar, dolu ve yoğun yağış birlikte gelebilir.",
    symbols:
      "CB bulutu, şimşek, radar hücresi, dolu işareti, kırmızı/menekşe radar yoğunluğu ciddi uyarıdır.",
    decision:
      "Metal ekipmanlardan uzak durulur, elektronikler korunur, rota kaçışı yapılır, ekip can yeleği/harness kullanır.",
    danger:
      "Direk yıldırım çekebilir; elektronikler zarar görebilir; dolu görüşü düşürür ve güvertede yaralanma riski yaratır.",
  },
  {
    id: "pressure",
    title: "Pressure Trend",
    type: "pressure",
    level: "PRO",
    image: "/images/weather/isobar-map.jpg",
    summary:
      "Basınç trendi hava değişiminin erken uyarısıdır. Hızlı düşüş sert hava riskini artırır.",
    meaning:
      "Barometredeki düzenli düşüş, alçak basınç yaklaşımı veya cephe geçişi göstergesi olabilir.",
    symbols:
      "1013 hPa referans kabul edilir. Hızlı düşüş, yaklaşan sistemin güçlendiğini gösterebilir.",
    decision:
      "Basınç düşüyorsa açık deniz planı, demir yeri, reef stratejisi ve alternatif liman yeniden değerlendirilir.",
    danger:
      "Basınç hızlı düşerken havanın hâlâ sakin olması aldatıcıdır; sert hava gecikmeli gelebilir.",
  },
  {
    id: "decision",
    title: "Offshore Go / No-Go",
    type: "decision",
    level: "PRO",
    image: "/images/weather/front-cloud-line.jpg",
    summary:
      "Weather routing, risk analizi ve ekip dayanıklılığı birlikte değerlendirilerek kalkış kararı verilir.",
    meaning:
      "Go / No-Go kararı sadece rüzgar hızına bakılarak verilmez; rota, dalga, görüş, ekip, gece seyri ve kaçış limanları birlikte düşünülür.",
    symbols:
      "Weather window, pressure trend, wave height, wind against current, squall risk ve safe harbor noktaları kontrol edilir.",
    decision:
      "Risk yüksekse kalkış ertelenir, rota kısaltılır veya alternatif korunaklı rota seçilir.",
    danger:
      "Yanlış kalkış kararı, denizde geri dönüşü zor bir risk zinciri başlatır.",
  },
];

const clouds = [
  {
    name: "Cirrus",
    risk: "CHANGE",
    image: "/images/weather/cirrus.jpg",
    text: "İnce yüksek bulut. Warm front veya hava değişimi habercisi olabilir.",
  },
  {
    name: "Cumulus",
    risk: "NORMAL",
    image: "/images/weather/cumulus.jpg",
    text: "Pamuksu bulut. Genelde stabil hava; dikey büyürse CB gelişimi takip edilir.",
  },
  {
    name: "Cumulonimbus / Squall",
    risk: "HIGH",
    image: "/images/weather/squall-sea.jpg",
    text: "Thunderstorm, lightning, hail, squall ve microburst riski taşır.",
  },
  {
    name: "Fog / Sea Fog",
    risk: "VISIBILITY",
    image: "/images/weather/fog-sea.jpg",
    text: "Görüşü düşürür. Radar, AIS, lookout ve ses işaretleri kritik hale gelir.",
  },
  {
    name: "Mammatus",
    risk: "SEVERE",
    image: "/images/weather/mammatus.jpg",
    text: "Şiddetli atmosferik dengesizlik ve güçlü fırtına çevresinde görülebilir.",
  },
  {
    name: "Rain Clouds",
    risk: "RAIN",
    image: "/images/weather/rain-clouds.jpg",
    text: "Yoğun yağış, düşük görüş, ani rüzgar ve squall hattı riski oluşturabilir.",
  },
  {
    name: "Stratocumulus",
    risk: "LOW CLOUD",
    image: "/images/weather/stratocumulus.jpg",
    text: "Alçak tabakalı kümeler. Kıyı geçişlerinde düşük tavan ve görüş değişimi yaratabilir.",
  },
  {
    name: "Front Cloud Line",
    risk: "FRONT",
    image: "/images/weather/front-cloud-line.jpg",
    text: "Cephe hattı yaklaşımı. Rüzgar yönü, yağış ve basınç değişimi takip edilmelidir.",
  },
];

const quiz = [
  {
    q: "İzobar çizgileri sıklaştığında genelde ne beklenir?",
    options: [
      "Daha zayıf rüzgar",
      "Daha güçlü rüzgar",
      "Sis tamamen biter",
      "Akıntı durur",
    ],
    answer: 1,
  },
  {
    q: "Cumulonimbus bulutu hangi tehlikeleri taşıyabilir?",
    options: [
      "Yıldırım ve squall",
      "Sadece açık hava",
      "Sadece hafif meltem",
      "Sadece düşük akıntı",
    ],
    answer: 0,
  },
  {
    q: "Sisli havada en doğru yaklaşım hangisidir?",
    options: [
      "Hızı artırmak",
      "AIS'e tamamen güvenmek",
      "Güvenli hız + radar + lookout + ses işareti",
      "Işıkları kapatmak",
    ],
    answer: 2,
  },
];

const windDirections = [
  ["N", "000°", "Yıldız / Kuzey"],
  ["NNE", "022.5°", "Yıldız-Poyraz"],
  ["NE", "045°", "Poyraz"],
  ["ENE", "067.5°", "Gündoğusu-Poyraz"],
  ["E", "090°", "Gündoğusu / Doğu"],
  ["ESE", "112.5°", "Gündoğusu-Keşişleme"],
  ["SE", "135°", "Keşişleme"],
  ["SSE", "157.5°", "Kıble-Keşişleme"],
  ["S", "180°", "Kıble / Güney"],
  ["SSW", "202.5°", "Kıble-Lodos"],
  ["SW", "225°", "Lodos"],
  ["WSW", "247.5°", "Günbatısı-Lodos"],
  ["W", "270°", "Günbatısı / Batı"],
  ["WNW", "292.5°", "Günbatısı-Karayel"],
  ["NW", "315°", "Karayel"],
  ["NNW", "337.5°", "Yıldız-Karayel"],
];

function WeatherVisual({ type, image }: { type: WeatherType; image?: string }) {
  if (image) {
    return (
      <div
        className="h-52 w-full rounded-2xl border border-cyan-300/20 bg-cover bg-center shadow-[inset_0_-70px_70px_rgba(2,8,23,0.72)]"
        style={{ backgroundImage: `url('${image}')` }}
      />
    );
  }

  return (
    <div className="flex h-52 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
      <CloudSun className="h-16 w-16 text-cyan-300" />
    </div>
  );
}

function InfoCard({
  title,
  children,
  icon,
}: {
  title: string;
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-cyan-300/15 bg-slate-950/45 p-5">
      <div className="flex items-center gap-3 text-cyan-300">
        {icon}
        <h3 className="font-black">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-300">{children}</p>
    </div>
  );
}

export default function Page() {
  const [activeId, setActiveId] = useState(modules[0].id);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const active = useMemo(
    () => modules.find((item) => item.id === activeId) ?? modules[0],
    [activeId]
  );

  const score = quiz.reduce((total, item, index) => {
    return answers[index] === item.answer ? total + 1 : total;
  }, 0);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020817] text-white">
      <div
        className="pointer-events-none fixed inset-0 opacity-50"
        style={{
          backgroundImage: "url('/images/weather/rain-clouds.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="pointer-events-none fixed inset-0 bg-gradient-to-r from-[#020817] via-[#020817]/78 to-[#020817]/52" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#020817]/20 via-[#020817]/72 to-[#020817]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.07] bg-[linear-gradient(rgba(34,211,238,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.18)_1px,transparent_1px)] bg-[size:86px_86px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <Link
          href="/guide/navigation"
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-200 transition hover:bg-cyan-300/20"
        >
          <ArrowLeft className="h-4 w-4" />
          Navigation Academy
        </Link>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
              Weather & Marine Meteorology
            </p>

            <h1 className="mt-4 text-5xl font-black leading-[0.9] tracking-[-0.05em] md:text-7xl">
              Marine Weather
              <span className="block text-cyan-300 drop-shadow-[0_0_28px_rgba(34,211,238,0.45)]">
                Training Engine
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
              İzobar okuma, cephe sistemleri, bulut yorumlama, sis, fırtına,
              dolu, şimşek, squall, basınç trendi, Meltemi, Bora, Sirocco ve
              offshore hava kararları için profesyonel eğitim modülü.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["10", "Ana Konu", Layers],
                ["8", "Bulut Örneği", Cloud],
                ["16", "Rüzgar Yönü", Compass],
              ].map(([value, label, Icon]) => (
                <div
                  key={label as string}
                  className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-4 shadow-[0_0_35px_rgba(34,211,238,0.08)] backdrop-blur-xl"
                >
                  <Icon className="h-6 w-6 text-cyan-300" />
                  <div className="mt-3 text-3xl font-black">{value as string}</div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-300">
                    {label as string}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-300/30 bg-gradient-to-br from-[#0b2236]/80 via-[#061421]/80 to-[#020817]/90 p-6 shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
                  Selected Weather Layer
                </p>
                <h2 className="mt-2 text-3xl font-black">{active.title}</h2>
              </div>

              <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-black text-cyan-300">
                {active.level}
              </div>
            </div>

            <div className="mt-6">
              <WeatherVisual type={active.type} image={active.image} />
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-300">
              {active.summary}
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-cyan-300/25 bg-gradient-to-br from-[#0b2236]/80 via-[#061421]/80 to-[#020817]/90 p-5 shadow-[0_0_70px_rgba(34,211,238,0.10)] backdrop-blur-xl">
            <h2 className="text-xl font-black text-cyan-300">
              Weather Library
            </h2>

            <div className="mt-5 grid gap-3">
              {modules.map((module) => {
                const selected = active.id === module.id;

                return (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => setActiveId(module.id)}
                    className={`group flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-cyan-300/70 bg-cyan-300/15 shadow-[0_0_35px_rgba(34,211,238,0.16)]"
                        : "border-cyan-300/15 bg-slate-950/35 hover:border-cyan-300/45 hover:bg-cyan-300/10"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-black text-white">
                        {module.title}
                      </div>
                      <div className="mt-1 text-xs font-semibold text-slate-400">
                        {module.level}
                      </div>
                    </div>

                    <Navigation
                      className={`h-5 w-5 transition ${
                        selected
                          ? "translate-x-1 text-cyan-300"
                          : "text-slate-500 group-hover:translate-x-1 group-hover:text-cyan-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-300/25 bg-gradient-to-br from-[#0b2236]/80 via-[#061421]/80 to-[#020817]/90 p-6 shadow-[0_0_70px_rgba(34,211,238,0.10)] backdrop-blur-xl">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoCard title="Anlamı" icon={<CloudSun className="h-5 w-5" />}>
                {active.meaning}
              </InfoCard>

              <InfoCard title="Sembol / Görsel İşaret" icon={<Map className="h-5 w-5" />}>
                {active.symbols}
              </InfoCard>

              <InfoCard title="Seyir Kararı" icon={<Navigation className="h-5 w-5" />}>
                {active.decision}
              </InfoCard>

              <InfoCard title="Tehlike" icon={<ShieldAlert className="h-5 w-5" />}>
                {active.danger}
              </InfoCard>
            </div>

            <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-slate-950/45 p-5">
              <div className="mb-4 flex items-center gap-3 text-cyan-300">
                <Eye className="h-5 w-5" />
                <h3 className="font-black">Marine Weather Layer Preview</h3>
              </div>

              <div
                className="relative h-72 overflow-hidden rounded-2xl border border-cyan-300/20 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${active.image ?? "/images/weather/isobar-map.jpg"}')`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/25 to-transparent" />
                <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(34,211,238,0.20)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.20)_1px,transparent_1px)] bg-[size:42px_42px]" />
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-cyan-300/25 bg-slate-950/65 p-4 backdrop-blur-xl">
                  <div className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                    Tactical Reading
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    {active.summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-cyan-300/25 bg-gradient-to-br from-[#0b2236]/80 via-[#061421]/80 to-[#020817]/90 p-6 shadow-[0_0_70px_rgba(34,211,238,0.10)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Cloud className="h-6 w-6 text-cyan-300" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
                Cloud Interpretation Gallery
              </p>
              <h2 className="mt-1 text-3xl font-black">Bulutları Oku, Hava Kararını Ver</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {clouds.map((cloud) => (
              <div
                key={cloud.name}
                className="overflow-hidden rounded-2xl border border-cyan-300/15 bg-slate-950/40 shadow-[0_0_40px_rgba(34,211,238,0.06)]"
              >
                <div
                  className="h-44 bg-cover bg-center"
                  style={{ backgroundImage: `url('${cloud.image}')` }}
                />

                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-black text-white">{cloud.name}</h3>
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black text-cyan-300">
                      {cloud.risk}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {cloud.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] border border-cyan-300/25 bg-gradient-to-br from-[#0b2236]/80 via-[#061421]/80 to-[#020817]/90 p-6 shadow-[0_0_70px_rgba(34,211,238,0.10)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Compass className="h-6 w-6 text-cyan-300" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
                  Wind Direction
                </p>
                <h2 className="mt-1 text-3xl font-black">16 Nokta Rüzgar Yönleri</h2>
              </div>
            </div>

            <div
              className="mt-6 h-80 rounded-3xl border border-cyan-300/20 bg-contain bg-center bg-no-repeat bg-white/95"
              style={{
                backgroundImage: "url('/images/weather/wind-directions-tr.jpg')",
              }}
            />
          </div>

          <div className="rounded-[2rem] border border-cyan-300/25 bg-gradient-to-br from-[#0b2236]/80 via-[#061421]/80 to-[#020817]/90 p-6 shadow-[0_0_70px_rgba(34,211,238,0.10)] backdrop-blur-xl">
            <h2 className="flex items-center gap-3 text-2xl font-black text-cyan-300">
              <Wind className="h-6 w-6" />
              Yön / Derece Tablosu
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {windDirections.map(([code, degree, tr]) => (
                <div
                  key={code}
                  className="rounded-2xl border border-cyan-300/15 bg-slate-950/40 p-3"
                >
                  <div className="text-xl font-black text-cyan-300">{code}</div>
                  <div className="text-sm font-bold text-white">{degree}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-400">{tr}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-cyan-300/25 bg-gradient-to-br from-[#0b2236]/80 via-[#061421]/80 to-[#020817]/90 p-6 shadow-[0_0_70px_rgba(34,211,238,0.10)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
                Mini Assessment
              </p>
              <h2 className="mt-2 text-3xl font-black">Marine Weather Quiz</h2>
            </div>

            <button
              type="button"
              onClick={() => setAnswers({})}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-200 transition hover:bg-cyan-300/20"
            >
              <RotateCcw className="h-4 w-4" />
              Sıfırla
            </button>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {quiz.map((item, index) => {
              const selected = answers[index];
              const answered = selected !== undefined;

              return (
                <div
                  key={item.q}
                  className="rounded-3xl border border-cyan-300/20 bg-slate-950/40 p-5"
                >
                  <h3 className="font-black leading-7">{item.q}</h3>

                  <div className="mt-4 grid gap-2">
                    {item.options.map((option, optionIndex) => {
                      const isSelected = selected === optionIndex;
                      const isCorrect = item.answer === optionIndex;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [index]: optionIndex,
                            }))
                          }
                          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                            isSelected && isCorrect
                              ? "border-green-300/50 bg-green-300/10 text-green-200"
                              : isSelected && !isCorrect
                                ? "border-red-300/50 bg-red-300/10 text-red-200"
                                : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300/40 hover:bg-cyan-300/10"
                          }`}
                        >
                          {option}
                          {answered && isSelected && isCorrect ? (
                            <CheckCircle2 className="h-4 w-4 text-green-300" />
                          ) : null}
                          {answered && isSelected && !isCorrect ? (
                            <XCircle className="h-4 w-4 text-red-300" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
            <p className="font-black">
              Skor: {score} / {quiz.length}
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-amber-300/30 bg-amber-300/10 p-6 shadow-[0_0_35px_rgba(245,158,11,0.08)]">
          <div className="flex items-start gap-4">
            <ShieldAlert className="mt-1 h-6 w-6 shrink-0 text-amber-300" />

            <p className="leading-8 text-amber-100">
              Bu modül eğitim amaçlıdır. Gerçek seyirde resmi meteoroloji
              bültenleri, VHF duyuruları, Navtex, pilot book, barometre,
              radar, AIS, gözlem ve deniz durumu birlikte değerlendirilmelidir.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}