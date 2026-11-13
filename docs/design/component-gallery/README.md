# Component gallery

[Issue #122](https://github.com/Donkijote/fall/issues/122) uses the supplied
theme-template screenshot as a layout reference. The first pass groups
interactive previews in compact panels and puts semantic swatches, typography,
and radius samples above the component inventory. Fall's existing theme and
shared brass-framed surfaces provide the visual treatment.

The preview of `ActivityCard` uses the Card Hall's existing Tavern illustration.
See the [Card Hall references](../home-lobby/README.md) for its source. No new
artwork was generated.

See the [module README](../../../src/modules/componentGallery/README.md) for
the settings entry, route, and shared styling workflow.

Feature sections preview styled UI in its owning module. The Tavern match
previews show the [overlay artwork](../tavern-match/README.md) supplied by each
component. Positioning containers give absolute overlays their layout bounds.

## Detailed mockup review

The seven detailed screen mockups and the Tavern match overlay sheet were
reviewed for treatments that could share a component. These are implementation
options for review.

| Reference                                       | Tailwind and CSS                                                                                                                                      | Artwork where detail matters                                                                                                                                     |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Card Hall](../home-lobby/README.md)            | Layer the dark red action face, chamfered ends, brass bevel, and shadow. Build the activity card's outer rail, title band, and selected glow in code. | Use the existing suit icons for corner emblems. A standalone corner ornament or a subtle texture can reproduce engraved lines, scratches, and worn red material. |
| [Login](../login/README.md)                     | Take Your Seat can use the same action treatment as Continue Campaign. The thin inset input frames and circular provider controls are CSS-sized.      | The heraldic crest and portrait carry the illustrated detail.                                                                                                    |
| [Settings](../settings/README.md)               | The double brass panel line, section dividers, control states, and compact Done button fit CSS.                                                       | Small corner flourishes can be reused at a fixed size if approved.                                                                                               |
| [Rulebook](../how-to-play/README.md)            | The layered article border, numbered markers, and Next button fit CSS. Keep the rule text and example layout in React.                                | Use the existing card faces and consider a shared parchment texture for example surfaces.                                                                        |
| [Sings reference](../sings-reference/README.md) | Brass card frames, round score medallions, and mandatory/optional plaques can use the same border and bevel techniques.                               | Suit emblems, laurel detail, card faces, and fine flourishes are artwork candidates.                                                                             |
| [Tavern picker](../tavern/README.md)            | The image frame, lower contrast gradient, selected rim, and chamfered ribbon fit CSS.                                                                 | Format illustrations remain individual assets.                                                                                                                   |
| [Tavern match](../tavern-match/README.md)       | Seat plaques, avatar rings, active glow, and live action controls fit CSS.                                                                            | Keep the waiting sign, stitched dealer board, capture tray, sealed leave parchment, and result crests as standalone art behind live content.                     |

The detailed mockups vary in apparent title weight, tracking, shadow, and
surface texture. Keep Cinzel Regular for titles and use the shared artwork
title treatment over illustrations. Compare size, spacing, foreground contrast,
and shadow before choosing any stronger effect. Reserve distressed lettering
for branded artwork where the texture is visible at the intended size.

The first candidate for a gallery comparison is a featured action with
nested clipped layers, a brass gradient, and a dark red face driven by
the primary token. Keep the button and its focus ring outside the clipped
decoration. The second candidate is an illustrated card frame with continuous
CSS rails and separately positioned corner emblems. Check both at narrow and
wide sizes before commissioning any new texture.

The shared action preview now uses the standalone
[ActionButton skins](../action-button/README.md). The Card Hall dock and
illustrated match result retain their own frames.
