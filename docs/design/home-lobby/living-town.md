# Living Town · issue #99

## Increment 1: sky foundation

The approved composition reference is `fall_living_town_lobby_ui.png`, supplied
in the issue implementation conversation. Its plum dusk sky, warm peach/ember
horizon and darker overhead clouds guide this first pass. This is a CSS atmosphere
study, not final illustrated artwork or approval of the complete town composition.
Do not use the earlier HTML town blockouts as the art target.

`LivingTownScene` occupies the existing full-bleed `HomeHud.scene` slot beneath
the HUD. The current Caída entry, onboarding and Settings remain unchanged. A
theme-aware backing keeps the temporary arrival text readable over the sky.
The scenery has a fixed dusk palette; it does not force the HUD into dark mode.

### Layer manifest (back to front)

| Layer          | Source               | Bounds / anchor                                   | Purpose                         |
| -------------- | -------------------- | ------------------------------------------------- | ------------------------------- |
| Sky            | CSS gradients        | Full stage; glow at 57% x, 64% y                  | Plum zenith into ember horizon  |
| Distant clouds | CSS radial gradients | 120% stage width, 48% height; top 21%, left -10%  | Muted rose/plum cloud banks     |
| Near clouds    | CSS radial gradients | 120% stage width, 63% height; top -13%, left -10% | Dark overhead framing           |
| Atmosphere     | CSS gradients        | Full stage                                        | Edge vignette and lower falloff |

Layers follow DOM paint order. Bounds are relative to the same scene stage, not
the viewport or HUD rows. Portrait widens the sky and cloud fields rather than
scaling a landscape illustration down. There are no exported images, intrinsic
image dimensions, external requests, loading dependencies, animation, parallax,
JavaScript rendering loops, canvas or WebGL. The static presentation also serves
reduced-motion users. The parent scene retains its neutral CSS fallback.

### Next increments

Review the sky first, then add distant surroundings/mountains and a single tavern
landmark. Keep the entire sky intact behind those future layers. Before replacing
this study with raster art, agree on the complete static composition and document
source/export dimensions, compression, anchors and cropping. Generate clean art
without text, HUD elements or badges; do not crop layers from the flattened
reference. Built-in image generation was unavailable for this increment; no API
key or image-generation integration has been added.

Do not add a tavern hotspot until its artwork and destination behavior are agreed.
No additional landmarks, game modes, progression rules or icon-library changes
are implemented in this increment. Issue #99 remains open for those later steps.

### Validation boundary

Home integration tests cover decorative scene ownership and preservation of the
existing gameplay entry. Automated tests do not approve the visual composition;
landscape/portrait, light/dark and representative-phone visual/performance review
remain outstanding before the full scene is ready.
