# Living Town: illustrated environment (#99)

## Art direction

The supplied `fall_living_town_lobby_ui.png` remains the composition reference:
a dusk valley, warm tavern in the left foreground, open plaza and room for future
landmarks. The earlier CSS/SVG/mesh blockouts were rejected as too cartoonish.
They are replaced, not rendered underneath or used as alternate art on mobile.

Use believable timber/stone forms and painterly material detail, not photorealism,
low-poly facets, candy colors or miniature/toy architecture. The prepared assets
in `src/assets/lobby/living-town` deliberately follow the existing hub's charcoal,
oxblood, muted plum and aged-bronze palette. Their generation briefs are preserved
in that directory's README. Do not mix in the softer alternative cottage set or
crop scenery from the flattened reference with its UI baked in.

## Integration with the HUD

`LivingTownScene` stays in the full-bleed `HomeHud.scene` slot, under the existing
HTML HUD. Player identity remains upper-left; resources and Settings upper-right;
the five player-system shortcuts remain below. Keep the central valley quiet for
The Hearth and the existing Play entry. No HUD typography, tokens, icons, controls,
theme selection or gameplay rules change in this increment.

The scenery has a fixed dusk palette in both themes. Local desaturation, depth
grading, horizon haze and a charcoal perimeter connect it to the HUD without
forcing dark mode or tinting the HTML controls. Warm tavern windows and the oxblood
awning echo existing ember/primary accents. The arrival panel's theme-aware backing
continues to protect text contrast. The tavern is scenery, not a second Play button.

## Layer manifest

`scene/townArtwork.ts` owns imported URLs, intrinsic dimensions and back-to-front
art ordering. `living-town.css` owns composition and grading.

| Layer                       | Source/export dimensions | Composition                                      |
| --------------------------- | ------------------------ | ------------------------------------------------ |
| Sky                         | 1672 × 941               | Full frame, original aspect preserved with cover |
| Far mountains               | 2172 × 724               | Top 8%, width 108%, left -4%; quieter/hazed      |
| Near mountains              | 2172 × 724               | Top 22%, same overscan; darker foothills         |
| Static haze / optional mist | Full reference frame     | Between terrain and foreground                   |
| Ground / plaza              | 1672 × 941               | Full frame; top feathered into terrain           |
| Tavern / contact shadow     | 1536 × 1024              | Independent left-foreground anchor               |
| Atmosphere                  | Full stage               | Dark upper/lower perimeter; never over HUD       |

The centered 1600 × 900 reference composition covers the actual scene container
using container units, not viewport-height assumptions. Landscapes retain a central
valley; portrait crops the same reference frame without stretching either ridge.
The tavern is independently sized from the visible stage so it survives that crop.
Desktop width is min(47% stage width, 85% stage height), with its image bottom 14%
above the stage bottom. Portrait uses min(90% width, 52% height), left -15% and
bottom 14%, keeping more of the facade below the arrival panel. Intrinsic
transparent padding is part of these placements. A soft
contact ellipse grounds the steps on the plaza rather than adding a floating base.

PNG masters are retained unchanged. Only same-size WebP exports are imported;
RGBA is preserved for cutouts. Pillow export settings: quality 88, method 6, from
the source converted to RGBA. Five exports total about 453 KiB versus about 6 MiB
of PNG masters; no new application dependency or remote runtime request is needed.
Vite fingerprints the image URLs. The original PNGs are not emitted by the build.

## Loading, accessibility and enhancement

- Every image has empty alt text, explicit dimensions and disabled dragging.
  The full scene is `aria-hidden` and owns no focusable controls or pointer input.
- Images decode asynchronously and become visible after loading. Failed images
  stay hidden instead of showing broken-image placeholders. Other layers remain;
  CSS sky/ground colors provide a basic usable backdrop if all requests fail.
- The raster composition is the primary presentation, including reduced motion,
  save-data and missing WebGL. There is no different geometric fallback style.
- The one lazy R3F canvas draws only a low-opacity drifting mist plane. It never
  hides or replaces artwork. Initialization/shader/context-loss errors disable it
  until remount. Reduced motion and save-data unmount it; hidden tabs stop frames.
- Desktop DPR is capped at 1.5, compact DPR at 1. The mist uses no antialiasing,
  texture downloads, lights, pointer listeners, camera controls or second clock.
  The shared preference hook and login atmosphere behavior are unchanged.

## Scope and further review

The castle, other landmarks, destination interactions and progression rules are
explicitly deferred. Issue #99 remains open. This is an integrated art-direction
pass, not final art approval. The fixed-view tavern contains painted illumination
and a soft warm fringe; changing its viewpoint or lighting needs revised artwork,
not dynamic relighting of a flat image. Edge cleanup, plaza perspective and the
final landmark scale remain candidates for the next art review. Prefer composition
and source-art corrections to adding bloom, clutter or more rendering libraries.

Scene tests cover layer order, intrinsic sizing, decorative semantics, individual
image failure, static paths and enhancement lifecycle. Home tests preserve
onboarding, Settings, the single existing Play entry and mode selection. Mocked
renderer tests do not establish GPU quality or physical-phone performance.

## Integration validation

- `pnpm check`, all 314 tests in 55 files, the production build and
  `git diff --check` pass. Obsolete geometry-model tests were removed with the
  rejected procedural art. Existing Three.js deprecation/large-chunk warnings remain.
- Production-build checks in isolated headless Chromium cover 1280 × 800,
  390 × 844, 320 × 568, 844 × 390 and 1920 × 1080: five loaded art layers,
  no horizontal overflow and an in-bounds Play target at least 44px tall.
- Desktop and portrait compositions were captured and inspected. Portrait moves
  the tavern below the arrival panel rather than letting that panel hide its facade.
- Reduced motion retains the five images without a canvas. Simulated context loss
  retains the art; blocking all image requests leaves the CSS fallback and usable Play.
  Light-theme mode selection and Settings dialogs work. No uncaught page errors
  were recorded. Physical-device GPU/battery performance and final art approval
  remain outstanding.
