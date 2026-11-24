# Card deck — issue #132

## Approved artwork

The user approved **Mountain Keep**, **Maritime Guild**, and **Moonlit Grove**
on 2026-11-23 in [the comparison board](mockup-detailed.png), then directed
continuation with complete generated cards after reviewing the corrected
[Mountain Keep reference](mountain-keep-reference.png).
The [Maritime Guild](maritime-guild-reference.png) and
[Moonlit Grove](moonlit-grove-reference.png) full-card references lock their
respective paper, border and illustration treatment.

| Pack           | Identity                                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Mountain Keep  | Mountain-stamped brass, pewter tankards, straight steel swords, iron-banded oak, fortress court, restrained masonry ink border |
| Maritime Guild | Scalloped silver compass coins, glass goblets, curved swords, rope-gripped hardwood, coastal court, rope and wave border       |
| Moonlit Grove  | Bronze crescent/acorn coins, carved wooden bowls, bronze leaf swords, blackthorn, woodland court, roots and leaves             |

There are **120 complete faces and three shared backs**: 40 faces and one back
per pack. Engraving, painting and woodcut are a separate technique axis; nine
pack/technique combinations were not approved.

## Whole-card production

Every face was generated independently as one finished illustration: paper,
texture, border, rank indices, suit objects and court composition together.
No production cards were extracted from the comparison board. Court figures
hold their suit objects naturally, with horse faces unobstructed. There are
no court-name labels, floating suit plaques, pasted character cutouts or
code-generated replacement frames. Suit-specific pip arrangements vary naturally.

The user rejected an earlier composition of isolated parts. That implementation,
its source generations and its prompt records remain outside the approved tree
and shipped credits. Its approval cannot be inferred from the approved identities.

Keep each pack's full-card reference and the comparison board attached when
generating or editing a card. Preserve the actual parchment, ink, border,
materials, suit silhouettes, costume and illustration medium. Compose the
requested rank and suit deliberately; count the large central objects separately
from the two small corner suit marks. Keep only numeric rank indices as text.
Prompts alone do not guarantee consistency: review every completed card against
the pack, the authoritative domain deck, and small-size rendering.

## Mountain Keep correction review — 2026-11-23

The user identified incorrect corner symbols on coins, cups 2–3 and clubs 7,
inconsistent corner swords (including the malformed ace symbol), and an
unnatural hand holding the club on rank 10. Close-up review also found the same
green club error on rank 2. The correct references are the octagonal mountain
coin on rank 11, the pewter tankard on cups 11, the complete steel/brown/brass
corner sword on swords 4, and the iron-banded oak club on clubs 10.

The user clarified that these corrections must regenerate the complete card
assets. Preliminary code-based symbol-copying drafts were discarded outside
the repository and were never adopted. Use complete-card image generation for
these corrections, preserving the main composition, counts, indices, parchment
and border. The club grip correction follows the same complete-image approach.
The manifest retains each actual edit prompt, its input references and hashes,
and its generated output provenance. The adopted pass replaces 23 complete faces:
coins 1–7, 10 and 12; cups 2–3; swords 1–3, 5–7 and 10–12; clubs 2 and 7;
and the club-holding hand on clubs 10. Coins 11 and swords 4 remain the
unchanged suit references. Both corners and all central counts were reviewed
in full-card sheets and enlarged index details. On 2026-11-24 the user rejected
both downward-grip repair attempts and explicitly requested an entirely different
pose similar to the 10 of Swords: elbow bent, hand at chest height and club
upright, with its broad oak head above the hand. Regenerate the entire card
using the 10 of Swords as a pose reference; keep the correct club indices and
Mountain Keep identity. Superseded edit prompts and hashes remain in the manifest
history. The upright-pose replacement was adopted after full-card and enlarged grip
review. Its broad club head stays clear of the face and both indices.
Runtime verification follows below.

## Maritime Guild correction review — 2026-11-24

After accepting the completed Mountain Keep corrections, the user requested
matching Maritime Guild corner symbols: cups must match the clear sea-glass
symbol on cups 11; swords must use one consistent sword design; clubs 7 must
use the rope-bound wooden club rather than the green symbol.

Regenerated 19 complete cards with the built-in OpenAI `image_gen` tool:
cups 1–7, 10 and 12; swords 1–6, 10–12; and clubs 7. Cups 11 is the unchanged
glass-goblet reference. Swords 7 is the unchanged curved silver-blade reference,
with a blue rope grip, gently curled guard and round compass-rose pommel.
Clubs 11 supplies the rounded wooden head, narrow handle and tan rope binding.
The existing target card and its suit reference are attached to each edit.

Both corner symbols were reviewed in enlarged pairs, and every complete card
was checked for its original central count, arrangement, court anatomy and pose,
clear index spacing, parchment and rope-and-wave border. Corrections are part
of full generated card images; no code-based symbol copying was used. The
manifest retains exact edit prompts, reference/input hashes and generated
output hashes. All 19 corrected masters and runtime exports are adopted.

Verification: 10 tests pass across the four artwork/texture/inventory/collection
test files; all 123 runtime hashes and the three exact rotationally symmetric
backs verify. A before/after hash audit confirms exactly 19 masters and their
19 runtime exports changed, preserving Mountain Keep, Moonlit Grove, all coin
cards, backs and the Maritime reference cards. Lint, formatting, TypeScript,
notice checks and production build pass. Maritime Guild passes 10 landscape
viewport sizes in both themes (20 checks), How to Play, Sings and WebGL previews,
with all 41 collection images decoded and no page errors or horizontal overflow.

## Moonlit Grove correction review — 2026-11-24

The user requested matching corner symbols on coins 1–5, all cups except the
correct rank 10, and the swords. They explicitly liked the blade variations
on swords 5–7 but wanted consistent handles. The final repeated “cups 7” request
was interpreted as clubs 7 from suit order and its visibly incorrect green club;
this interpretation was stated before work began.

Regenerated 24 complete cards with the built-in OpenAI `image_gen` tool:
coins 1–5; cups 1–7, 11–12; swords 2–7, 10–12; and clubs 7. References remain
unchanged: coins 6 supplies the crescent/acorn/oak-leaf bronze emblem; cups 10
the low carved wooden drinking bowl; swords 1 the bronze leaf sword with brown
leather grip, oak-leaf guard and acorn pommel; clubs 10 the knotted blackthorn
root cudgel with a leather grip. Coins 6–7/10–12, cups 10, swords 1 and other
club cards retain their accepted artwork.

Both corner symbols and every full card were reviewed for matching objects,
correct counts, composition, court anatomy and pose, parchment and root/leaf
borders. Swords 5–7 retain their blade geometry, arrangements and surface
variations; all central hilts use consistent leather wraps, oak-leaf guards and
complete acorn pommels. Additional complete-card image refinements aligned
those pommels and corrected lower-bowl orientation on cups 1, 2 and 4.
No code-based face compositing or glyph copying was used. Exact generation and
refinement prompts, input references, archive hashes and final output hashes
are retained in the same prompt manifest. All 24 corrected masters and their
runtime exports are adopted.

Verification: 10 tests pass across the four artwork/texture/inventory/collection
test files, and all 123 runtime hashes and three exact rotationally symmetric
backs verify. A before/after hash audit confirms exactly 24 masters and their
24 runtime exports changed, preserving Mountain Keep, Maritime Guild, the
Moonlit reference cards and all other artwork. Lint, formatting, TypeScript,
notice checks and production build pass. Moonlit Grove passes 10 landscape
viewport sizes in both themes (20 checks), How to Play, Sings and WebGL previews,
with all 41 collection images decoded and no page errors or horizontal overflow.

## Shared backs and the approved processing exception

The user explicitly approved **back-only rotational normalization** on 2026-11-23
after asking for the recommended approach. The original generated upper half is
retained, with its 180-degree-rotated counterpart forming the lower half.
An odd centre row is mirrored horizontally where needed. The original source
generation hash remains recorded. This adds no new ornament, border or labels.

The same operation is applied after resizing the back, then encoded losslessly.
Both the full-resolution back masters and runtime backs are checked pixel by pixel
under a half-turn, including alpha and all visible RGB values. RGB values under
fully transparent pixels have no rendered appearance. The centre joins are
reviewed visually. Each pack uses exactly one identical back URL for all its cards.
**No face receives this processing.**

## Files and provenance

Full-resolution card masters are the individually named lossless WebP files in
this folder. Runtime cards are standalone **504×704 WebP** images under
`src/assets/cards/decks/<pack>`, preserving the 63:88 presentation.
Face exports use quality 92 and preserve the complete image with proportional
contain resizing and transparent padding. Back exports are lossless.
There is no cropping, stretching, extra paper, framing or text overlay.

The single [prompt manifest](prompts.json) records actual prompts, provider,
generation date, exact input references, source-generation SHA-256 hashes,
master/export hashes and the approved back edit. The built-in OpenAI
`image_gen` tool was used; it did not expose its exact model identifier.
The approved board was generated without image inputs. Initial production inputs were
only that independently generated board and the corresponding full-card reference;
correction inputs also include the project's own generated cards described above.
No commercial deck or downloaded stock artwork was supplied as an image input.
Original PNG outputs remain in the tool's generation archive; portable,
original-resolution lossless masters are retained here.

Generated origin and permission review are separate. Applicable provider/account
terms and final permission review remain explicitly pending in the inventory.
[OpenAI's Terms of Use](https://openai.com/policies/terms-of-use/) were consulted
on 2026-11-23; the exact applicable individual, regional or business agreement
was not established. No exclusivity or legal-clearance claim is made.

The former SVG deck was reported as an Illustrator redraw from an unidentified
Shutterstock reference with permission not established. Its 40 faces and back
have been removed from runtime distribution. Replacing them does not resolve
historical permission or revoke rights granted for earlier versions.
Separate third-party font, icon and audio notices remain intact.

## Reproducible exports

Run from the repository root with export-only tooling outside the app:

```sh
npm install --prefix /tmp/fall-artwork-tools sharp@0.35.5
node scripts/export-card-artwork.mjs /tmp/fall-artwork-tools/node_modules
node scripts/export-card-artwork.mjs /tmp/fall-artwork-tools/node_modules --check
```

The explicit `--normalize-backs` option records and applies the approved
one-time back-master edit. Ordinary exports retain those masters and enforce
exact symmetry again after back resizing. The script reads the authoritative
domain deck, verifies provenance hashes and dimensions, and adds no application
dependency. It never composes or edits face illustrations.

## Runtime ownership

`src/domain/artwork/decks.ts` is the framework-independent visual catalog.
The infrastructure artwork adapter resolves URLs and completed-pack availability;
the existing preferences adapter persists the selection and validates old or
invalid values. Shared `SuitGlyph`, `DeckPicker`, `useDeckArtwork` and
`three/CardArtwork` serve flat and 3D consumers. The texture pipeline preserves
the complete artwork and alpha without a second paper or inset.

The `cardCollection` module owns the `/dev/cards` screen, with all 40 faces and a
shared-back preview. Settings exposes the selector in both builds; its development tools group links to the collection alongside the component gallery and animation playground. The shared `/dev` route and all three tool routes are registered only in development.
The component gallery includes isolated pack previews. Gameplay, How to Play,
Sings and the animation playground use the same selected pack.
Domain suits, ranks, shuffling and game rules are unchanged.

## Verification

All 120 faces were visually reviewed in complete-deck contact sheets. All 84
numbered faces have correct central counts; all 36 court faces show the correct
rank and suit, with unobstructed mounted figures. The user correction pass above
supersedes the initial corner-symbol and hand-anatomy review.
The three identities retain their approved materials, paper and borders.

Final verification on 2026-11-23:

- 532 tests pass across 98 test files, including all 123 asset mappings, export hashes, inventory coverage, preferences, routing, textures and feature integration.
- Lint, formatting, TypeScript, both notice checks, export integrity and the production build pass.
- All three packs pass 10 landscape viewport sizes in both themes (60 layout checks), from 568×320 to 1920×1080, with all 41 images decoded per pack and no horizontal page overflow.
- How to Play, Sings and the live 3D animation playground render each pack in both themes without page errors.
- All three selections survive reload and retain audio/motion preferences. The Settings collection link and isolated gallery preview work.
- A live Moonlit Grove opening deal and card play were exercised, including the 3D handoff, with correct skin images and no page errors.
- Full-resolution and runtime backs pass exact half-turn pixel comparison; their centre joins were visually reviewed.

Physical iOS/Android review was not performed. Provider/account-term applicability remains explicitly pending in the credits inventory; generated provenance does not establish legal clearance.

Correction verification on 2026-11-24:

- All 22 regenerated symbol corrections were reviewed as complete cards and enlarged pairs of index details; central pip counts and court compositions were rechecked.
- The two downward-grip edits were rejected by the user. The adopted upright-pose replacement follows the 10 of Swords: bent elbow, hand at chest height, straight wooden handle through the grip and broad club head above the hand. The complete card and enlarged hand/handle were reviewed.
- The four relevant artwork, texture, inventory and collection test files pass (10 tests); all 123 runtime hashes match the manifest.
- Export integrity, exact shared-back symmetry, lint, formatting, notice checks, TypeScript and production build pass.
- Mountain Keep passes the same 10 landscape sizes in both themes (20 checks), plus How to Play, Sings and WebGL previews, with all images loaded and no page errors or horizontal overflow. The final club-hand runtime image is checked separately after its replacement.

## Development tools and final verification — 2026-11-24

At the user's request, the collection moved from `/cards` to `/dev/cards` under
one shared `/dev` route parent with `/dev/components` and `/dev/animations`.
The collection link is grouped with those tools in Settings. All three routes
and links are development-only; the persisted deck selector remains available
in production Settings. The old `/cards` route is removed.

All 537 tests pass across 98 files, including direct development navigation,
production route exclusion and Settings behavior. Lint, formatting, TypeScript,
export hashes, exact back symmetry, notice checks and production build pass.
Browser checks on the user's server at port 3000 verify all three developer
links, collection navigation and reload, all 41 loaded images at 844×390 and
568×320, both sibling pages and the old route's 404, without page errors.
The physical-device and provider/account-term review gaps stated above remain.
