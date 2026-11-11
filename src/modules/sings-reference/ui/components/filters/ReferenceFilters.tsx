import { Search } from "lucide-react";
import type { Ref } from "react";

import { SelectPanel, SelectTrigger, TextInput } from "@/components";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectValue } from "@/components/ui/select";

import { minimumPointChoices, type SingsFilters } from "../../../application/singsCatalog";

const pointOptions = [
  { value: "any", label: "Any points" },
  ...minimumPointChoices.map((points) => ({ value: String(points), label: `≥ ${points}` })),
];

export function ReferenceFilters({
  filters,
  onChange,
  searchRef,
}: {
  filters: SingsFilters;
  onChange: (filters: SingsFilters) => void;
  searchRef: Ref<HTMLInputElement>;
}) {
  return (
    <form
      role="search"
      aria-label="Filter combinations"
      className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-3 gap-y-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-x-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="col-span-full grid gap-2 sm:col-span-1">
        <Label htmlFor="search-sings">Search combinations</Label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-3.5 left-3 size-4 text-muted-foreground"
          />
          <TextInput
            ref={searchRef}
            id="search-sings"
            type="search"
            placeholder="Try “pair” or “run”"
            value={filters.query}
            onChange={(event) => onChange({ ...filters, query: event.target.value })}
            className="min-h-11 bg-background pl-10"
          />
        </div>
      </div>
      <div className="grid justify-items-start gap-2">
        <Label htmlFor="filter-min-points">Minimum points</Label>
        <Select
          items={pointOptions}
          value={String(filters.minPoints ?? "any")}
          onValueChange={(value) =>
            onChange({ ...filters, minPoints: value && value !== "any" ? Number(value) : null })
          }
        >
          <SelectTrigger id="filter-min-points" className="min-h-11 min-w-28 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectPanel align="start" alignItemWithTrigger={false}>
            {pointOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectPanel>
        </Select>
      </div>
      <Label className="min-h-11 cursor-pointer pr-1" htmlFor="only-mandatory">
        <Checkbox
          id="only-mandatory"
          checked={filters.onlyMandatory}
          onCheckedChange={(onlyMandatory) => onChange({ ...filters, onlyMandatory })}
          className="transition-none"
        />
        Mandatory only
      </Label>
    </form>
  );
}
