import { cn } from "cn";
import type { ComponentProps } from "react";

import plaque from "@/assets/lobby/tavern-match/clean-table-plaque.webp";

import "./AwardPlaque.css";

import { PointsBadge } from "@/components/cards/PointsBadge";

/** Shared illustrated bonus surface; the feature owns placement and motion. */
export function AwardPlaque({
  title,
  points,
  glintKind,
  badgeClassName,
  titleClassName,
  perfectEffects = false,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children" | "title"> & {
  title: string;
  points: number | string;
  glintKind?: "clean";
  titleClassName?: string;
  perfectEffects?: boolean;
  badgeClassName?: string;
}) {
  return (
    <div
      {...props}
      className={cn(
        "relative isolate aspect-[3/2] w-[min(22rem,70cqw,78cqh)] opacity-0",
        className,
      )}
    >
      <img
        src={plaque}
        alt=""
        loading="eager"
        decoding="async"
        className="pointer-events-none absolute inset-0 -z-10 size-full object-contain"
      />
      <h3
        className={cn(
          "absolute top-[33%] left-1/2 -translate-1/2 artwork-title text-xl whitespace-nowrap sm:text-2xl",
          titleClassName,
        )}
      >
        {title}
      </h3>
      {perfectEffects && (
        <>
          <span className="award-plaque-shine pointer-events-none absolute inset-0 overflow-hidden">
            <span
              data-perfect-artwork-shine
              className="absolute inset-y-0 left-1/4 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-artwork-foreground/80 to-transparent opacity-0"
            />
          </span>
          {Array.from({ length: 16 }, (_, index) => (
            <span
              key={index}
              data-perfect-particle
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 size-1.5 rounded-full bg-gold opacity-0 sm:size-2"
            >
              <span className="absolute inset-[25%] rounded-full bg-artwork-foreground" />
            </span>
          ))}
        </>
      )}
      <div data-award-coin className="absolute top-[60%] left-1/2 -translate-1/2">
        <PointsBadge points={points} className={cn("size-14 sm:size-16", badgeClassName)} />
        {glintKind &&
          (["-left-5", "-right-5"] as const).map((position) => (
            <span
              key={position}
              {...{ [`data-${glintKind}-glint`]: "" }}
              className={cn(
                "absolute top-1/2 size-2.5 -translate-y-1/2 bg-gold opacity-0 shadow-[0_0_12px_var(--gold)]",
                position,
              )}
            >
              <span className="absolute inset-[2px] bg-artwork-foreground/90" />
            </span>
          ))}
      </div>
    </div>
  );
}
