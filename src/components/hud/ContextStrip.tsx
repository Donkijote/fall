import type { LucideIcon } from "lucide-react";

export function ContextStrip({
  icon: Icon,
  label,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  detail: string;
}) {
  return (
    <div
      className="game-context-strip flex min-w-0 items-center gap-4"
      role="group"
      aria-label={label}
    >
      <Icon className="size-8 shrink-0 stroke-[1.5]" aria-hidden="true" />
      <span className="game-context-copy grid gap-1 border-l border-border pl-4">
        <span className="game-context-label text-sm font-medium">{label}</span>
        <span className="game-context-detail text-xs text-muted-foreground">{detail}</span>
      </span>
    </div>
  );
}
