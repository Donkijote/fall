# Fall design references

Start with [Fall art direction](art-direction.md) for the shared visual language.
Use the feature references to understand the approved composition, and the
running app to check current controls and behavior.

| Feature     | Approved references                          |
| ----------- | -------------------------------------------- |
| Home lobby  | [Card Hall](home-lobby/README.md)            |
| Login       | [Login](login/README.md)                     |
| Settings    | [Card Hall Settings](settings/README.md)     |
| How to Play | [Rulebook](how-to-play/README.md)            |
| Sings       | [Sings reference](sings-reference/README.md) |

## Feature folder standard

Use a flat, lowercase kebab-case feature folder named for the screen or feature.

- **`README.md`** explains the approved direction, which treatment the app uses,
  where the runtime assets and implementation live, and any behavior the mockups
  cannot convey.
- **`mockup-simplified.png` and `mockup-detailed.png`** are the final approved
  composition and detailed treatment. Keep only the versions that exist and
  have been accepted; do not add placeholders.
- **`background.png`** is the one default, clean artwork master with no UI or text.
  When a feature shares a scene or uses a supplied original already in
  `src/assets`, link to that canonical image instead of duplicating it. Put
  optimized default exports and all viewport variants in `src/assets`.
- **`prompts.json`** is the single prompt manifest. Its `art_direction` field
  links to the shared generation prompt. Prepend that prompt to the feature
  brief and name the treatment you want. Each entry in `outputs` names its
  `file`, `method`, and `references` using paths relative to the manifest.
  Use `recorded` for preserved prompt text, `reconstructed` for a reusable brief
  written from the approved result, and `supplied` for externally provided art.
  Store the text in `prompt`, any necessary final edit instructions in
  `refinements` (in order), and provenance or input substitutions in `notes`.
  Omit `prompt` for supplied art. Runtime variant prompts can point to their
  optimized files in `src/assets`. For edits, attach the current approved
  output and the listed references. Record useful constraints from the final
  edits without keeping a separate prompt for each rejected concept.

## Iterating on a design

Keep candidates and reference research in the working chat or outside this tree
during review. Once approved, replace the affected master and update its prompt,
README, and runtime exports together. Remove superseded files and prompts, and
verify that documentation paths and runtime imports still resolve. Git history
keeps earlier versions available. Use module docs for implementation details,
verification and rule audits.
