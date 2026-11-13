import { cn } from "cn";

import { ActionButton, type ActionButtonProps } from "@/components/actions/ActionButton";

export function TavernOverlayAction({ tone = "primary", className, ...props }: ActionButtonProps) {
  return (
    <ActionButton
      {...props}
      tone={tone}
      className={cn(
        "title-type relative min-h-11 font-normal",
        tone === "primary" &&
          "border-gold/80 inset-ring-1 inset-ring-gold/35 shadow-md shadow-artwork-shadow/50",
        tone === "outline" && "border-current/45 bg-transparent inset-ring-1 inset-ring-current/15",
        className,
      )}
    />
  );
}
