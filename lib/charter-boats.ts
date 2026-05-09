export type PriceMap = {
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
};

export type CharterBoat = {
  id: string;
  name: string;
  model: "Monohull" | "Catamaran";
  year: number;
  cabins: number;
  guestsLabel: string;
  location: string;
  image: string;
  shortNote: string;
  description: string;
  features: string[];
  prices: PriceMap;
};

export const charterBoats: CharterBoat[] = [
  {
    id: "bali-44",
    name: "Bali 4.4",
    model: "Catamaran",
    year: 2024,
    cabins: 4,
    guestsLabel: "8+2",
    location: "Bodrum",
    image: "/images/charter/bali.jpg",
    shortNote:
      "Yeni nesil geniş yaşam alanı ve premium grup charter deneyimi.",
    description:
      "Bali 4.4, geniş yaşam alanı, modern katamaran konforu ve ferah yaşam kurgusuyla hem özel tatil planları hem de yüksek segment charter beklentileri için güçlü bir seçenektir. Geniş güverte alanı, rahat iç hacim ve stabil seyir karakteri sayesinde Bodrum çıkışlı Ege rotalarında oldukça dengeli bir deneyim sunar.",
    features: [
      "Geniş salon ve ferah yaşam alanı",
      "Aile ve grup charter planlarına uygun yapı",
      "Konfor odaklı premium katamaran deneyimi",
      "Bodrum çıkışlı uzun rota planları için uygun",
    ],
    prices: {
      may: "€6.900",
      june: "€8.400",
      july: "€10.200",
      august: "€10.400",
      september: "€8.300",
    },
  },
  {
    id: "bavaria-46",
    name: "Bavaria 46",
    model: "Monohull",
    year: 2022,
    cabins: 4,
    guestsLabel: "8+1",
    location: "Bodrum",
    image: "/images/charter/bavaria.jpg",
    shortNote:
      "Dengeli performans, rahat yerleşim ve güvenli Ege rotaları için ideal.",
    description:
      "Bavaria 46, performans ve konfor arasında dengeli bir çizgi arayanlar için güçlü bir monohull seçenektir. Geniş kokpit alanı, düzenli iç yerleşimi ve kontrollü seyir karakteri sayesinde hem haftalık charter planlarında hem de eğitim destekli denizcilik organizasyonlarında verimli şekilde kullanılabilir.",
    features: [
      "Dengeli gövde yapısı ve güven veren seyir karakteri",
      "Ege adaları ve kıyı rotaları için uygun planlama",
      "Rahat kokpit ve iç yerleşim",
      "Eğitim + charter kombinasyonlarına uygun yapı",
    ],
    prices: {
      may: "€4.500",
      june: "€5.200",
      july: "€6.400",
      august: "€6.700",
      september: "€5.100",
    },
  },
  {
    id: "oceanis-41",
    name: "Oceanis 41",
    model: "Monohull",
    year: 2016,
    cabins: 3,
    guestsLabel: "6+1",
    location: "Bodrum",
    image: "/images/charter/oceanis.jpg",
    shortNote:
      "Konfor ve pratik kullanım dengesini sevenler için modern seçenek.",
    description:
      "Oceanis 41, kolay yönetilebilen yapısı, rahat iç hacmi ve kullanıcı dostu yerleşimi ile daha kompakt ama dengeli bir charter deneyimi arayanlar için öne çıkar. Çift veya küçük grup kullanımlarında rahatlık sağlar; aynı zamanda eğitim destekli kullanım planlarında da pratik ve kontrollü bir yapı sunar.",
    features: [
      "Pratik kullanım ve dengeli sürüş karakteri",
      "Kompakt ama rahat iç yerleşim",
      "Küçük grup ve aile planlarına uygun",
      "Bodrum çıkışlı kısa ve orta rota planları için ideal",
    ],
    prices: {
      may: "€3.000",
      june: "€3.800",
      july: "€4.900",
      august: "€5.100",
      september: "€3.950",
    },
  },
  {
    id: "lagoon-42",
    name: "Lagoon 42",
    model: "Catamaran",
    year: 2021,
    cabins: 4,
    guestsLabel: "8+2",
    location: "Bodrum",
    image: "/images/charter/lagoon.jpg",
    shortNote:
      "Ferah yaşam alanı ve aile/grup planları için güçlü katamaran deneyimi.",
    description:
      "Lagoon 42, katamaran konforunu ferah yaşam alanıyla birleştiren güçlü bir charter modelidir. Geniş dış alanları, çoklu kabin yapısı ve denge avantajı sayesinde özellikle aileler, arkadaş grupları ve konfor öncelikli deniz tatilleri için etkileyici bir seçenek sunar.",
    features: [
      "Yüksek denge ve konfor hissi",
      "Aileler ve kalabalık gruplar için uygun alan yapısı",
      "Geniş güverte ve yaşam alanı",
      "Bodrum çıkışlı premium charter planları için ideal",
    ],
    prices: {
      may: "€6.200",
      june: "€7.700",
      july: "€9.400",
      august: "€9.700",
      september: "€7.350",
    },
  },
  {
    id: "sun-odyssey-45",
    name: "Sun Odyssey 45",
    model: "Monohull",
    year: 2010,
    cabins: 3,
    guestsLabel: "6+1",
    location: "Bodrum",
    image: "/images/charter/sunodyssey.jpg",
    shortNote:
      "Klasik yelken hissi ve uzun rota planları için karakterli seçim.",
    description:
      "Sun Odyssey 45, klasik yelken hissini seven ve rota odaklı denizcilik deneyimi arayanlar için karakterli bir modeldir. Uzun seyirlerde güven veren yapısı ve dengeli kullanım hissi ile charter tarafında daha bilinçli kullanıcılar için güçlü bir alternatif oluşturur.",
    features: [
      "Klasik ve güçlü monohull karakteri",
      "Uzun rota ve ada geçişleri için uygun",
      "Rota odaklı kullanıcılar için iyi his veren yapı",
      "Tatille birlikte deneyim odaklı planlamaya uygun",
    ],
    prices: {
      may: "€2.700",
      june: "€3.350",
      july: "€4.250",
      august: "€4.450",
      september: "€3.500",
    },
  },
  {
    id: "dufour-470",
    name: "Dufour 470",
    model: "Monohull",
    year: 2023,
    cabins: 4,
    guestsLabel: "8+1",
    location: "Bodrum",
    image: "/images/charter/dufour.jpg",
    shortNote:
      "Modern çizgi, yüksek konfor ve premium tatil planları için güçlü alternatif.",
    description:
      "Dufour 470, yeni nesil monohull çizgisini modern yaşam beklentileriyle birleştiren güçlü bir charter modelidir. Konforlu iç yaşamı, şık dış tasarımı ve güvenli seyir dengesiyle hem premium tatil hem de daha rafine rota planları için çok iyi bir seçenektir.",
    features: [
      "Modern tasarım ve yüksek yaşam konforu",
      "Premium segment haftalık planlara uygun",
      "Konfor ve performans dengesini iyi kuran yapı",
      "Bodrum merkezli özel rota planlamaları için güçlü alternatif",
    ],
    prices: {
      may: "€4.900",
      june: "€5.850",
      july: "€7.000",
      august: "€7.250",
      september: "€5.950",
    },
  },
];