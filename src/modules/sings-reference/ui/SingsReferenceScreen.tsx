import { useRef, useState } from "react";

import { defaultSingsFilters, filterSings } from "../application/singsCatalog";
import { ReferenceResults } from "./components/catalog/ReferenceResults";
import { ReferenceFilters } from "./components/filters/ReferenceFilters";
import { ReferenceHeader } from "./components/layout/ReferenceHeader";
import { SortingTableBackground } from "./components/layout/SortingTableBackground";

export function SingsReferenceScreen() {
  const [filters, setFilters] = useState(defaultSingsFilters);
  const searchRef = useRef<HTMLInputElement>(null);
  const reset = () => {
    setFilters(defaultSingsFilters);
    searchRef.current?.focus();
  };

  return (
    <main className="relative isolate h-dvh [scrollbar-width:none] overflow-x-hidden overflow-y-auto overscroll-contain bg-background text-foreground [&::-webkit-scrollbar]:hidden">
      <SortingTableBackground />
      <div className="@container mx-auto max-w-[100rem] pt-[calc(var(--sings-gutter)+var(--safe-area-top))] pr-[calc(var(--sings-gutter)+var(--safe-area-right))] pb-[calc(var(--sings-gutter)+var(--safe-area-bottom))] pl-[calc(var(--sings-gutter)+var(--safe-area-left))] [--sings-gutter:1rem] sm:[--sings-gutter:1.75rem] xl:[--sings-gutter:3rem]">
        <ReferenceHeader>
          <ReferenceFilters filters={filters} onChange={setFilters} searchRef={searchRef} />
        </ReferenceHeader>
        <ReferenceResults results={filterSings(filters)} query={filters.query} onReset={reset} />
      </div>
    </main>
  );
}
