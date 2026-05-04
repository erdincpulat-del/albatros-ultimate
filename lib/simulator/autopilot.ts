export function autopilotStep(
  heading: number,
  windDir: number,
  apparentAngle: number
) {
  // no-go zone kaçışı
  if (apparentAngle < 35) {
    return windDir + 50;
  }

  // optimum VMG
  if (apparentAngle < 70) {
    return windDir + 45;
  }

  // downwind optimizasyon
  if (apparentAngle > 140) {
    return windDir + 160;
  }

  return heading;
}