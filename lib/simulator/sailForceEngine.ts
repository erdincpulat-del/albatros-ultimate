import { clamp } from "../utils/clamp";

export function calculateSailForce(
  apparentWindAngle: number,
  sailTrim: number
) {
  const diff = Math.abs(apparentWindAngle - sailTrim);

  const efficiency = Math.cos((diff * Math.PI) / 180);

  const lift = clamp(efficiency, 0, 1);
  const drag = 1 - lift;

  return {
    lift,
    drag,
    power: lift * (1 - drag),
  };
}