import { cn } from "cn";

import artwork from "@/assets/sings-reference/combination-points.webp";

export function PointsBadge({
  points,
  label,
  className,
}: {
  points: number | string;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative isolate inline-grid size-14 shrink-0 content-center justify-items-center font-[family-name:Times_New_Roman,Times,serif] leading-none text-gold lining-nums tabular-nums @2xl:size-16",
        className,
      )}
    >
      <img src={artwork} alt="" className="pointer-events-none absolute inset-0 -z-10 size-full" />
      <span
        aria-hidden={label ? true : undefined}
        className={cn(
          "leading-[0.82]",
          String(points).length > 2 ? "text-xl" : "text-[1.7rem] @2xl:text-[1.95rem]",
        )}
      >
        {points}
      </span>
      <span aria-hidden={label ? true : undefined} className="text-xs leading-none @2xl:text-sm">
        {Number(points) === 1 ? "pt" : "pts"}
      </span>
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
