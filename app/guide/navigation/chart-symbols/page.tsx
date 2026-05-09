"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  Eye,
  Layers,
  Lightbulb,
  Map,
  MapPinned,
  Navigation,
  RotateCcw,
  ShieldAlert,
  ShipWheel,
  Waves,
  XCircle,
} from "lucide-react";

type SymbolType =
  | "chart"
  | "contour"
  | "wreck"
  | "obstruction"
  | "isolated"
  | "cardinal"
  | "sector"
  | "compass"
  | "variation"
  | "position";

type Section = {
  id: string;
  title: string;
  type: SymbolType;
  level: "CORE" | "SAFETY" | "PRO";
  summary: string;
  meaning: string;
  chartLook: string;
  decision: string;
  warning: string;
};

const sections: Section[] = [
  {
    id: "chart",
    title: "Harita Nedir?",
    type: "chart",
    level: "CORE",
    summary:
      "Deniz haritası; derinlik, tehlike, fener, şamandıra, kıyı hattı ve seyir yardımcılarını gösteren temel navigasyon dokümanıdır.",
    meaning:
      "Harita; deniz üzerindeki gerçek dünyayı semboller, derinlikler, koordinatlar ve işaretlerle okunabilir hale getirir.",
    chartLook:
      "Üzerinde kıyı çizgisi, derinlik rakamları, contour çizgileri, fener sembolleri, şamandıralar ve tehlike işaretleri bulunur.",
    decision:
      "Güvenli rota seçimi, sığ sulardan kaçınma, yaklaşma hattı belirleme ve mevki kontrolü harita okumayla başlar.",
    warning:
      "Elektronik cihazlar yardımcıdır; gerçek navigator haritayı, pusulayı, zamanı, mesafeyi ve denizi birlikte okur.",
  },
  {
    id: "depth-contour",
    title: "Depth Contour",
    type: "contour",
    level: "CORE",
    summary:
      "Aynı derinlikteki noktaları birleştiren çizgilerdir. Kıyıya yaklaşırken dip yapısını ve risk alanlarını gösterir.",
    meaning:
      "Depth contour, derinlik eş çizgisidir. Çizgiler sıklaştıkça derinlik daha hızlı değişir.",
    chartLook:
      "Haritada kıyıya paralel veya dip yapısına göre kıvrılan ince çizgiler olarak görünür. Üzerinde 5m, 10m, 20m gibi değerler olabilir.",
    decision:
      "Teknenin draftına göre emniyetli su derinliği seçilir. Sık contour alanlarında dikkatli yaklaşılır.",
    warning:
      "Derinlikler chart datum’a göre verilir. Gelgit ve barometrik etki hesaba katılmadan kör güvenilmez.",
  },
  {
    id: "wreck",
    title: "Wreck",
    type: "wreck",
    level: "SAFETY",
    summary:
      "Batık sembolleri, su altındaki gemi kalıntılarını gösterir. Bazıları geçilebilir, bazıları ciddi tehlikedir.",
    meaning:
      "Wreck, batık anlamına gelir. Haritada batığın derinliği ve tehlike derecesi sembolle belirtilir.",
    chartLook:
      "Batık sembolü genellikle özel işaret, kısaltma veya derinlik bilgisiyle gösterilir.",
    decision:
      "Rota batık üzerinden geçirilmez. Derinlik, draft, dalga ve emniyet payı hesaplanarak uzak geçilir.",
    warning:
      "Batığın üstündeki derinlik yeterli görünse bile swell, draft, squat ve harita tarihi dikkate alınmalıdır.",
  },
  {
    id: "obstruction",
    title: "Obstruction",
    type: "obstruction",
    level: "SAFETY",
    summary:
      "Kaya, kablo, boru hattı, balık çiftliği, su altı engeli veya seyri kısıtlayan nesnedir.",
    meaning:
      "Obstruction, seyri etkileyebilecek su altı ya da yüzey engelidir.",
    chartLook:
      "Haritada özel sembol, nokta, çapraz, açıklama veya kısaltma ile gösterilebilir.",
    decision:
      "Rota engelden uzak tutulur. Özellikle gece, sis ve düşük görüşte emniyet mesafesi artırılır.",
    warning:
      "Obstruction her zaman gözle görülmez. Elektronik plotter’da düşük zoom seviyesinde fark edilmeyebilir.",
  },
  {
    id: "isolated-danger",
    title: "Isolated Danger",
    type: "isolated",
    level: "SAFETY",
    summary:
      "Çevresi genelde güvenli olsa bile bulunduğu noktada ciddi tehlike olduğunu gösterir.",
    meaning:
      "Isolated danger mark, etrafında seyredilebilir su bulunan tekil bir tehlikeyi işaret eder.",
    chartLook:
      "Haritada siyah-kırmızı işaret mantığıyla ve iki siyah küre topmark prensibiyle temsil edilir.",
    decision:
      "İşaretin üzerinden veya çok yakınından geçilmez. Tehlikenin çevresinden güvenli mesafeyle dolaşılır.",
    warning:
      "İzole tehlike çevresi güvenli anlamına gelebilir; fakat işaretin kendisi tehlikenin merkezini belirtir.",
  },
  {
    id: "cardinal",
    title: "Cardinal Relation",
    type: "cardinal",
    level: "CORE",
    summary:
      "Cardinal işaretler, tehlikenin hangi tarafından geçileceğini gösterir: North, East, South, West.",
    meaning:
      "Cardinal sistem, pusula yönlerine göre güvenli suyun nerede olduğunu bildirir.",
    chartLook:
      "Haritada topmark üçgenleri ve sarı-siyah renk dizilimiyle temsil edilir.",
    decision:
      "North cardinal gördüğünde işaretin kuzeyinden, East cardinal gördüğünde doğusundan geçilir.",
    warning:
      "Cardinal işaret, tehlikenin kendisini değil güvenli geçiş tarafını anlatır. Yanlış taraftan geçiş tehlikelidir.",
  },
  {
    id: "sector-lights",
    title: "Sector Light",
    type: "sector",
    level: "PRO",
    summary:
      "Farklı renklerde ışık sektörleriyle güvenli yaklaşma hattını gösterir.",
    meaning:
      "Sector light; beyaz, kırmızı ve yeşil ışık sektörleriyle tekneye yaklaşma pozisyonu hakkında bilgi verir.",
    chartLook:
      "Haritada fener merkezinden yayılan renkli sektör açıları ve karakter bilgisiyle gösterilir.",
    decision:
      "Beyaz sektör genellikle güvenli yaklaşma hattını, kırmızı/yeşil sektörler tehlikeli sapmayı gösterebilir.",
    warning:
      "Sektör ışıkları yerel talimatlarla birlikte okunmalıdır. Sadece renge bakarak karar verilmez.",
  },
  {
    id: "compass-rose",
    title: "Compass Rose",
    type: "compass",
    level: "CORE",
    summary:
      "Harita üzerinde gerçek kuzey ve manyetik kuzey referanslarını gösterir.",
    meaning:
      "Compass rose, yön ölçümünde kullanılan harita pusula gülüdür.",
    chartLook:
      "Harita üzerinde dairesel pusula formunda görünür. True ve magnetic yön referansları bulunabilir.",
    decision:
      "Rota çizimi, bearing alma ve variation hesabı compass rose üzerinden kontrol edilir.",
    warning:
      "Gerçek rota ile manyetik rota aynı şey değildir. Variation/deviation hesaba katılmalıdır.",
  },
  {
    id: "magnetic-variation",
    title: "Magnetic Variation",
    type: "variation",
    level: "PRO",
    summary:
      "Gerçek kuzey ile manyetik kuzey arasındaki açısal farktır.",
    meaning:
      "Variation, Dünya’nın manyetik alanı nedeniyle true north ile magnetic north arasındaki farkı ifade eder.",
    chartLook:
      "Compass rose üzerinde yıl ve yıllık değişim bilgisiyle yazılır.",
    decision:
      "True course → magnetic course dönüşümünde variation kullanılır.",
    warning:
      "Variation yıllara göre değişir. Haritadaki base year ve annual change mutlaka okunmalıdır.",
  },
  {
    id: "lat-long",
    title: "Latitude / Longitude",
    type: "position",
    level: "CORE",
    summary:
      "Dünya üzerindeki her mevkiyi enlem ve boylam sistemiyle tanımlar.",
    meaning:
      "Latitude kuzey-güney, longitude doğu-batı konum bilgisidir.",
    chartLook:
      "Harita kenarlarında derece, dakika ve ondalıklı dakika ölçeği olarak görünür.",
    decision:
      "GPS mevkii, fix, waypoint ve rota kontrolü latitude/longitude ile yapılır.",
    warning:
      "Koordinat formatı karıştırılırsa mevki ciddi şekilde yanlış okunabilir.",
  },
];

const quiz = [
  {
    q: "Depth contour neyi gösterir?",
    options: [
      "Aynı derinlikteki noktaları",
      "Rüzgar yönünü",
      "AIS hedeflerini",
      "Yakıt tüketimini",
    ],
    answer: 0,
  },
  {
    q: "North Cardinal işaretin doğru geçiş tarafı nedir?",
    options: ["Güneyi", "Kuzeyi", "Batısı", "Üzeri"],
    answer: 1,
  },
  {
    q: "Magnetic variation neyin farkıdır?",
    options: [
      "Draft ve derinlik",
      "Gerçek kuzey ve manyetik kuzey",
      "COG ve SOG",
      "Gelgit ve akıntı",
    ],
    answer: 1,
  },
];

function SymbolVisual({ type }: { type: SymbolType }) {
  if (type === "contour") {
    return (
      <svg viewBox="0 0 160 110" className="h-24 w-full">
        <path d="M8 78 C35 25, 70 122, 150 35" fill="none" stroke="#22d3ee" strokeWidth="4" />
        <path d="M10 52 C44 8, 83 95, 150 22" fill="none" stroke="#67e8f9" strokeWidth="2" opacity="0.65" />
        <path d="M12 92 C48 48, 98 128, 152 62" fill="none" stroke="#67e8f9" strokeWidth="2" opacity="0.45" />
        <text x="26" y="44" fill="#e2e8f0" fontSize="13" fontWeight="900">5m</text>
        <text x="92" y="74" fill="#e2e8f0" fontSize="13" fontWeight="900">10m</text>
      </svg>
    );
  }

  if (type === "wreck") {
    return (
      <svg viewBox="0 0 160 110" className="h-24 w-full">
        <path d="M34 72 L126 72" stroke="#f97316" strokeWidth="5" strokeLinecap="round" />
        <path d="M54 48 L72 72 L93 42 L112 72" fill="none" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
        <circle cx="80" cy="72" r="28" fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="8 7" />
        <text x="80" y="99" textAnchor="middle" fill="#fecaca" fontSize="13" fontWeight="900">WRECK</text>
      </svg>
    );
  }

  if (type === "obstruction") {
    return (
      <svg viewBox="0 0 160 110" className="h-24 w-full">
        <circle cx="80" cy="56" r="32" fill="rgba(248,113,113,0.12)" stroke="#fb7185" strokeWidth="4" />
        <path d="M55 31 L105 81 M105 31 L55 81" stroke="#fecaca" strokeWidth="5" strokeLinecap="round" />
        <text x="80" y="102" textAnchor="middle" fill="#fecaca" fontSize="12" fontWeight="900">OBSTRUCTION</text>
      </svg>
    );
  }

  if (type === "isolated") {
    return (
      <svg viewBox="0 0 160 110" className="h-24 w-full">
        <rect x="66" y="35" width="28" height="46" rx="6" fill="#ef4444" />
        <rect x="66" y="52" width="28" height="14" fill="#020817" opacity="0.85" />
        <circle cx="72" cy="24" r="8" fill="#020817" stroke="#e2e8f0" strokeWidth="3" />
        <circle cx="88" cy="24" r="8" fill="#020817" stroke="#e2e8f0" strokeWidth="3" />
        <path d="M50 86 H110" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "cardinal") {
    return (
      <svg viewBox="0 0 160 110" className="h-24 w-full">
        <polygon points="80,12 64,38 96,38" fill="#facc15" stroke="#fde68a" strokeWidth="2" />
        <polygon points="80,98 64,72 96,72" fill="#020817" stroke="#e2e8f0" strokeWidth="2" />
        <rect x="67" y="39" width="26" height="33" rx="4" fill="#facc15" />
        <rect x="67" y="53" width="26" height="12" fill="#020817" opacity="0.85" />
        <text x="80" y="58" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="900">N/E/S/W</text>
      </svg>
    );
  }

  if (type === "sector") {
    return (
      <svg viewBox="0 0 160 110" className="h-24 w-full">
        <path d="M80 90 L38 22 A78 78 0 0 1 80 12 Z" fill="rgba(34,197,94,0.28)" />
        <path d="M80 90 L80 12 A78 78 0 0 1 122 22 Z" fill="rgba(255,255,255,0.32)" />
        <path d="M80 90 L122 22 A78 78 0 0 1 148 70 Z" fill="rgba(239,68,68,0.28)" />
        <circle cx="80" cy="90" r="8" fill="#facc15" />
        <path d="M80 90 L38 22 M80 90 L80 12 M80 90 L148 70" stroke="#e2e8f0" strokeWidth="2" opacity="0.7" />
      </svg>
    );
  }

  if (type === "compass" || type === "variation") {
    return (
      <svg viewBox="0 0 160 110" className="h-24 w-full">
        <circle cx="80" cy="55" r="42" fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="3" />
        <path d="M80 16 L90 55 L80 94 L70 55 Z" fill="#e2e8f0" opacity="0.9" />
        <path d="M41 55 L80 45 L119 55 L80 65 Z" fill="#22d3ee" opacity="0.55" />
        <text x="80" y="12" textAnchor="middle" fill="#fecaca" fontSize="15" fontWeight="900">N</text>
        {type === "variation" ? (
          <path d="M80 55 C100 35, 112 34, 124 46" fill="none" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
        ) : null}
      </svg>
    );
  }

  if (type === "position") {
    return (
      <svg viewBox="0 0 160 110" className="h-24 w-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`v-${i}`} x1={30 + i * 25} y1="18" x2={30 + i * 25} y2="94" stroke="#22d3ee" opacity="0.35" />
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <line key={`h-${i}`} x1="18" y1={28 + i * 20} x2="142" y2={28 + i * 20} stroke="#22d3ee" opacity="0.35" />
        ))}
        <MapPinned className="absolute" />
        <circle cx="87" cy="52" r="9" fill="#f43f5e" />
        <text x="80" y="101" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="900">41°12.6'N 029°03.4'E</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 160 110" className="h-24 w-full">
      <rect x="22" y="20" width="116" height="70" rx="10" fill="rgba(34,211,238,0.08)" stroke="#22d3ee" />
      <path d="M34 70 C58 45, 78 72, 104 42 C116 30, 126 33, 138 45" fill="none" stroke="#67e8f9" strokeWidth="3" />
      <circle cx="55" cy="48" r="4" fill="#facc15" />
      <circle cx="106" cy="42" r="4" fill="#facc15" />
      <text x="80" y="103" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="900">CHART</text>
    </svg>
  );
}

function DetailRow({
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
  const [activeId, setActiveId] = useState(sections[0].id);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const active = useMemo(
    () => sections.find((item) => item.id === activeId) ?? sections[0],
    [activeId]
  );

  const score = quiz.reduce((total, item, index) => {
    return answers[index] === item.answer ? total + 1 : total;
  }, 0);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020817] text-white">
      <div
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          backgroundImage: "url('/images/navigation/hero-premium.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="pointer-events-none fixed inset-0 bg-gradient-to-r from-[#020817] via-[#020817]/72 to-[#020817]/35" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#020817]/20 via-[#020817]/70 to-[#020817]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.07] bg-[linear-gradient(rgba(34,211,238,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.18)_1px,transparent_1px)] bg-[size:90px_90px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <Link
          href="/guide/navigation"
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.10)] transition hover:bg-cyan-300/20"
        >
          <ArrowLeft className="h-4 w-4" />
          Navigation Academy
        </Link>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
              Chart Reading Module
            </p>

            <h1 className="mt-4 text-5xl font-black leading-[0.9] tracking-[-0.05em] md:text-7xl">
              Chart Symbols
              <span className="block text-cyan-300 drop-shadow-[0_0_28px_rgba(34,211,238,0.45)]">
                Training Engine
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
              Harita sembolleri, depth contour, wreck, obstruction, isolated
              danger, cardinal relation, sector light, magnetic variation,
              compass rose ve koordinat okuma için interaktif eğitim modülü.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["10", "Ana Konu", BookOpen],
                ["3", "Quiz", CheckCircle2],
                ["PRO", "Chart Layer", Layers],
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
                  Selected Symbol
                </p>
                <h2 className="mt-2 text-3xl font-black">{active.title}</h2>
              </div>

              <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-black text-cyan-300">
                {active.level}
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-slate-950/45 p-4">
              <SymbolVisual type={active.type} />
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-300">
              {active.summary}
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-cyan-300/25 bg-gradient-to-br from-[#0b2236]/80 via-[#061421]/80 to-[#020817]/90 p-5 shadow-[0_0_70px_rgba(34,211,238,0.10)] backdrop-blur-xl">
            <h2 className="text-xl font-black text-cyan-300">
              Symbol Library
            </h2>

            <div className="mt-5 grid gap-3">
              {sections.map((section) => {
                const selected = active.id === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveId(section.id)}
                    className={`group flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-cyan-300/70 bg-cyan-300/15 shadow-[0_0_35px_rgba(34,211,238,0.16)]"
                        : "border-cyan-300/15 bg-slate-950/35 hover:border-cyan-300/45 hover:bg-cyan-300/10"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-black text-white">
                        {section.title}
                      </div>
                      <div className="mt-1 text-xs font-semibold text-slate-400">
                        {section.level}
                      </div>
                    </div>

                    <ChevronRight
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
              <DetailRow title="Ne Demek?" icon={<BookOpen className="h-5 w-5" />}>
                {active.meaning}
              </DetailRow>

              <DetailRow title="Haritada Nasıl Görünür?" icon={<Map className="h-5 w-5" />}>
                {active.chartLook}
              </DetailRow>

              <DetailRow title="Seyirde Ne Karar Verdirir?" icon={<Navigation className="h-5 w-5" />}>
                {active.decision}
              </DetailRow>

              <DetailRow title="Dikkat Noktası" icon={<ShieldAlert className="h-5 w-5" />}>
                {active.warning}
              </DetailRow>
            </div>

            <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-slate-950/45 p-5">
              <div className="mb-4 flex items-center gap-3 text-cyan-300">
                <Eye className="h-5 w-5" />
                <h3 className="font-black">Chart Layer Preview</h3>
              </div>

              <div className="relative h-56 overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#061421]">
                <div className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(34,211,238,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.18)_1px,transparent_1px)] bg-[size:42px_42px]" />
                <div className="absolute left-8 top-8 h-24 w-24 rounded-full border border-cyan-300/25" />
                <div className="absolute bottom-8 right-8 h-20 w-20 rounded-full border border-cyan-300/25" />
                <div className="absolute left-10 top-16 h-2 w-48 rotate-[-18deg] rounded-full bg-cyan-300/40" />
                <div className="absolute bottom-12 left-20 h-2 w-64 rotate-[10deg] rounded-full bg-cyan-300/25" />
                <div className="absolute right-12 top-10 h-28 w-28 rounded-full bg-cyan-300/10 blur-2xl" />
                <div className="absolute left-1/2 top-1/2 w-60 -translate-x-1/2 -translate-y-1/2">
                  <SymbolVisual type={active.type} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-cyan-300/25 bg-gradient-to-br from-[#0b2236]/80 via-[#061421]/80 to-[#020817]/90 p-6 shadow-[0_0_70px_rgba(34,211,238,0.10)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
                Mini Assessment
              </p>
              <h2 className="mt-2 text-3xl font-black">Chart Symbols Quiz</h2>
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
            <div className="flex items-center gap-3">
              <ShipWheel className="h-6 w-6 text-cyan-300" />
              <p className="font-black">
                Skor: {score} / {quiz.length}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-amber-300/30 bg-amber-300/10 p-6 shadow-[0_0_35px_rgba(245,158,11,0.08)]">
          <div className="flex items-start gap-4">
            <ShieldAlert className="mt-1 h-6 w-6 shrink-0 text-amber-300" />

            <p className="leading-8 text-amber-100">
              Bu modül eğitim amaçlıdır. Gerçek seyirde güncel resmi haritalar,
              Notices to Mariners, pilot book, derinlik, hava, görüş, draft ve
              elektronik navigasyon sistemleri birlikte değerlendirilmelidir.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}