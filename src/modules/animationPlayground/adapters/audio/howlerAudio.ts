import { createCardAudio } from "@/infrastructure/adapters/audio/cardAudio";

import type { AudioPort } from "../../application/lab";

export function createHowlerAudio(): AudioPort & { preloadDeal: () => void; dispose: () => void } {
  return createCardAudio();
}
