import gsap from "gsap";
import { useRef } from "react";

import { useGSAP } from "@gsap/react";

const embers = [
  { delay: 0, x: -16, y: -44, duration: 1.1 },
  { delay: 0.14, x: 6, y: -32, duration: 0.8 },
  { delay: 0.34, x: -28, y: -68, duration: 1.4 },
  { delay: 2.8, x: -11, y: -55, duration: 1.2 },
  { delay: 3.04, x: 12, y: -39, duration: 0.95 },
];

export function TavernEmbers() {
  const source = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const sparks = source.current?.children;
      if (!sparks) return;

      const burst = gsap.timeline({ repeat: -1, repeatDelay: 2.4, delay: 0.65 });
      embers.forEach(({ delay, x, y, duration }, index) => {
        const spark = sparks[index];
        burst
          .fromTo(
            spark,
            { x: 0, y: 0, scale: 0.75 },
            { x, y, scale: 0.25, duration, ease: "power1.out" },
            delay,
          )
          .to(spark, { opacity: 0.95, duration: 0.13 }, delay)
          .to(spark, { opacity: 0, duration: duration - 0.13, ease: "sine.in" }, delay + 0.13);
      });
    },
    { scope: source },
  );

  return (
    <div
      ref={source}
      className="absolute top-[59%] left-[95.5%] portrait:top-[47%] portrait:left-[95%]"
    >
      {embers.map(({ delay }, index) => (
        <span
          key={delay}
          className={`absolute rounded-full bg-amber-200 opacity-0 shadow-[0_0_5px_var(--color-orange-400)] ${index % 3 === 0 ? "size-1" : "size-0.5"}`}
        />
      ))}
    </div>
  );
}
