export type AutopilotMode = "OFF" | "HEADING" | "TRACK";

export interface AutopilotState {
  mode: AutopilotMode;
  targetHeading: number; // derece
  targetTrack: number;   // derece (rota)
  rudder: number;        // -1 ile +1
}

export interface VesselState {
  heading: number;   // anlık baş
  course: number;    // COG
  speed: number;
  driftAngle: number; // akıntı + rüzgar etkisi
}

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const normalizeAngle = (angle: number) => {
  let a = angle % 360;
  if (a < 0) a += 360;
  return a;
};

const angleDiff = (target: number, current: number) => {
  let diff = target - current;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
};

/**
 * CORE AUTOPILOT ENGINE
 */
export function updateAutopilot(
  ap: AutopilotState,
  vessel: VesselState,
  dt: number
): AutopilotState {

  if (ap.mode === "OFF") {
    return { ...ap, rudder: 0 };
  }

  let target = ap.targetHeading;

  // TRACK MODE → drift correction
  if (ap.mode === "TRACK") {
    const trackError = angleDiff(ap.targetTrack, vessel.course);

    // Drift correction (çok önemli)
    const correction = vessel.driftAngle * 0.8;

    target = normalizeAngle(ap.targetTrack + correction);

    // küçük track error etkisi
    target = normalizeAngle(target + trackError * 0.3);
  }

  // Heading error
  const error = angleDiff(target, vessel.heading);

  // PID benzeri kontrol
  const Kp = 0.02;   // agresiflik
  const Kd = 0.01;   // stabilite

  const derivative = error / Math.max(dt, 0.016);

  let rudder = Kp * error + Kd * derivative;

  // sınırla
  rudder = clamp(rudder, -1, 1);

  // smoothing
  rudder = ap.rudder * 0.7 + rudder * 0.3;

  return {
    ...ap,
    rudder,
  };
}