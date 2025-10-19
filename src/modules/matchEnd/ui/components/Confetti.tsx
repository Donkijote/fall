import { motion } from "framer-motion";
import { type FC, useEffect, useState } from "react";

import type { ConfettiSide } from "@/modules/matchEnd/entities/types";

export const ConfettiController: FC<{ active: boolean }> = ({ active }) => {
  const [side, setSide] = useState<ConfettiSide>("left");
  const [burstId, setBurstId] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setSide((s) => (s === "left" ? "right" : "left"));
      setBurstId((n) => n + 1);
    }, 1700);
    return () => clearInterval(id);
  }, [active]);

  if (!active) return null;
  return (
    <div
      aria-hidden
      className="inset-0 pointer-events-none absolute overflow-hidden"
    >
      <ConfettiBurst
        key={`${side}-${burstId}`}
        side={side}
        seed={burstId}
        count={28}
      />
    </div>
  );
};

const ConfettiBurst: FC<{
  side: ConfettiSide;
  seed: number;
  count?: number;
}> = ({ side, seed, count = 28 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <ConfettiPiece key={i} index={i} side={side} seed={seed} />
    ))}
  </>
);

const ConfettiPiece: FC<{
  index: number;
  side: ConfettiSide;
  seed: number;
}> = ({ index, side, seed }) => {
  const pr = (n: number) => {
    const x = Math.sin((n + seed * 17) * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const startX = side === "left" ? pr(index) * 12 : 92 + pr(index) * 4;
  const endX = pr(index + 1) * 100;
  const duration = 1.4 + pr(index + 3) * 0.8;
  const delay = pr(index + 4) * 0.1;
  const rotate = Math.floor(pr(index + 5) * 360);
  const spin = rotate + (side === "left" ? 180 : -180);
  const size = 6 + Math.floor(pr(index + 6) * 10);
  const hues = [
    "bg-accent-gold",
    "bg-accent-green",
    "bg-accent-blue",
    "bg-accent-red",
  ];
  const hue = hues[index % hues.length];
  const startTop = -10;
  const endTop = 110;

  return (
    <motion.span
      initial={{ left: `${startX}%`, top: `${startTop}%`, opacity: 1 }}
      animate={{
        left: [`${startX}%`, `${endX}%`],
        top: [`${startTop}%`, `${endTop}%`],
        opacity: [1, 1, 0.25],
        rotate: [rotate, spin],
      }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={`absolute block ${hue}`}
      style={{ width: size, height: size, borderRadius: 2 }}
      data-testid={`burst-${side}-${seed}`}
      data-side={side}
      data-seed={String(seed)}
    />
  );
};
