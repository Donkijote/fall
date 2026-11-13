import type { CardDropEffect } from "@/components/cards/motion/cardFlights";
import type { Rank } from "@/domain/entities/Card";

export function matchFallEffect(rank: Rank | undefined): CardDropEffect {
  switch (rank) {
    case 10:
      return "ice";
    case 11:
      return "heat";
    case 12:
      return "flame";
    default:
      return "plain";
  }
}
