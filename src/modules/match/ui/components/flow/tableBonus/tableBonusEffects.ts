/** Mutable presentation channels shared by the GSAP owner and decorative renderer. */
export function createTableBonusEffects() {
  return Array.from({ length: 4 }, () => ({
    stage: 0,
    flame: { current: { value: 0 } },
    ignition: { current: { value: 0 } },
    heat: { current: { strength: { value: 0 }, time: { value: 0 } } },
  }));
}

export type TableBonusEffects = ReturnType<typeof createTableBonusEffects>;
