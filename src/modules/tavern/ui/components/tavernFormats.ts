import duel from "@/assets/lobby/tavern/duel.webp";
import freeForAll from "@/assets/lobby/tavern/free-for-all.webp";
import teamMatch from "@/assets/lobby/tavern/team-match.webp";
import type { GameMode } from "@/domain/entities/GameState";

export const tavernFormats = [
  {
    mode: "1vs1",
    title: "Duel",
    players: "2 players",
    description: "Face one opponent.",
    artwork: duel,
  },
  {
    mode: "1vs2",
    title: "Free-for-All",
    players: "3 players",
    description: "Everyone plays solo.",
    artwork: freeForAll,
  },
  {
    mode: "2vs2",
    title: "Team Match",
    players: "4 players",
    description: "Play two against two.",
    artwork: teamMatch,
  },
] as const satisfies {
  mode: GameMode;
  title: string;
  players: string;
  description: string;
  artwork: string;
}[];
