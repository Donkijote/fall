import gsap from "gsap";
import { useRef } from "react";

import table from "@/assets/icons/round-table.svg";
import hands from "@/assets/lobby/card-hall/icons/card-pick.svg";
import parchment from "@/assets/lobby/tavern-match/opening-preview.webp";
import tile from "@/assets/lobby/tavern-match/score-ivory-tile.webp";
import arrow from "@/assets/login/icons/plain-arrow.svg";
import { BronzeArrow } from "@/components/dividers/BronzeArrow";
import { Icon } from "@/components/icons/Icon";
import type { DealOrder, TablePattern } from "@/domain/entities/GameState";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

function PreviewHeading({ children }: { children: string }) {
  return (
    <p className="flex min-w-0 items-center justify-center gap-2 title-type text-sm compact-landscape:text-xs">
      <BronzeArrow tone="faded" className="h-0.5 min-w-0 flex-1 opacity-60" />
      <span className="shrink-0">{children}</span>
      <BronzeArrow tone="faded" direction="left" className="h-0.5 min-w-0 flex-1 opacity-60" />
    </p>
  );
}

export function OpeningDealPreview({
  order,
  pattern,
}: {
  order: DealOrder;
  pattern: TablePattern;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const previous = useRef(new Map<string, { x: number; y: number }>());
  const reducedMotion = useReducedMotion();
  const destinations = order === "playersThenTable" ? ["hands", "table"] : ["table", "hands"];
  const ranks = pattern === "inc" ? [1, 2, 3, 4] : [4, 3, 2, 1];

  useGSAP(
    () => {
      const next = new Map<string, { x: number; y: number }>();
      scope.current?.querySelectorAll<HTMLElement>("[data-deal-preview-piece]").forEach((piece) => {
        const key = piece.dataset.dealPreviewPiece!;
        const { offsetLeft: x, offsetTop: y } = piece;
        const before = previous.current.get(key);
        next.set(key, { x, y });
        if (!reducedMotion && before && (before.x !== x || before.y !== y)) {
          gsap.fromTo(
            piece,
            { x: before.x - x, y: before.y - y, scale: 0.94 },
            { x: 0, y: 0, scale: 1, duration: 0.48, ease: "power3.inOut" },
          );
        }
      });
      previous.current = next;
    },
    { scope, dependencies: [order, pattern, reducedMotion], revertOnUpdate: true },
  );

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="relative isolate grid min-w-0 content-center gap-3 px-4 py-4 text-artwork-shadow compact-landscape:gap-2 compact-landscape:px-3 compact-landscape:py-3"
    >
      <img
        src={parchment}
        alt=""
        className="pointer-events-none absolute inset-0 -z-10 size-full"
      />
      <PreviewHeading>Deal order</PreviewHeading>
      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        {destinations.map((destination, index) => (
          <div
            key={destination}
            data-deal-preview-piece={destination}
            className="relative row-start-1 grid justify-items-center gap-1"
            style={{ gridColumn: index === 0 ? 1 : 3 }}
          >
            <Icon
              icon={destination === "hands" ? hands : table}
              className="h-9 w-12 bg-artwork-shadow compact-landscape:h-7 compact-landscape:w-10"
            />
            <span className="text-xs font-semibold">
              {destination === "hands" ? "Hands" : "Table"}
            </span>
          </div>
        ))}
        <Icon
          icon={arrow}
          className="col-start-2 row-start-1 h-5 w-6 -rotate-90 self-center bg-artwork-shadow"
        />
      </div>
      <PreviewHeading>Bonus target</PreviewHeading>
      <div className="relative grid grid-cols-4 gap-1.5">
        {ranks.map((rank) => (
          <span
            key={rank}
            data-deal-preview-piece={String(rank)}
            className="relative isolate grid aspect-[7/6] place-items-center font-[family-name:Times_New_Roman,Times,serif] text-[1.75rem] leading-none lining-nums tabular-nums compact-landscape:text-2xl"
          >
            <img
              src={tile}
              alt=""
              className="absolute inset-0 -z-10 size-full drop-shadow-[0_2px_1px_color-mix(in_oklch,var(--artwork-shadow)_35%,transparent)]"
            />
            {rank}
          </span>
        ))}
      </div>
    </div>
  );
}
