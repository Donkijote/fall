# Credits and licenses

Tracking [issue #105](https://github.com/Donkijote/fall/issues/105).

## Review status

Design review started on 2026-11-17. The user prefers the Chronicle direction,
revised into one continuous scrolling document with the existing component
designs. The revised mockup remains under review before screen implementation.
The existing app is unchanged. Draft images stay in the working chat, outside
the approved tree.
The [prompt manifest](prompts.json) will record accepted outputs after review.

## References and proposed direction

Use the [shared art direction](../art-direction.md),
[Settings composition](../settings/README.md), and
[Card Hall backdrop](../home-lobby/README.md). Reuse that backdrop and the
shared ActionButton, BronzeArrow dividers, semantic theme tokens, and Cinzel
Regular titles. The selected direction is a full page without a modal frame.
No new background master is proposed.

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

The Chronicle revision opens from Settings as one full-page, manually scrolling
document over the subdued Hall. Keep a persistent Settings return action using
the shared ActionButton design. There are no category menus, tabs, submenus,
accordions, or internal scroll panels. The user's request for an "infinite
scroll list" means all sections appear in sequence as the page scrolls; it
does not require endlessly repeated content or automatic scrolling.

Use a centered role/name hierarchy for people, followed by artwork and audio,
icons, typography, open-source software, and legal notices. Reuse the existing
faded bronze dividers between sections. Longer notices use a readable
left-aligned measure within that same document. Include creator, source,
license, modifications, and applicable full notice text without hiding required
content behind another menu. Source links remain available alongside entries.
Keep all text selectable and keyboard accessible. Small screens stack metadata
without horizontal scrolling and preserve safe areas around the return action.
Settings returns to preferences and restores meaningful focus.

Legal content includes actual published project documents and applicable
notices. Do not invent terms, a privacy policy, or legal assurances to fill the
design. The mockup's sample attribution rows do not establish provenance or
replace the audit.

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
- Compared three distinct concepts: Chronicle, Ledger, and Makers' Table.
- The user prefers Chronicle and explicitly removed category navigation in
  favor of one continuous scrolling list.
- The revision must use the existing shared component designs, including the
  actual ActionButton skin and bronze divider artwork.
