import type { SeaStateData } from "./types";

export function getSeaState(speedKnots: number): SeaStateData {
  if (speedKnots < 1) {
    return {
      label: "Mirror Calm",
      detail: "Yüzey neredeyse düz ve ayna etkisindedir.",
      trainingView: "Rüzgâr okuma zayıf, yön farkındalığı sınırlıdır.",
    };
  }

  if (speedKnots <= 3) {
    return {
      label: "Ripples",
      detail: "Küçük yüzey kırışıklıkları görülür.",
      trainingView: "Yeni başlayanlara görsel yön farkındalığı kazandırır.",
    };
  }

  if (speedKnots <= 6) {
    return {
      label: "Small Ripple Lines",
      detail: "Yüzeyde daha kararlı ince çizgiler ve hafif hareket oluşur.",
      trainingView: "Temel rüzgâr okuma için kontrollü bir ortam sunar.",
    };
  }

  if (speedKnots <= 10) {
    return {
      label: "Wavelets",
      detail: "Küçük dalgacıklar görünür, akış karakteri daha nettir.",
      trainingView: "Başlangıç-orta seviye eğitim için uygun aralık.",
    };
  }

  if (speedKnots <= 16) {
    return {
      label: "Small Waves",
      detail: "Kısa ve düzenli küçük dalgalar belirgindir.",
      trainingView: "Gerçek trim, dümen ve denge hissi gelişir.",
    };
  }

  if (speedKnots <= 21) {
    return {
      label: "Moderate Waves",
      detail: "Daha belirgin yüzey formu ve artan tekne etkisi oluşur.",
      trainingView: "Orta-ileri seviye eğitim ve karar pratiği için güçlü bant.",
    };
  }

  if (speedKnots <= 27) {
    return {
      label: "Whitecaps",
      detail: "Beyaz köpükler görünür, rüzgâr artık ciddi karakter kazanır.",
      trainingView: "Yeni başlayanlar için sınırlı, deneyimli eğitim için dikkatli uygunluk.",
    };
  }

  return {
    label: "Heavy Sea / Spray",
    detail: "Ağır yüzey hareketi, köpük ve spray etkisi belirginleşir.",
    trainingView: "Eğitim değil, emniyet ve operasyon önceliklidir.",
  };
}