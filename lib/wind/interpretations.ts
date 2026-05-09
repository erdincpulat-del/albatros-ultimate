import { getBeaufort } from "./beaufort";
import { getCompassInfo } from "./compass";
import type { CaptainDecision, Scenario } from "./types";

export function getCaptainDecision(
  speedKnots: number,
  directionDeg: number,
  scenario: Scenario
): CaptainDecision {
  const beaufort = getBeaufort(speedKnots);
  const compass = getCompassInfo(directionDeg);

  const relativeTextMap: Record<string, string> = {
    headwind: "baş rüzgâr",
    portBow: "iskele baş omuzluk rüzgârı",
    starboardBow: "sancak baş omuzluk rüzgârı",
    portBeam: "iskele yan rüzgârı",
    starboardBeam: "sancak yan rüzgârı",
    portQuarter: "iskele kıç omuzluk rüzgârı",
    starboardQuarter: "sancak kıç omuzluk rüzgârı",
    following: "kıçtan rüzgâr",
  };

  let status: CaptainDecision["status"] = "Training Suitable";

  if (speedKnots >= 24) status = "Restricted";
  else if (speedKnots >= 17) status = "Advanced Handling";
  else if (speedKnots >= 11) status = "Caution";

  let summary = `${beaufort.force} Beaufort bandında, ${relativeTextMap[compass.relativeWind]} etkisiyle çalışan bir koşul.`;
  let marinaNote = "Marina içinde temel manevra yapılabilir.";
  let sailingNote = "Yelken eğitimi açısından kontrollü bir akış sunar.";
  let anchorageNote = "Demirde genel yük sınırlıdır.";

  if (scenario === "marina" || scenario === "harbourApproach") {
    marinaNote =
      speedKnots < 10
        ? "Marina içinde düşük-orta riskli kontrollü manevra ortamı."
        : speedKnots < 18
        ? "Yanaşma ve ayrılmada yan sürüklenme ile baş/kıç savrulmasına dikkat edilmeli."
        : "Dar alanda yüksek kumanda hassasiyeti gerekir; yeni başlayanlar için uygun değildir.";
  }

  if (scenario === "sailTraining") {
    sailingNote =
      speedKnots < 7
        ? "Temel yön okuma ve başlangıç trim eğitimi için uygun."
        : speedKnots < 16
        ? "Gerçek yelken eğitimi için çok verimli; dümen hissi ve trim farkları nettir."
        : speedKnots < 24
        ? "İleri seviye eğitim, reefing farkındalığı ve aktif kumanda gerektirir."
        : "Bu bant eğitimden çok güvenlik ve tekne kontrolüne odaklanır.";
  }

  if (scenario === "anchorage") {
    anchorageNote =
      speedKnots < 8
        ? "Demirde düşük yük, genel konfor iyi."
        : speedKnots < 16
        ? "Rüzgâr yükü artar, salınım ve yawing gözlenebilir."
        : "Demir yükü belirgin artar; tarama, salınım ve tender transferi dikkat ister.";
  }

  if (status === "Training Suitable") {
    summary += " Kontrollü ve öğretici bir eğitim ortamı sunar.";
  } else if (status === "Caution") {
    summary += " Eğitici değeri yüksek olsa da dikkatli kumanda ister.";
  } else if (status === "Advanced Handling") {
    summary += " Deneyim ve hızlı karar gerektiren ileri seviye bir ortamdır.";
  } else {
    summary += " Emniyet önceliklidir; başlangıç seviyesi için uygun değildir.";
  }

  return {
    status,
    summary,
    marinaNote,
    sailingNote,
    anchorageNote,
  };
}