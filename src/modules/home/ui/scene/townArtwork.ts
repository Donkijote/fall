import arena from "@/assets/lobby/living-town/arena.webp";
import castle from "@/assets/lobby/living-town/castle.webp";
import fountain from "@/assets/lobby/living-town/fountain.webp";
import gates from "@/assets/lobby/living-town/gates.webp";
import merchant from "@/assets/lobby/living-town/merchant.webp";
import mountainsFar from "@/assets/lobby/living-town/mountains-far.webp";
import mountainsNear from "@/assets/lobby/living-town/mountains-near.webp";
import observatory from "@/assets/lobby/living-town/observatory.webp";
import plaza from "@/assets/lobby/living-town/plaza.webp";
import questBoard from "@/assets/lobby/living-town/quest-board.webp";
import sky from "@/assets/lobby/living-town/sky.webp";
import tavern from "@/assets/lobby/living-town/tavern.webp";

export const townArtwork = [
  { id: "sky", source: sky, width: 1672, height: 941 },
  { id: "mountains-far", source: mountainsFar, width: 2172, height: 724 },
  { id: "mountains-near", source: mountainsNear, width: 2172, height: 724 },
  { id: "plaza", source: plaza, width: 1672, height: 941 },
  { id: "castle", source: castle, width: 1137, height: 1009 },
  { id: "arena", source: arena, width: 1525, height: 1031 },
  { id: "observatory", source: observatory, width: 948, height: 1375 },
  { id: "gates", source: gates, width: 1088, height: 1114 },
  { id: "tavern", source: tavern, width: 1536, height: 1024 },
  { id: "merchant", source: merchant, width: 1536, height: 1024 },
  { id: "quest-board", source: questBoard, width: 1246, height: 1262 },
  { id: "fountain", source: fountain, width: 1658, height: 424 },
] as const;

export type TownArtwork = (typeof townArtwork)[number];
