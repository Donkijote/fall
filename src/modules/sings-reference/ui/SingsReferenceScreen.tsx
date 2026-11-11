import { useRef, useState } from "react";

import { FramedCard } from "@/components";
import { ArchiveBackground } from "@/components/surfaces/ArchiveBackground";

import { defaultSingsFilters, filterSings } from "../application/singsCatalog";
import { ReferenceResults } from "./components/catalog/ReferenceResults";
import { ReferenceFilters } from "./components/filters/ReferenceFilters";
import { ReferenceHeader } from "./components/layout/ReferenceHeader";

export function SingsReferenceScreen() {
  const [filters, setFilters] = useState(defaultSingsFilters);
  const searchRef = useRef<HTMLInputElement>(null);
  const reset = () => {
    setFilters(defaultSingsFilters);
    searchRef.current?.focus();
  };

  return (
    <main className="relative isolate h-dvh [scrollbar-width:none] overflow-x-hidden overflow-y-auto overscroll-contain bg-background text-foreground [&::-webkit-scrollbar]:hidden">
      <ArchiveBackground />
      <div className="mx-auto grid max-w-[1680px] grid-cols-[minmax(0,1fr)] pt-[calc(1rem+var(--safe-area-top))] pr-[calc(var(--folio-gutter)+var(--safe-area-right))] pb-[calc(1.5rem+var(--safe-area-bottom))] pl-[calc(var(--folio-gutter)+var(--safe-area-left))] [--folio-gutter:1rem] sm:[--folio-gutter:2rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,62rem)] lg:pt-[calc(2.5rem+var(--safe-area-top))] lg:[--folio-gutter:3rem]">
        <div className="min-w-0 lg:col-start-2">
          <ReferenceHeader />
          <FramedCard className="gap-0 p-3 sm:p-6 xl:px-8">
            <ReferenceFilters filters={filters} onChange={setFilters} searchRef={searchRef} />
            <ReferenceResults
              results={filterSings(filters)}
              query={filters.query}
              onReset={reset}
            />
          </FramedCard>
        </div>
      </div>
    </main>
  );
}
