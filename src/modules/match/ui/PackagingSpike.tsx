import landscape from "@/assets/lobby/tavern-match/table-landscape.webp";

import { PackagingCaptureFixture } from "./components/previews/PackagingCaptureFixture";

/** Opt-in build fixture. The router excludes it from ordinary release builds. */
export function PackagingSpike() {
  return (
    <main className="relative h-dvh overflow-hidden bg-background text-foreground">
      <img src={landscape} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-background/40" />
      <PackagingCaptureFixture />
    </main>
  );
}
