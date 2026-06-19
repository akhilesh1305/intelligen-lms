export function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function seededInt(seed: string, min: number, max: number): number {
  const range = max - min + 1;
  return min + (hashSeed(seed) % range);
}

export function seededFloat(seed: string, min: number, max: number): number {
  const t = (hashSeed(seed) % 10000) / 10000;
  return min + t * (max - min);
}
