import type { CompassInfo, RelativeWindType } from "./types";

const CARDINALS = [
  { label: "N", min: 337.5, max: 360 },
  { label: "N", min: 0, max: 22.5 },
  { label: "NE", min: 22.5, max: 67.5 },
  { label: "E", min: 67.5, max: 112.5 },
  { label: "SE", min: 112.5, max: 157.5 },
  { label: "S", min: 157.5, max: 202.5 },
  { label: "SW", min: 202.5, max: 247.5 },
  { label: "W", min: 247.5, max: 292.5 },
  { label: "NW", min: 292.5, max: 337.5 },
];

export function normalizeDegrees(value: number): number {
  const result = value % 360;
  return result < 0 ? result + 360 : result;
}

export function getCardinalLabel(directionDeg: number): string {
  const deg = normalizeDegrees(directionDeg);
  const found = CARDINALS.find((item) => deg >= item.min && deg < item.max);
  return found?.label ?? "N";
}

/**
 * Varsayılan tekne başı 000° kabul edilmiştir.
 * Sonra istersek tekne heading state'i de ekleyebiliriz.
 */
export function getRelativeWindType(directionDeg: number): RelativeWindType {
  const deg = normalizeDegrees(directionDeg);

  if (deg >= 337.5 || deg < 22.5) return "headwind";
  if (deg >= 22.5 && deg < 67.5) return "starboardBow";
  if (deg >= 67.5 && deg < 112.5) return "starboardBeam";
  if (deg >= 112.5 && deg < 157.5) return "starboardQuarter";
  if (deg >= 157.5 && deg < 202.5) return "following";
  if (deg >= 202.5 && deg < 247.5) return "portQuarter";
  if (deg >= 247.5 && deg < 292.5) return "portBeam";
  return "portBow";
}

export function getDirectionLabel(directionDeg: number): string {
  return `${Math.round(normalizeDegrees(directionDeg))}°`;
}

export function getCompassInfo(directionDeg: number): CompassInfo {
  return {
    directionLabel: getDirectionLabel(directionDeg),
    cardinalLabel: getCardinalLabel(directionDeg),
    relativeWind: getRelativeWindType(directionDeg),
  };
}