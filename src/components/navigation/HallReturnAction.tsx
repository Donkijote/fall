import { cn } from "cn";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

import { ActionButton } from "@/components";
import type { ActionButtonProps } from "@/components/actions/ActionButton";
import { HOME_PATH } from "@/routes/Routes";

type HallReturnActionProps = Pick<ActionButtonProps, "className" | "render"> & {
  overArtwork?: boolean;
};

export function HallReturnAction({
  overArtwork = false,
  className,
  render,
}: HallReturnActionProps) {
  return (
    <ActionButton
      tone="quiet"
      framed={false}
      className={cn(
        "hover:bg-transparent dark:hover:bg-transparent",
        overArtwork && "text-artwork-foreground hover:text-gold",
        className,
      )}
      render={render ?? <Link to={HOME_PATH} state={{ focusHelp: true }} />}
    >
      <ArrowLeft aria-hidden="true" className="size-4" />
      <span data-hall-return-label="">Back to Hall</span>
    </ActionButton>
  );
}
