import plaque from "@/assets/lobby/tavern-match/clean-table-plaque.webp";
import frame from "@/assets/lobby/tavern-match/matching-card-frame.webp";

export function BonusArtworkPreload() {
  return (
    <>
      <link rel="preload" as="image" href={plaque} />
      <link rel="preload" as="image" href={frame} />
    </>
  );
}
