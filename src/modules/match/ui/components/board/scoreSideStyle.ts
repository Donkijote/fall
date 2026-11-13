const sideStyles = {
  "1": { name: "Blue", plate: "from-sky-800 to-sky-950" },
  "2": { name: "Red", plate: "from-red-800 to-red-950" },
  "3": { name: "Green", plate: "from-emerald-800 to-emerald-950" },
};

export function scoreSideStyle(side: string) {
  return sideStyles[side as keyof typeof sideStyles];
}
