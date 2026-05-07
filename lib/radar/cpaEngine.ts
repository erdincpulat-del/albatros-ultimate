export type RadarVector = {
  x: number;
  y: number;
  courseDeg: number;
  speedKn: number;
};

export function calculateCPA(own: RadarVector, target: RadarVector) {
  const degToRad = (deg: number) => (deg * Math.PI) / 180;

  const ownVx = Math.sin(degToRad(own.courseDeg)) * own.speedKn;
  const ownVy = -Math.cos(degToRad(own.courseDeg)) * own.speedKn;

  const targetVx = Math.sin(degToRad(target.courseDeg)) * target.speedKn;
  const targetVy = -Math.cos(degToRad(target.courseDeg)) * target.speedKn;

  const rx = target.x - own.x;
  const ry = target.y - own.y;

  const vx = targetVx - ownVx;
  const vy = targetVy - ownVy;

  const v2 = vx * vx + vy * vy;

  if (v2 === 0) {
    return {
      cpaDistance: Math.sqrt(rx * rx + ry * ry),
      tcpaMinutes: 0,
      risk: "LOW" as const,
    };
  }

  const tcpaHours = -((rx * vx + ry * vy) / v2);
  const cpaX = rx + vx * tcpaHours;
  const cpaY = ry + vy * tcpaHours;
  const cpaDistance = Math.sqrt(cpaX * cpaX + cpaY * cpaY);
  const tcpaMinutes = tcpaHours * 60;

  const risk =
    cpaDistance < 0.3 && tcpaMinutes > 0 && tcpaMinutes < 15
      ? "HIGH"
      : cpaDistance < 0.8 && tcpaMinutes > 0 && tcpaMinutes < 25
      ? "MEDIUM"
      : "LOW";

  return {
    cpaDistance,
    tcpaMinutes,
    risk,
  };
}