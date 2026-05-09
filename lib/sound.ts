export function playHorn(type: "short" | "long" | "distress") {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.type = "sine";

  if (type === "short") {
    oscillator.frequency.value = 600;
    gain.gain.value = 0.3;
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.3);
  }

  if (type === "long") {
    oscillator.frequency.value = 400;
    gain.gain.value = 0.4;
    oscillator.start();
    oscillator.stop(ctx.currentTime + 1.2);
  }

  if (type === "distress") {
    oscillator.frequency.value = 800;
    gain.gain.value = 0.5;
    oscillator.start();
    oscillator.stop(ctx.currentTime + 2);
  }
}