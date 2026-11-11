import { useRef, useState } from "react";

import { useSingsFilterMotion } from "../adapters/useSingsFilterMotion";
import { defaultSingsFilters, filterSings, type SingsFilters } from "../application/singsCatalog";
import { ReferenceResults } from "./components/catalog/ReferenceResults";
import { ReferenceFilters } from "./components/filters/ReferenceFilters";
import { ReferenceHeader } from "./components/layout/ReferenceHeader";
import { SortingTableBackground } from "./components/layout/SortingTableBackground";
import "./SingsReferenceScreen.css";

export function SingsReferenceScreen() {
  const [filters, setFilters] = useState(defaultSingsFilters);
  const searchRef = useRef<HTMLInputElement>(null);
  const motion = useSingsFilterMotion();
  const updateFilters = (nextFilters: SingsFilters) => {
    const nextResults = filterSings(nextFilters);
    motion.prepare(new Set(nextResults.map(({ id }) => id)));
    setFilters(nextFilters);
  };
  const reset = () => {
    updateFilters(defaultSingsFilters);
    searchRef.current?.focus();
  };

  return (
    <main className="relative isolate h-dvh [scrollbar-width:none] overflow-x-hidden overflow-y-auto overscroll-contain bg-background text-foreground [&::-webkit-scrollbar]:hidden">
      <SortingTableBackground />
      <div
        ref={motion.scopeRef}
        className="@container relative isolate mx-auto max-w-[100rem] pt-[calc(var(--sings-gutter)+var(--safe-area-top))] pr-[calc(var(--sings-gutter)+var(--safe-area-right))] pb-[calc(var(--sings-gutter)+var(--safe-area-bottom))] pl-[calc(var(--sings-gutter)+var(--safe-area-left))] [--sings-gutter:1rem] sm:[--sings-gutter:1.75rem] xl:[--sings-gutter:3rem]"
      >
        <div
          aria-hidden="true"
          className="sings-reference-shade pointer-events-none absolute inset-0 -z-10 bg-black/60"
        />
        <ReferenceHeader>
          <ReferenceFilters filters={filters} onChange={updateFilters} searchRef={searchRef} />
        </ReferenceHeader>
        <ReferenceResults results={filterSings(filters)} query={filters.query} onReset={reset} />
        <div
          ref={motion.exitLayerRef}
          aria-hidden="true"
          inert
          className="pointer-events-none absolute inset-0 z-10"
        />
      </div>
    </main>
  );
}
