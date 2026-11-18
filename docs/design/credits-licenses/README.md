# Credits and licenses

Tracking [issue #105](https://github.com/Donkijote/fall/issues/105).

## Review status

Design locked on 2026-11-17. The user approved the [continuous Chronicle mockup](mockup-simplified.png) with one behavior correction: **only the content scrolls**, inside a fixed viewport. The backdrop and Settings return action stay stationary. There are no menus, submenus, or page scrolling. The [prompt manifest](prompts.json) preserves a reconstructed brief and the final correction.

The implementation lives in [the Credits module](../../../src/modules/credits/README.md). The original mockup remains a composition reference; the live screen now uses the [Credits atelier background](background.png), dedicated phone/tablet exports under `src/assets/credits`, a softer reading wash, and the proprietary project notice. The mockup is never imported by the app.

## Approved direction and references

Use the [shared art direction](../art-direction.md),
[Settings composition](../settings/README.md), and
[Card Hall backdrop](../home-lobby/README.md) as a palette reference. Reuse the
shared ActionButton, BronzeArrow dividers, semantic theme tokens, and Cinzel
Regular titles. The selected direction is a fixed-viewport screen without a modal frame.
The 2026-11-18 background revision uses a dedicated illuminator’s atelier while preserving the Card Hall palette and materials.

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

The Chronicle opens from Settings as one fixed-viewport screen over the subdued
atelier. Only its content region scrolls manually. Keep a persistent Settings return action using
the shared ActionButton design. There are no category menus, tabs, submenus,
accordions, or nested scroll panels. One keyboard-focusable content region owns scrolling.
The user's request for an "infinite scroll list" means all sections appear in
sequence as the content scrolls; it
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
| Fall software                 | Root [proprietary notice](../../../LICENSE), copyright 2025–2026 Donkijote                                                                                                                                                                            | Keep the proprietary project notice separate from third-party licenses and respect valid grants for prior versions.                                                                      |
| Game-icons silhouettes        | [Card Hall](../../../src/assets/lobby/card-hall/icons/README.md), [login and emblem](../../../src/assets/login/icons/README.md), [game glyphs](../../../src/assets/icons/README.md), [wooden chair](../../../src/assets/lobby/tavern-match/README.md) | Consolidate each included icon, creator, source, CC BY 3.0 notice, and recoloring/masking modifications. Preserve Lorc, Delapouite, Faithtoken, Sbed, and Skoll credits.                 |
| Project geometry              | Card Hall documents Help and Log out as project-drawn                                                                                                                                                                                                 | Record separately from third-party icons; retain the existing Help notice.                                                                                                               |
| Typography                    | `src/index.css` imports Cinzel and Spline Sans through Google Fonts                                                                                                                                                                                   | Verify upstream creators, exact license and copyright notices; retain complete applicable texts.                                                                                         |
| Illustrations and UI artwork  | Feature prompt manifests under `docs/design`; runtime exports under `src/assets`                                                                                                                                                                      | Map every shipped group to recorded generation, supplied inputs, or original work. Keep provenance separate from third-party license grants; investigate missing records.                |
| Spanish deck                  | SVG faces and back under `src/assets/cards`                                                                                                                                                                                                           | Establish source, creator, license and modifications; no adjacent provenance README was found in the initial review.                                                                     |
| Audio                         | `src/assets/cards/play-card.mp3` and `deal-card.mp3`                                                                                                                                                                                                  | Establish sources and permissions, and determine production versus development usage. No adjacent attribution record was found in the initial review.                                    |
| Dependencies                  | `package.json`, `pnpm-lock.yaml`, installed package licenses                                                                                                                                                                                          | Inspect the shipped dependency graph and copyright/NOTICE files, including transitive runtime dependencies and icon libraries. Development tools require a separate shipping assessment. |
| App branding and public icons | `src/assets/branding/wingfoot.svg`, `public` icon variants                                                                                                                                                                                            | Connect exported icons to their source and preserve applicable notices.                                                                                                                  |

## Implementation and verification

The screen and inventory live in `src/modules/credits`, exported through a small
public entry point. Routing lazy-loads that entry point; Home Settings links to
the public route without importing module internals. Keep structured attribution data framework-independent;
add layers only where an actual external dependency requires them.

The inventory records asset/group name, creator, source, license, required
notice, modifications, and provenance evidence. Keep unresolved audit
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
- Final composition locked after the user approved the continuous-list revision.
- Compared three distinct concepts: Chronicle, Ledger, and Makers' Table.
- The user prefers Chronicle and explicitly removed category navigation in
  favor of one continuous scrolling list.
- The revision must use the existing shared component designs, including the
  actual ActionButton skin and bronze divider artwork.
- Final behavior correction: content scrolling only, fixed backdrop and return action.
- Initial implementation includes structured attribution, complete retained font/project notices, and generated production dependency notices. Asset sources and missing upstream package notices remain explicit audit follow-ups.
- Sound sources were subsequently identified, deck replacement is tracked in #132, and the 2026-11-18 atelier revision was visually checked on desktop, phone and tablet.

- Software notices now follow the actual production JavaScript build, including lazy chunks, plus reviewed CSS imports. Installed-only dependencies are excluded. Fonts, artwork and sound provenance remain separate inventory responsibilities.

## Licensing research

Reviewed official sources on 2026-11-17 after the user clarified the asset origins.
This records provenance and outstanding permission checks, not legal clearance.

- [Pixabay Content License summary](https://pixabay.com/service/license-summary/)
  and [full terms](https://pixabay.com/service/terms/) allow commercial and
  non-commercial use subject to restrictions; attribution is not generally
  required under the current summary. The terms distinguish incorporation in a
  new creative work from prohibited standalone redistribution. On 2026-11-18
  the user supplied the two card-sound item pages, [522516](https://pixabay.com/sound-effects/film-special-effects-taking-playing-card-2-522516/)
  and [522513](https://pixabay.com/es/sound-effects/pel%C3%ADculas-y-efectos-especiales-taking-playing-card-3-522513/).
  Both pages identify OxidVideos and the Pixabay Content License; the inventory
  records them in the user's deal/play order. Download dates and any edits are
  not documented. The user corrected the ember mock audio's origin to
  self-generated and requested its removal; it is no longer a shipped credit.
  Do not call the retained sounds CC0.
- [Shutterstock's terms](https://www.shutterstock.com/terms), particularly its
  intellectual-property and content-use provisions, require licensing for use
  of its content, including derivative works. The user reported redrawing the
  current deck in Illustrator from a Shutterstock reference; reference
  permission is not established. This is recorded as permission pending. No listing was identified, no
  copyright owner was independently identified, and no substantial-similarity
  determination was made. Giving credit or manually making SVG paths does not
  itself supply a license.
- [WIPO explains that copyright protects expression rather than ideas](https://www.wipo.int/en/web/copyright/protection).
  Distinguish the Spanish-deck suit/rank convention from a particular printed
  illustration. There is no blanket permission established here for a specific
  "official" deck. If the user means Fournier, its own [card-face notice](https://www.nhfournier.es/blog/sabias-que-las-caras-de-fournier-son-marca-registrada/)
  states its card faces are registered marks and require permission. Its
  [legal notice](https://www.nhfournier.es/aviso-legal/) also restricts reproduction.
  These are the publisher's statements; no trademark-register search or license
  grant for a particular deck was obtained.
- The user identified the castle as generated in [Google Stitch](https://stitch.google.com/)
  and confirmed that other artwork, app icons, the foreground mask and ember SVG
  were generated. This resolves their reported origin, not all provider-term or
  third-party-input questions. Existing generation manifests remain authoritative
  where recorded; do not invent missing providers, prompts or rights assignments.
- Future card replacement should preserve the Spanish suits and existing game
  ranks while using distinct face illustrations, symbols, borders and card-back
  ornament. Do not use unlicensed stock images as edit inputs or request a copy
  of a named commercial deck. Generate standalone production assets and follow
  the artwork review/export standard. The replacement remains future work.

- 2026-11-18: recorded the individual Pixabay card-sound sources and creator; removed the self-generated ember mock audio and its dedicated playground lesson. The visual ember SVG/effects are separate and retained.

## 2026-11-18 licensing and backdrop revision

The user confirmed Fall is a closed-source commercial game. The root LICENSE,
package metadata, inventory and Legal notices now state proprietary / all rights
reserved for project-owned materials, while retaining third-party notices.
[OSI explains that commercial and proprietary are separate concepts](https://opensource.org/faq#commercial).
The current notice explicitly preserves valid prior-version grants. The user
chose to leave repository visibility public; it was not changed. No end-user
purchase agreement or third-party ownership assignment has been invented.

The new [atelier master](background.png) was generated with built-in ImageGen
using the Hall and archive as palette/material references. Its blank ledger,
quill, wax seal and bookcase suggest the makers' work; the quiet slate center
supports the credits. Separate phone and tablet recompositions preserve the
scene rather than cropping it out of mockups. The [prompt manifest](prompts.json)
records the prompts, input references, known provider/date, unexposed model ID,
and WebP exports. Runtime files preserve their native dimensions: landscape
1672×941, tablet 1122×1402, phone 852×1846.

The opaque narrow column is replaced by a 25% overall shadow wash and a soft
radial reading gradient, strongest at the center and fading towards the edges.
The viewport and return action remain fixed, with content-only scrolling.

The live 2026-11-18 revision was checked at desktop 1280×720, phone 390×844
and tablet 768×1024. The return action stayed fixed while the content scrolled,
and the proprietary notice was checked at the end. Physical-device notch/PWA
checks remain separate. The original full-content mockup is retained only for
its approved composition; this revision’s background master and live code own
the updated artwork, reading treatment and legal copy.
