import { Check } from "lucide-react";

import sign from "@/assets/lobby/tavern-match/waiting-sign.webp";
import chair from "@/assets/lobby/tavern-match/wooden-chair.svg";
import { Icon } from "@/components/icons/Icon";

import { TavernOverlayAction } from "./TavernOverlayAction";

export function WaitingSign({
  title,
  filled,
  total,
  returning,
  cancel,
}: {
  title: string;
  filled: number;
  total: number;
  returning: boolean;
  cancel: () => void;
}) {
  return (
    <section className="relative grid w-[min(100%,21rem)] justify-items-center gap-2 px-6 pt-12 pb-6 text-center text-artwork-foreground compact-landscape:gap-1 compact-landscape:pt-10 compact-landscape:pb-4">
      <img src={sign} alt="" className="pointer-events-none absolute inset-0 size-full" />
      <h1 className="relative artwork-title text-[clamp(1.25rem,5vmin,2rem)]">{title}</h1>
      <div className="relative grid justify-items-center gap-2 text-sm" role="status">
        <div aria-hidden="true" className="flex gap-2">
          {Array.from({ length: total }, (_, index) => (
            <span
              key={index}
              className="grid size-7 place-items-center rounded-full border border-gold/70 bg-artwork-shadow text-gold data-[filled=true]:bg-gold data-[filled=true]:text-artwork-shadow"
              data-filled={index < filled}
            >
              {index < filled ? (
                <Check className="size-4" />
              ) : (
                <Icon icon={chair} className="size-4" />
              )}
            </span>
          ))}
        </div>
        <span>
          {filled} of {total} seats filled
        </span>
      </div>
      <TavernOverlayAction
        data-tavern-cancel=""
        tone="outline"
        className="text-xs"
        onClick={cancel}
        aria-disabled={returning}
      >
        Cancel matchmaking
      </TavernOverlayAction>
    </section>
  );
}
