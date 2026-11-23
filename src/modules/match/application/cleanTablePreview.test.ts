import { toCardKey } from "@/domain/helpers/card";

import { cleanTablePreview, type CleanTableCase } from "./cleanTablePreview";

it.each(["1vs1", "1vs2", "2vs2"] as const)(
  "resolves each capture case through the real rules in %s",
  (mode) => {
    const examples: CleanTableCase[] = [
      "capture",
      "cascade",
      "fall",
      "last-round",
      "no-clear",
      "winning",
    ];
    for (const example of examples)
      for (let player = 0; player < (mode === "1vs1" ? 2 : mode === "1vs2" ? 3 : 4); player++) {
        const { before, capture, resolved, award } = cleanTablePreview({ mode, example, player });
        const cards = [
          ...before.deck,
          ...before.table,
          ...before.players.flatMap((p) => [...p.hand, ...p.collected]),
        ];
        expect(cards).toHaveLength(40);
        expect(new Set(cards.map(toCardKey)).size).toBe(40);
        expect(capture.motion?.kind).toBe("collect");
        if (capture.motion?.kind !== "collect") throw new Error("Expected capture");
        expect(capture.motion.player).toBe(before.players[player].id);
        expect(capture.motion.capture).toBe(
          example === "cascade" ? "cascade" : example === "fall" ? "fall" : "card",
        );
        const excluded = example === "last-round" || example === "no-clear";
        if (excluded) expect(award).toBeUndefined();
        else
          expect(award).toMatchObject({
            amount: 4,
            reason: "clear",
            player: before.players[player].id,
            side: String(before.players[player].team),
          });
        expect(resolved.table).toHaveLength(example === "no-clear" ? 1 : 0);
        expect(resolved.scoreAwards?.map((a) => a.reason) ?? []).toEqual(
          excluded ? [] : example === "fall" ? ["clear", "fall"] : ["clear"],
        );
        expect(Boolean(resolved.winner)).toBe(example === "winning");
      }
  },
);
