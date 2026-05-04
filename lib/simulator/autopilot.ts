export function autopilotStep(currentHeading: number, windDir: number) {
  const optimalAngle = (windDir + 45) % 360;

  const diff = optimalAngle - currentHeading;

  return currentHeading + diff * 0.05;
}