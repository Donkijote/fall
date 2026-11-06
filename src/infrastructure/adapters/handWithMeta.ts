import { HAND_META, type HandMeta } from "@/domain/rules/handMeta";
import { type Hand, HANDS } from "@/domain/rules/hands";

export type UiHand = Hand & HandMeta;

export function getUiHands(): UiHand[] {
  return HANDS.map((h) => {
    const id = h.name.toLowerCase().replaceAll(/\s+/g, "-");
    const meta = HAND_META[id];
    return {
      ...h,
      ...(meta ?? {
        id,
        description: "",
        tags: [],
      }),
    };
  });
}
