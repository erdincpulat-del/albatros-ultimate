export function calculateSailForce(
  apparentWindAngle: number,
  sailTrim: number
) {
  const diff = Math.abs(apparentWindAngle - sailTrim);

  const efficiency = Math.cos((diff * Math.PI) / 180);

  const lift = Math.max(0, Math.pow(efficiency, 1.5)); // nonlinear
  const drag = 1 - lift;

  return {
    lift,
    drag,
    power: lift * (1 - drag),
  };
}