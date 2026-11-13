import { cn } from "cn";
import gsap from "gsap";
import { useImperativeHandle, useRef, useState, type ComponentProps, type ReactNode } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

import "./SelectField.css";

type SelectFieldProps<Value extends string> = Omit<
  ComponentProps<typeof Select<Value>>,
  "children" | "items"
> & {
  options: readonly { value: Value; label: ReactNode; disabled?: boolean }[];
  triggerProps?: Omit<ComponentProps<typeof SelectTrigger>, "children">;
  panelProps?: Omit<ComponentProps<typeof SelectContent>, "children">;
};

export function SelectField<Value extends string>({
  options,
  triggerProps,
  panelProps,
  ...props
}: SelectFieldProps<Value>) {
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  const expanded = props.open ?? open;
  const trigger = useRef<HTMLButtonElement>(null);
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  useImperativeHandle(triggerProps?.ref, () => trigger.current!);
  useImperativeHandle(panelProps?.ref, () => panel!, [panel]);

  useGSAP(
    () => {
      const element = trigger.current;
      if (!element) return;
      if (reducedMotion) {
        gsap.killTweensOf(element, "--select-chevron-turn");
        element.style.removeProperty("--select-chevron-turn");
        return;
      }
      gsap.to(element, {
        "--select-chevron-turn": expanded ? 180 : 0,
        duration: 0.22,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
    { dependencies: [expanded, reducedMotion] },
  );

  useGSAP(
    (context) => {
      if (!panel || reducedMotion || !expanded) return;
      gsap.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" });
      const options = Array.from(panel.querySelectorAll<HTMLElement>(".select-field-option"));
      const updateHighlight = new Map(
        options.map((option) => {
          const highlighted = () =>
            Number(option.matches("[data-highlighted]:not([data-disabled])"));
          gsap.set(option, { "--select-wax-lift": highlighted() });
          const lift = gsap.quickTo(option, "--select-wax-lift", {
            duration: 0.2,
            ease: "power2.out",
          });
          return [option, () => lift(highlighted())] as const;
        }),
      );
      const observer = new MutationObserver((records) => {
        context.add(() => {
          records.forEach(({ target }) => updateHighlight.get(target as HTMLElement)?.());
        });
      });
      observer.observe(panel, { subtree: true, attributeFilter: ["data-highlighted"] });
      return () => observer.disconnect();
    },
    { dependencies: [panel, expanded, reducedMotion], revertOnUpdate: true },
  );

  return (
    <Select<Value>
      {...props}
      items={options}
      onOpenChange={(next, details) => {
        props.onOpenChange?.(next, details);
        if (!details.isCanceled) setOpen(next);
      }}
    >
      <SelectTrigger
        {...triggerProps}
        ref={trigger}
        className={cn(
          "select-field-trigger relative isolate min-h-11 gap-3 rounded-md border-transparent bg-transparent px-3 text-artwork-foreground transition-none data-placeholder:text-artwork-foreground/70 [&_[data-slot=select-value]]:min-w-0",
          triggerProps?.className,
        )}
      >
        <SelectValue />
        <span aria-hidden="true" className="select-field-chevron size-2 shrink-0" />
      </SelectTrigger>
      <SelectContent
        {...panelProps}
        ref={setPanel}
        className={cn(
          "select-field-panel rounded-md border border-gold/60 bg-popover p-1.5 text-popover-foreground shadow-lg ring-1 shadow-artwork-shadow/40 ring-artwork-shadow/25 data-open:animate-none data-closed:animate-none",
          panelProps?.className,
        )}
      >
        {options.map(({ value, label, disabled }) => (
          <SelectItem
            key={value}
            value={value}
            disabled={disabled}
            className="select-field-option relative isolate min-h-10 rounded-md transition-none focus:bg-transparent focus:text-popover-foreground data-selected:text-primary-foreground data-selected:focus:text-primary-foreground data-selected:focus:**:text-primary-foreground"
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
