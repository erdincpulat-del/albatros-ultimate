export function calculateCurrentOffset(
  currentDirection: number,
  currentStrength: number
) {
  const rad = (currentDirection * Math.PI) / 180;

  return {
    x: Math.cos(rad) * currentStrength,
    y: Math.sin(rad) * currentStrength,
  };
}