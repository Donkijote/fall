import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

import { ActionButton } from "@/components";
import { HOME_PATH } from "@/routes/Routes";

export function HallReturnAction({ overArtwork = false }: { overArtwork?: boolean }) {
  return (
    <ActionButton
      tone="quiet"
      className={
        overArtwork
          ? "text-artwork-foreground hover:bg-transparent hover:text-gold dark:hover:bg-transparent"
          : "hover:bg-transparent dark:hover:bg-transparent"
      }
      render={<Link to={HOME_PATH} state={{ focusHelp: true }} />}
    >
      <ArrowLeft aria-hidden="true" className="size-4" />
      Back to Hall
    </ActionButton>
  );
}
