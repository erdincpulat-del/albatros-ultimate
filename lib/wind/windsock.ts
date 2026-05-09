import type { WindsockState } from "./types";

export function getWindsockState(speedKnots: number): WindsockState {
  const extensionPercent = Math.max(0, Math.min(100, (speedKnots / 15) * 100));

  let label = "Slack";
  if (speedKnots >= 3 && speedKnots < 6) label = "Initial Fill";
  else if (speedKnots >= 6 && speedKnots < 10) label = "Light Extension";
  else if (speedKnots >= 10 && speedKnots < 15) label = "Active Extension";
  else if (speedKnots >= 15) label = "Fully Extended";

  const droopPercent = Math.max(0, 100 - extensionPercent);
  const swayAmplitude =
    speedKnots < 4 ? 10 : speedKnots < 10 ? 7 : speedKnots < 18 ? 5 : 3;

  const turbulence =
    speedKnots < 8 ? 0.15 : speedKnots < 18 ? 0.28 : speedKnots < 28 ? 0.42 : 0.6;

  return {
    extensionPercent,
    droopPercent,
    swayAmplitude,
    turbulence,
    label,
  };
}