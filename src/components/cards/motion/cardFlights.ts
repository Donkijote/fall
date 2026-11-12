// Timing shared by the Playground's 3D studies and the live table.
export const cardFlights = {
  deal: { hand: 0.54, table: 0.68, stagger: 0.24, ease: "power1.out" },
  play: { duration: 0.75, ease: "power1.inOut" },
  collect: { duration: 0.88 },
} as const;
