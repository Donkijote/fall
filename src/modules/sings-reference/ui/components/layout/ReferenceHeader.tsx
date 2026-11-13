import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { ActionButton } from "@/components";
import { HallReturnAction } from "@/components/navigation/HallReturnAction";

import { useGuideReturn } from "../../../adapters/useGuideReturn";

export function ReferenceHeader({ children }: { children: ReactNode }) {
  const guideReturn = useGuideReturn();

  return (
    <header className="relative grid items-end gap-x-6 gap-y-3 pb-4 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-linear-to-r after:from-transparent after:via-gold/80 after:to-transparent @5xl:grid-cols-[minmax(0,1fr)_minmax(30rem,0.95fr)] @5xl:pb-6 compact-landscape:gap-y-2 compact-landscape:pb-3">
      <div className="min-w-0 @min-[26rem]:compact-landscape:flex @min-[26rem]:compact-landscape:items-center @min-[26rem]:compact-landscape:gap-2">
        {guideReturn ? (
          <ActionButton
            tone="quiet"
            className="text-artwork-foreground"
            render={<Link {...guideReturn} replace />}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to How to play
          </ActionButton>
        ) : (
          <HallReturnAction overArtwork />
        )}
        <h1 className="artwork-title text-[clamp(1.65rem,3.7vw,3.5rem)] compact-landscape:text-[clamp(1.4rem,3.7vw,2.2rem)]">
          Sings reference
        </h1>
      </div>
      {children}
    </header>
  );
}
