import { CaptureQuotas } from "../chapters/CaptureQuotas";
import { ScoringReference } from "../chapters/ScoringReference";

export const rulebookGallery = {
  title: "Rulebook",
  folder: "rulebook",
  entries: [
    {
      name: "CaptureQuotas",
      source: "src/modules/rulebook/ui/components/chapters/CaptureQuotas.tsx",
      variants: "Quotas for two, three and four players",
      usage: "How to Play · capture counting",
      Preview: CaptureQuotas,
    },
    {
      name: "ScoringReference",
      source: "src/modules/rulebook/ui/components/chapters/ScoringReference.tsx",
      variants: "Illustrated scoring reference",
      usage: "How to Play · scoring",
      Preview: ScoringReference,
    },
  ],
};
