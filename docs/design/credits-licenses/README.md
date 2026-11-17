# Credits and licenses

Tracking [issue #105](https://github.com/Donkijote/fall/issues/105).

## Review status

Design review started on 2026-11-17. No composition or new artwork is approved.
The user requested mockups and iteration before screen implementation. This
change records the proposed direction and audit scope; the existing app is
unchanged. Draft images stay in the working chat, outside the approved tree.
The [prompt manifest](prompts.json) will record accepted outputs after review.

## References and proposed direction

Use the [shared art direction](../art-direction.md),
[Settings composition](../settings/README.md), and
[Card Hall backdrop](../home-lobby/README.md). Reuse that backdrop and the
shared ModalContent frame, ActionButton, semantic theme tokens, and Cinzel
Regular titles. No new background master is proposed.

The local sibling folder `../../../../inspirations/credits` contains supplied
reference screenshots from Armello, GWENT, Legends of Runeterra, Anno 1800,
and Frostpunk. These are investigation references, not runtime assets.

- Runeterra: a framed reading panel over dimmed Settings, independently
  scrolling content, and persistent dismissal.
- Frostpunk and GWENT: clear role/name hierarchy and generous spacing for
  people credits. Keep scrolling under the reader's control.
- Armello: a subdued world behind centered credits. Preserve Fall's own palette.
- Anno: an opening acknowledgement with breathing room. Keep long notices on
  an opaque semantic surface so they remain readable.

The first proposed composition expands the existing Settings credits view.
Its header and footer remain visible while the body scrolls. Three sections
separate people and provenance (Credits), third-party notices (Licenses), and
published project legal documents (Legal). Small screens stack entry metadata
and links without horizontal scrolling. Settings returns to preferences;
Done or the close control dismisses the dialog and restores trigger focus.

The people view uses a centered role/name hierarchy. Licenses use left-aligned
entries with creator, source, license, modifications, and expandable notices.
Links and full notice text must remain selectable and keyboard accessible.
The Legal section is proposed space for actual published documents: do not
invent terms, a privacy policy, or legal assurances to fill the design.
Decide whether to expose that section at launch once its real content is known.

## Initial audit findings

This is an investigation checklist, not the final attribution inventory or a
statement that all shipped notices have been accounted for.

| Group                         | Existing evidence                                                                                                                                                                                                                                     | Remaining work                                                                                                                                                                           |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fall software                 | Root [MIT license](../../../LICENSE), copyright 2025 Donkijote                                                                                                                                                                                        | Preserve the complete project notice; distinguish software licensing from asset licensing.                                                                                               |
| Game-icons silhouettes        | [Card Hall](../../../src/assets/lobby/card-hall/icons/README.md), [login and emblem](../../../src/assets/login/icons/README.md), [game glyphs](../../../src/assets/icons/README.md), [wooden chair](../../../src/assets/lobby/tavern-match/README.md) | Consolidate each included icon, creator, source, CC BY 3.0 notice, and recoloring/masking modifications. Preserve Lorc, Delapouite, Faithtoken, Sbed, and Skoll credits.                 |
| Project geometry              | Card Hall documents Help and Log out as project-drawn                                                                                                                                                                                                 | Record separately from third-party icons; retain the existing Help notice.                                                                                                               |
| Typography                    | `src/index.css` imports Cinzel and Spline Sans through Google Fonts                                                                                                                                                                                   | Verify upstream creators, exact license and copyright notices; retain complete applicable texts.                                                                                         |
| Illustrations and UI artwork  | Feature prompt manifests under `docs/design`; runtime exports under `src/assets`                                                                                                                                                                      | Map every shipped group to recorded generation, supplied inputs, or original work. Keep provenance separate from third-party license grants; investigate missing records.                |
| Spanish deck                  | SVG faces and back under `src/assets/cards`                                                                                                                                                                                                           | Establish source, creator, license and modifications; no adjacent provenance README was found in the initial review.                                                                     |
| Audio                         | `src/assets/cards/play-card.mp3`, `deal-card.mp3`, and `src/assets/audio/ember.wav`                                                                                                                                                                   | Establish sources and permissions, and determine production versus development usage. No adjacent attribution record was found in the initial review.                                    |
| Dependencies                  | `package.json`, `pnpm-lock.yaml`, installed package licenses                                                                                                                                                                                          | Inspect the shipped dependency graph and copyright/NOTICE files, including transitive runtime dependencies and icon libraries. Development tools require a separate shipping assessment. |
| App branding and public icons | `src/assets/branding/wingfoot.svg`, `public` icon variants                                                                                                                                                                                            | Connect exported icons to their source and preserve applicable notices.                                                                                                                  |

## Implementation plan after design review

Own the screen and inventory in `src/modules/credits`, exporting a small public
entry point. Home Settings should compose that entry point without importing
module internals. Keep structured attribution data framework-independent;
add layers only where an actual external dependency requires them.

Use one reviewable inventory for asset/group name, creator, source, license,
required notice, modifications, and provenance evidence. Keep unresolved audit
status explicit for maintainers. Document the procedure for adding an asset,
retaining license text, and updating the screen from that inventory in the
module README. Do not maintain a second independent list in the UI.

Before completing #105, verify mobile and desktop, light and dark themes,
short viewports, safe areas, keyboard navigation, focus restoration, dismissal,
and long notice readability. Test inventory completeness and the Settings
integration, then run the applicable repository checks. Any new DOM motion
must use GSAP and respect reduced motion.

## Review decisions

- Confirmed issue #105 and the repository branch/PR conventions.
- Located the requested inspiration screenshots in the sibling project folder.
- Proposed a Settings-based reading surface with distinct credits and notices.
- Screen implementation and final composition remain pending user feedback.
