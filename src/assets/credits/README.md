# Credits atelier artwork

Standalone backgrounds generated on 2026-11-18 with OpenAI's built-in ImageGen
tool for Fall's Credits & licenses screen. The tool does not expose a model ID.
The Card Hall and rulebook archive were palette/material references. The atelier
has a blank ledger, quill, inkwell, wax seal, bookcase and quiet slate center.

The [landscape master](../../../docs/design/credits-licenses/background.png)
and [recorded prompts](../../../docs/design/credits-licenses/prompts.json) belong
to the Credits feature. Phone and tablet outputs were generated separately as
recompositions of that master, not cropped out of UI mockups.

| Export                   | Dimensions  | Processing                   |
| ------------------------ | ----------- | ---------------------------- |
| `atelier-landscape.webp` | 1672 × 941  | Full standalone landscape    |
| `atelier-tablet.webp`    | 1122 × 1402 | Dedicated tablet composition |
| `atelier-phone.webp`     | 852 × 1846  | Dedicated phone composition  |

All exports use WebP quality 83, effort 6, preserving native dimensions. The
inventory entry in `src/modules/credits/domain/inventory.ts` records provenance
separately from provider-term review. No ownership or third-party license grant
is inferred solely from generated origin.
