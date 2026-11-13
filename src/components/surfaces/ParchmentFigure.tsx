import { useId, type ReactNode } from "react";

import { ArrowDivider } from "../dividers/ArrowDivider";

export function ParchmentFigure({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: ReactNode;
}) {
  const id = useId();
  const grain = `${id}-paper-grain`;
  return (
    <figure
      aria-labelledby={id}
      className="relative isolate overflow-hidden rounded-md border border-amber-900/25 bg-artwork-foreground bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--color-amber-50)_62%,transparent),transparent_78%),linear-gradient(110deg,color-mix(in_oklch,var(--color-amber-300)_35%,transparent),transparent_44%,color-mix(in_oklch,var(--color-amber-300)_35%,transparent))] p-4 text-center text-artwork-shadow inset-shadow-sm inset-shadow-amber-900/20 sm:p-5"
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 size-full opacity-20 mix-blend-multiply"
      >
        <filter id={grain}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.48"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grain})`} />
      </svg>
      <ArrowDivider className="mx-auto mb-5 max-w-2xl justify-center text-center">
        <span className="title-type text-lg uppercase sm:text-xl">{title}</span>
      </ArrowDivider>
      {children}
      <figcaption id={id} className="mt-5 text-sm leading-relaxed italic sm:text-base">
        {caption}
      </figcaption>
    </figure>
  );
}
