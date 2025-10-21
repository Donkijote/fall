import { faSkull, faTrophy } from "@fortawesome/free-solid-svg-icons";

import type { GameResult } from "./types";

export const ICONS: Record<GameResult, typeof faSkull> = {
  win: faTrophy,
  lose: faSkull,
};