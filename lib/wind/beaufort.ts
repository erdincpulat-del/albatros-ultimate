import type { BeaufortData } from "./types";

const BEAUFORT_SCALE: BeaufortData[] = [
  {
    force: 0,
    name: "Calm",
    knotRange: "<1 kt",
    description: "Deniz yüzeyi neredeyse aynaya yakın, belirgin rüzgâr etkisi yok.",
  },
  {
    force: 1,
    name: "Light Air",
    knotRange: "1–3 kt",
    description: "Çok hafif akış, windsock ancak sınırlı hareket gösterir.",
  },
  {
    force: 2,
    name: "Light Breeze",
    knotRange: "4–6 kt",
    description: "Yüzeyde küçük ripple oluşur, yön hissedilir hale gelir.",
  },
  {
    force: 3,
    name: "Gentle Breeze",
    knotRange: "7–10 kt",
    description: "Hafif ve düzenli rüzgâr, temel eğitim için uygundur.",
  },
  {
    force: 4,
    name: "Moderate Breeze",
    knotRange: "11–16 kt",
    description: "Gerçek eğitim rüzgârı başlar, trim ve dümen etkileri netleşir.",
  },
  {
    force: 5,
    name: "Fresh Breeze",
    knotRange: "17–21 kt",
    description: "Kontrol ihtiyacı artar, manevra hataları daha belirgin olur.",
  },
  {
    force: 6,
    name: "Strong Breeze",
    knotRange: "22–27 kt",
    description: "Whitecap oluşumu başlar, azaltılmış yelken ve dikkat gerekir.",
  },
  {
    force: 7,
    name: "Near Gale",
    knotRange: "28–33 kt",
    description: "Güçlü akış, yalnızca deneyimli kullanım için uygundur.",
  },
  {
    force: 8,
    name: "Gale",
    knotRange: "34–40 kt",
    description: "Operasyonel risk belirgin şekilde yükselir.",
  },
  {
    force: 9,
    name: "Strong Gale",
    knotRange: "41–47 kt",
    description: "Ağır koşullar, eğitim modu için uygun değildir.",
  },
  {
    force: 10,
    name: "Storm",
    knotRange: "48–55 kt",
    description: "Ciddi deniz ve rüzgâr koşulları, emniyet önceliklidir.",
  },
  {
    force: 11,
    name: "Violent Storm",
    knotRange: "56–63 kt",
    description: "Ağır fırtına koşulları, çok yüksek operasyonel risk.",
  },
  {
    force: 12,
    name: "Hurricane Force",
    knotRange: "64+ kt",
    description: "Kasırga şiddeti, eğitim ve normal operasyon dışı.",
  },
];

export function getBeaufort(speedKnots: number): BeaufortData {
  if (speedKnots < 1) return BEAUFORT_SCALE[0];
  if (speedKnots <= 3) return BEAUFORT_SCALE[1];
  if (speedKnots <= 6) return BEAUFORT_SCALE[2];
  if (speedKnots <= 10) return BEAUFORT_SCALE[3];
  if (speedKnots <= 16) return BEAUFORT_SCALE[4];
  if (speedKnots <= 21) return BEAUFORT_SCALE[5];
  if (speedKnots <= 27) return BEAUFORT_SCALE[6];
  if (speedKnots <= 33) return BEAUFORT_SCALE[7];
  if (speedKnots <= 40) return BEAUFORT_SCALE[8];
  if (speedKnots <= 47) return BEAUFORT_SCALE[9];
  if (speedKnots <= 55) return BEAUFORT_SCALE[10];
  if (speedKnots <= 63) return BEAUFORT_SCALE[11];
  return BEAUFORT_SCALE[12];
}

export const BEAUFORT_SCALE_DATA = BEAUFORT_SCALE;