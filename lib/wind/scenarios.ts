import type { Scenario } from "./types";

export const SCENARIOS: { value: Scenario; label: string; detail: string }[] = [
  {
    value: "marina",
    label: "Marina",
    detail: "Dar alanda düşük süratli yaklaşma ve ayrılma yorumu.",
  },
  {
    value: "openSea",
    label: "Open Sea",
    detail: "Açık denizde genel rüzgâr karakteri ve maruziyet farkındalığı.",
  },
  {
    value: "anchorage",
    label: "Anchorage",
    detail: "Demir yükü, salınım ve güvenli bekleme koşulları.",
  },
  {
    value: "sailTraining",
    label: "Sail Training",
    detail: "Eğitim ve yelken trim kararları için uygunluk analizi.",
  },
  {
    value: "harbourApproach",
    label: "Harbour Approach",
    detail: "Liman yaklaşması ve kontrol hassasiyeti.",
  },
  {
    value: "nightWatch",
    label: "Night Watch",
    detail: "Gece farkındalığı ve rüzgâr karakterinin izlenmesi.",
  },
];