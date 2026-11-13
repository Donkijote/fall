import { Search } from "lucide-react";
import type { Ref } from "react";

import { SelectField, TextInput } from "@/components";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
      className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-3 gap-y-4 @xl:grid-cols-[minmax(0,1fr)_auto_auto] @min-[28rem]:compact-landscape:grid-cols-[minmax(0,1fr)_auto_auto]"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="col-span-full grid gap-2 @xl:col-span-1 @min-[28rem]:compact-landscape:col-span-1">
        <Label className="sr-only" htmlFor="search-sings">
          Search combinations
        </Label>
        <TextInput
          ref={searchRef}
          id="search-sings"
          type="search"
          placeholder="Search Sings"
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
          leadingIcon={<Search />}
        />
      </div>
      <div className="grid justify-items-start gap-2">
        <Label className="sr-only" htmlFor="filter-min-points">
          Minimum points
        </Label>
        <SelectField
          options={pointOptions}
          value={String(filters.minPoints ?? "any")}
          onValueChange={(value) =>
            onChange({ ...filters, minPoints: value && value !== "any" ? Number(value) : null })
          }
          triggerProps={{
            id: "filter-min-points",
            className: "min-w-28",
          }}
          panelProps={{ align: "start", alignItemWithTrigger: false }}
        />
      </div>
      <Label
        className="min-h-11 cursor-pointer px-2.5 text-artwork-foreground"
        htmlFor="only-mandatory"
      >
        <Checkbox
          id="only-mandatory"
          checked={filters.onlyMandatory}
          onCheckedChange={(onlyMandatory) => onChange({ ...filters, onlyMandatory })}
          className="border-artwork-foreground/75 bg-transparent transition-none focus-visible:border-artwork-foreground focus-visible:ring-artwork-foreground/50"
        />
        Mandatory only
      </Label>
    </form>
  );
}
