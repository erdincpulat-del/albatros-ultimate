export function getWaveMotion(time: number, speed: number) {
  const t = time * 0.001;

  const swell = Math.sin(t * 0.8) * 2.5;
  const chop = Math.sin(t * 2.5 + speed * 0.5) * 1.2;
  const micro = Math.sin(t * 6 + speed) * 0.4;

  return swell + chop + micro;
}