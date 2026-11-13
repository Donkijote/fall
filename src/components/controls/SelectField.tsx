import { cn } from "cn";
import type { ComponentProps, ReactNode } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return (
    <Select<Value> {...props} items={options}>
      <SelectTrigger
        {...triggerProps}
        className={cn("rounded-md transition-none", triggerProps?.className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        {...panelProps}
        className={cn(
          "rounded-md p-1 data-open:animate-none data-closed:animate-none [&_[data-slot=select-item]]:rounded-sm",
          panelProps?.className,
        )}
      >
        {options.map(({ value, label, disabled }) => (
          <SelectItem key={value} value={value} disabled={disabled}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
