export function getWaveMotion(time: number, speed: number) {
  const wave1 = Math.sin(time * 0.001 + speed) * 2;
  const wave2 = Math.sin(time * 0.002 + speed * 0.5) * 1.5;

  return wave1 + wave2;
}