export function calculateApparentWind(
  trueWindDir: number,
  boatHeading: number,
  boatSpeed: number
) {
  const rad = (deg: number) => (deg * Math.PI) / 180;

  const twX = Math.cos(rad(trueWindDir));
  const twY = Math.sin(rad(trueWindDir));

  const boatX = Math.cos(rad(boatHeading)) * boatSpeed * 0.3;
  const boatY = Math.sin(rad(boatHeading)) * boatSpeed * 0.3;

  const ax = twX - boatX;
  const ay = twY - boatY;

  const angle = Math.atan2(ay, ax) * (180 / Math.PI);
  const speed = Math.sqrt(ax * ax + ay * ay) * 20;

  return {
    direction: (angle + 360) % 360,
    speed,
  };
}