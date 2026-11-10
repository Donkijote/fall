import { cn } from "cn";
import type { LucideIcon } from "lucide-react";

export function Icon({ icon: Icon, className }: { icon: string | LucideIcon; className?: string }) {
  if (typeof Icon !== "string") {
    return <Icon aria-hidden="true" className={className} />;
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block shrink-0 bg-current mask-contain mask-center mask-no-repeat",
        className,
      )}
      style={{ maskImage: `url("${Icon}")` }}
    />
  );
}
