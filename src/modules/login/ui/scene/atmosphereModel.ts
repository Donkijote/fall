export function getCoverScale(aspect: number): [number, number] {
  return aspect >= 1 ? [1, 1 / aspect] : [aspect, 1];
}

export function createEmberSeeds(count: number): Float32Array {
  const seeds = new Float32Array(count * 3);
  let seed = 1709;
  const next = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let index = 0; index < count; index += 1) {
    seeds[index * 3] = next() - 0.5;
    seeds[index * 3 + 1] = next();
    seeds[index * 3 + 2] = next();
  }
  return seeds;
}

export function getAtmosphereQuality(compact: boolean) {
  return {
    dpr: compact ? 1 : ([1, 1.5] as [number, number]),
    distantEmbers: compact ? 52 : 104,
    nearEmbers: compact ? 28 : 56,
  };
}
