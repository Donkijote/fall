import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

import { ActionButton } from "@/components";
import { HallReturnAction } from "@/components/navigation/HallReturnAction";

import { useGuideReturn } from "../../../adapters/useGuideReturn";

export function ReferenceHeader() {
  const guideReturn = useGuideReturn();
  return (
    <header className="mb-4 sm:mb-6">
      {guideReturn ? (
        <ActionButton
          tone="quiet"
          className="text-artwork-foreground hover:bg-transparent hover:text-gold dark:hover:bg-transparent"
          render={<Link {...guideReturn} replace />}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to How to play
        </ActionButton>
      ) : (
        <HallReturnAction overArtwork />
      )}
      <h1 className="mt-2 font-heading text-[clamp(1.8rem,4vw,3.8rem)] leading-tight font-bold text-artwork-foreground uppercase [text-shadow:0_2px_5px_var(--artwork-shadow)]">
        Sings reference
      </h1>
    </header>
  );
}
