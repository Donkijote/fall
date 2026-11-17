import { cn } from "cn";
import type { ReactNode } from "react";

import horn from "@/assets/icons/hunting-horn.svg";
import sparkles from "@/assets/icons/sparkles.svg";
import scroll from "@/assets/lobby/card-hall/icons/scroll-unfurled.svg";

import { Icon } from "../icons/Icon";
import "./Callout.css";

const treatments = {
  info: { label: "Note", icon: scroll },
  tip: { label: "Tip", icon: sparkles },
  warning: { label: "Warning", icon: horn },
};

export function Callout({
  children,
  tone = "info",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof treatments;
  className?: string;
}) {
  const { label, icon } = treatments[tone];
  return (
    <div
      role="note"
      aria-label={label}
      className={cn(
        "artwork-callout relative isolate flex items-center gap-3 px-5 py-3.5 text-sm leading-relaxed text-artwork-foreground sm:px-6",
        className,
      )}
    >
      <Icon icon={icon} className="size-6 shrink-0 bg-gold" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
