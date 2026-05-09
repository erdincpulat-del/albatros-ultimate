import {
  Anchor,
  Bell,
  Brain,
  Calculator,
  Compass,
  Gauge,
  Map,
  Radar,
  Radio,
  Shield,
  ShipWheel,
  Siren,
  Waves,
  Wind,
} from "lucide-react";

export const academyLevels = [
  {
    level: "YYE 1",
    title: "Temel Denizcilik",
    desc: "Denizcilik temelleri ve seyir başlangıç bilgileri.",
    modules: [
      {
        title: "Buoyage",
        desc: "Şamandıralar ve deniz işaretleri sistemi.",
        href: "/guide/buoyage",
        icon: Anchor,
      },
      {
        title: "Cardinal İşaretler",
        desc: "Kardinal şamandıralar ve güvenli geçiş.",
        href: "/guide/cardinals",
        icon: Compass,
      },
      {
        title: "Sound Signals",
        desc: "Ses işaretleri ve manevra kuralları.",
        href: "/guide/sound-signals",
        icon: Bell,
      },
      {
        title: "Night Lights",
        desc: "Fenerler, ışık karakterleri ve tanıma.",
        href: "/guide/night-lights",
        icon: Siren,
      },
    ],
  },

  {
    level: "YYE 2",
    title: "Seyir Temelleri",
    desc: "Harita, rota ve mevkibulma yöntemleri.",
    modules: [
      {
        title: "Navigation",
        desc: "Temel seyir bilgileri ve prensipler.",
        href: "/guide/navigation",
        icon: Compass,
      },
      {
        title: "Formüller",
        desc: "Seyir hesaplamaları ve formüller.",
        href: "/guide/navigation/formulas",
        icon: Calculator,
      },
      {
        title: "Passage Planning",
        desc: "Rota planlama ve geçiş planı oluşturma.",
        href: "/guide/navigation/passage-planning",
        icon: Map,
      },
      {
        title: "DR / EP / FIX",
        desc: "DR, EP, Fix hesaplama ve plotting eğitimi.",
        href: "/guide/navigation/dr-ep-fix",
        icon: Gauge,
      },
    ],
  },

  {
    level: "YYE 3",
    title: "Elektronik Seyir",
    desc: "Elektronik seyir sistemleri ve radar teknolojileri.",
    modules: [
      {
        title: "Radar",
        desc: "Radar kullanımı ve temel radar eğitimi.",
        href: "/guide/radar",
        icon: Radar,
      },
      {
        title: "AIS Engine",
        desc: "AIS sistemi kullanımı ve hedef takibi.",
        href: "/guide/ais-engine",
        icon: Radio,
      },
      {
        title: "ECDIS",
        desc: "Elektronik harita kullanımı.",
        href: "/guide/ecdis",
        icon: Map,
      },
      {
        title: "Autopilot",
        desc: "Otomatik dümenleme sistemleri.",
        href: "/guide/autopilot",
        icon: ShipWheel,
      },
      {
        title: "Bridge Dashboard",
        desc: "Köprüüstü izleme ve kontrol paneli.",
        href: "/guide/bridge-dashboard",
        icon: Brain,
      },
    ],
  },

  {
    level: "YYE 4",
    title: "Profesyonel Köprüüstü",
    desc: "Çevresel etkiler, risk analizi ve COLREG kararları.",
    modules: [
      {
        title: "Tidal Stream",
        desc: "Akıntı, set ve drift hesaplamaları.",
        href: "/guide/navigation/tidal-stream",
        icon: Waves,
      },
      {
        title: "Wind + Current",
        desc: "Rüzgar ve akıntı birlikte vektör hesaplamaları.",
        href: "/guide/navigation/wind-current",
        icon: Wind,
      },
      {
        title: "CPA / TCPA",
        desc: "Radar plotting, CPA ve TCPA eğitimi.",
        href: "/guide/navigation/radar",
        icon: Radar,
      },
      {
        title: "COLREG",
        desc: "Çatışmayı önleme kuralları.",
        href: "/guide/colreg",
        icon: Shield,
      },
      {
        title: "COLREG Engine",
        desc: "COLREG karar motoru ve senaryo çözümleyici.",
        href: "/guide/colreg-engine",
        icon: Brain,
      },
    ],
  },

  {
    level: "YYE 5",
    title: "İleri Bridge Systems",
    desc: "İleri seviye bridge sistemleri ve profesyonel uygulamalar.",
    modules: [
      {
        title: "GMDSS",
        desc: "GMDSS iletişim ve acil durum prosedürleri.",
        href: "/guide/gmdss",
        icon: Radio,
      },
      {
        title: "Bridge AI",
        desc: "Yapay zeka destekli köprüüstü sistemleri.",
        href: "/guide/bridge-alerts",
        icon: Brain,
      },
      {
        title: "Advanced Planning",
        desc: "İleri geçiş planlama metodları.",
        href: "/guide/passage-planning",
        icon: Map,
      },
      {
        title: "Watchkeeping",
        desc: "Vardiya tutma ve gözetçilik prensipleri.",
        href: "/guide/bridge-dashboard",
        icon: Compass,
      },
      {
        title: "Emergency",
        desc: "Acil durum yönetimi ve prosedürler.",
        href: "/guide/gmdss",
        icon: Siren,
      },
    ],
  },
];