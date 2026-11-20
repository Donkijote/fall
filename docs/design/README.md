# Fall design references

Start with [Fall art direction](art-direction.md) for the shared visual language.
Use the feature references to understand the approved composition, and the
running app to check current controls and behavior.

| Feature              | Approved references                                    |
| -------------------- | ------------------------------------------------------ |
| Home lobby           | [Card Hall](home-lobby/README.md)                      |
| Tavern               | [Tavern format picker](tavern/README.md)               |
| Tavern match         | [Tavern match lobby and board](tavern-match/README.md) |
| Login                | [Login](login/README.md)                               |
| Settings             | [Card Hall Settings](settings/README.md)               |
| Credits and licenses | [Continuous Chronicle](credits-licenses/README.md)     |
| How to Play          | [Rulebook](how-to-play/README.md)                      |
| Sings                | [Sings reference](sings-reference/README.md)           |
| Component gallery    | [Component gallery](component-gallery/README.md)       |
| Action button        | [Action button skins](action-button/README.md)         |
| Choice button        | [Choice button artwork](choice-button/README.md)       |
| Text input           | [Text input artwork](text-input/README.md)             |

Technical investigations: [Cross-platform distribution (#126)](platform-distribution/README.md)
records the proposed delivery strategy, validation gates and implementation plan.
It introduces no artwork references.
[Authoritative multiplayer and platform research (#129)](authoritative-backend/README.md)
records the ongoing product discovery, backend evaluation agenda and follow-up scope.

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
- Generate each illustration destined for `src/assets` as a standalone image
  at the target aspect ratio and resolution. Use full mockups as visual
  references. Never crop artwork out of a simplified or detailed mockup for
  production. Record the standalone generation and export in the manifest.
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

Record feature reviews and design decisions in the owning feature's README.
Keep temporary review material in the working chat or outside the repository
and remove temporary files when the review is done. Use the existing feature
folder for all lasting design documentation. Once approved, replace the affected master and update its prompt,
README, and runtime exports together. Remove superseded files and prompts, and
verify that documentation paths and runtime imports still resolve. Git history
keeps earlier versions available. Use module docs for implementation details,
verification and rule audits.

## Supported viewport policy

As of #137, Fall supports landscape presentation on phones, tablets and desktop. Login is the only exception: it remains usable in portrait and landscape for credentials, password managers and the on-screen keyboard. Small landscape layouts are the unprefixed Tailwind base, with larger layouts layered at standard width breakpoints (`lg`). Outside Login, portrait layout branches, the `compact-landscape` and `compact-portrait` variants, and portrait-only runtime backgrounds are retired. Short-height emergency adjustments may use local height queries; safe-area insets and native scrolling remain supported.

This is a presentation policy only: the web app neither requests orientation locking nor shows a rotate-device gate. Native orientation enforcement and lifecycle validation are deferred to #140. After “Take your seat”, screens use the landscape composition; #140 owns enforcing that policy and restoring portrait availability when returning to Login. A portrait browser showing a non-Login landscape composition is not a supported portrait layout.

Verification targets: 568×320, 667×375, 844×390 and 932×430 phones; 1024×768, 1180×820 and 1366×1024 tablets; 1280×720, 1440×900 and 1920×1080 desktop. Check both landscape directions, safe-area padding, keyboard/focus and scrollable overlays. Also verify Login at 390×844 and 768×1024 portrait, including keyboard scrolling and navigation to/from the Hall. Physical iOS/Android, browser/PWA lifecycle and native lock verification remain pending under #140.
