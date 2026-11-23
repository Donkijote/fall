# Tavern match lobby and board

## Supported layout — #137 (2026-11-20)

The match uses only `table-landscape.webp`. Table, seats and overlays use the smaller landscape presentation by default, with larger viewport overrides. Smaller landscape layouts use unprefixed Tailwind utilities; larger layouts use standard width breakpoints. No orientation lock or rotate-device gate is implemented here; enforcement and native integration belong to #140. Earlier viewport reviews below describe historical implementations, not current portrait support.

Retired export prompts and generation evidence are preserved in [the provenance ledger](../../artwork-provenance/retired-portrait-exports.json).

The match table continues the [Tavern format picker's inn](../tavern/README.md).
The first concept is under review in the working chat. [Issue #116](https://github.com/Donkijote/fall/issues/116)
tracks the intended flow.

## First sketch

The supplied Gwent and Legends of Runeterra screenshots inform the layout:
player identities and hands sit at the edges, leaving the middle for shared play.
The supplied Teamfight Tactics screens are references for readable matchmaking
status. The Tavern table carries that status directly above the play area.

The landscape sketch puts the local player at the bottom in every mode. Duel
puts the opponent across the table. Free-for-All tests two seats on the far
corners. Team Match puts the ally across and opponents to the left and right.
The same Team Match composition shows a partially filled table and an active
match, with waiting status giving way to turn status and the hands and cards
appearing on the table.

The first pass uses one oak table with the seat layout driven by the selected
format. Additional board skins are a future direction. The perspective,
Free-for-All seating, and scale of the seat badges are open for review.

## Second sketch

Keep the mode title, waiting count, and cancel action visible during
matchmaking. Clear them when play begins. Indicate the active turn on the
player's portrait. Keep the local hand along the bottom and test compact
face-down fans beside remote portraits.

Reserve one collector pile beside each player's seat. Keep the draw deck
beside the current dealer, with a distinct position from that player's
collector pile. Leave the middle of the table available for the four opening
cards and later cards in play. Move the candle and cup off the play surface.
The 2v2 study tests the fullest seating layout. Its later board is a space
check with example cards, and card arrangement and sizing are open for review.

## Initial implementation

The [waiting and opening study](mockup-simplified.png) and the
[crowded board study](mockup-detailed.png) are the provisional references.
Use the crowded study for team identities and the active player's visible
hand. The playable board remains a later step.

The [clean landscape master](background.png) supplies the oak table and
the inn surroundings. The [runtime exports](../../../src/assets/lobby/tavern-match)
include a separately composed portrait scene. The waiting panel of the
simplified study sets the camera: the near table edge fills the foreground
and the inn appears above the far edge. Compact live seat markers show
avatars or an empty-seat icon around the tabletop. The
[prompt manifest](prompts.json) records generation and exports.

The first implementation ends at the waiting table. It demonstrates travel
from the Tavern picker, the selected format and live waiting count, and
the reverse trip on Cancel, Close table, or Escape. The mode title,
seat progress, and cancel action sit in the middle of the table until all
mock guests have arrived. Then the waiting panel clears and a mock mid-round
board appears for layout review. The six shared cards occupy the center. Each
seat has a three-card fan and a collector pile beside its profile. The dealer
also has the draw deck. Across screen sizes, the top and bottom seats put
their hands to the right and their piles to the left. The side seats put
their piles above their profiles and their hands below.

## Seat badges

Use a round brass medallion for an occupied seat and a chamfered brass frame
with a chair icon for an open seat. Join each medallion to a dark, clipped-end
nameplate. A lit rim and small pointer aimed at the portrait identify the active seat. The waiting
preview shows that cue on the local seat. The mock board displays a Dealer
badge when play begins. The glow and drifting hearth ash follow the light sources in
each orientation. Three Quarks renders tumbling ash flakes as small angular meshes. The [wooden chair credit](../../../src/assets/lobby/tavern-match/README.md)
records the supplied empty-seat icon. The upper-right close control follows
the supplied Teamfight Tactics match-found reference and retains the
accessible name Close table. A gold dealer badge overlaps the lower-right corner of the nameplate.

## Playable table

[Issue #117](https://github.com/Donkijote/fall/issues/117) uses the existing
table and seats for live local play. The local hand is face up and only accepts
input on your turn. Cards occupy open spots in a fixed grid, and existing cards keep their spots when other cards land or are captured.
The draw deck and collector piles show whether they are empty, without revealing their sizes during play.
Scores sit in the bottom-left corner. The seat pointer identifies the active player. The dealer's opening choices, the round count, and
the result use the shared framed surface in the middle of the table.

The local table runs the Playground's 3D card sequences and sounds with the
active dealer, real card artwork and the positions of the hand, table cards,
and collector. Reduced motion uses immediate board updates and keeps sound
available through the same game preferences.
The same composition supports desktop and phone portrait and landscape.

## Match overlay review

[Issue #120](https://github.com/Donkijote/fall/issues/120) extends the playable
table. The first study was rejected because the uniform panels and full-width
score bar felt like web UI. The revised landscape and portrait concept boards
were approved with one revision. Both result coins use the Cups suit glyph from
Fall's card deck as their emblem. The [locked overlay reference](overlay-mockups.png)
shows the approved design with live game content.

- **Results.** Gwent gives the outcome its own silhouette and uses the board
  as the backdrop. Fall's Victory uses a hammered cup-stamped coin, oxblood
  pennant. Defeat uses a split coin, steel, and a
  downward slate pennant. Armello informs the complete finish order, and
  Clash Royale informs the stacked standings on phones. Show the winner,
  every side's final score on a brass-trimmed walnut standings plaque with
  color-matched rank medallions. Use an illustrated oxblood plate for
  Back to Tavern. The result heading carries the outcome by itself.
- **Waiting.** Hang a carved Tavern sign above the undealt table. Show the
  format, one occupied or empty marker per seat, the seat count in text,
  and a quiet brass-trimmed Cancel matchmaking action. Use the existing chair icon for each open seat.
- **Playing.** Gwent puts its score figures at the edge of play. Give Fall
  a dark oak tally with an illustrated brass rim and a Cups medallion.
  Use blue and red nameplates for the two Duel players or the two Team
  Match sides, and add green for the third Free-for-All player. Repeat
  those colors in the enamel behind ivory numbers in individual illustrated
  brass counters. The tally shows totals in all formats, with player or team names
  available to screen readers. The wider Duel counters keep the plaque
  proportions balanced with two players. The tally floats above the board. On short
  landscape screens it moves left for Duel and Team Match and stays centered
  for Free-for-All. The borderless door control sits at the upper right.
- **Opening deal.** Use a carved dealer's board framed in stitched leather
  with two card backs at the top. Show both choices for deal order and table
  pattern as radio groups, with Deal cards below. Stack the groups on narrow
  portrait screens and keep them side by side in landscape. Use hand
  and table icons to show deal order, and ascending or descending steps
  for the table pattern. The full labels remain available to screen readers.
- **Counting captures.** A leather-lined tray with brass abacus beads
  holds a card tally and a coin counter for each side. Both start at zero
  and show only the counts reached so far. Once a side reaches
  its capture quota, each extra card lands on the coin counter. The tally
  pops and an Extra card callout rises above it. Reduced motion shows the
  settled totals briefly before play resumes.
- **Leaving.** Faeria's surrender prompt keeps the stakes and choices in
  focus while the board remains recognizable. Mount a small parchment in a
  leather frame with a wax seal. Explain that leaving ends the match and
  discards progress. Keep playing uses the oxblood action with brass trim.
  Leave match uses an ink outline that reads against the parchment. Short
  landscape screens use a taller parchment with side-by-side actions. Leaving while
  waiting still uses Cancel matchmaking.

Build from separately authored, text-free ornament art over the existing
Tavern scene. Render labels, seat status, standings, and buttons as live UI.
Reuse the current Spanish deck, seat placement, shared controls and semantic
tokens. The [runtime ornaments](../../../src/assets/lobby/tavern-match) are
text-free transparent WebP exports. The [prompt manifest](prompts.json)
records their production briefs.

Chrome verification covered the score HUD and leave flow in all three
formats at desktop, phone portrait and landscape, and tablet portrait and
landscape sizes. Complete local matches exercised both result crests,
standings, and the return to Tavern. Additional desktop and phone
landscape checks ran with standard motion in light and dark themes.

Seat nameplates and the Deck and Collected labels use a shared blackened iron
plaque with rounded inward corners. Dealer appears beside the player name. A
bronze arrowhead points toward the active portrait, and the ring artwork
brightens with a continuous GSAP glint around the ring. Reduced motion keeps the ring steadily lit.

The approved [Tavern Pennant scoreboard](scoreboard-mockup.png) pairs a charcoal
cloth banner and embroidered oak sprigs with ivory tiles and wax seals. The blue
sword, red cup, and green wooden club identify the score sides. The board uses
live numbers and sizes the pennant around two or three equal tiles.

The approved [Counting Captures mockup](capture-count-mockup.png) retains the
illustrated tray. Team nameplates sit above the leather pockets and ivory
capture totals. The bonus coin sits in the center of each pocket, with the
scoreboard's wax seal at the lower right. The parchment ribbon appears when
the capture playback awards an extra card.

The approved [Dealer’s Ledger opening deal](opening-deal-mockup.jpg) places
two wax selection groups beside a parchment preview. Hands first and Table
first swap the destination illustrations. The four ivory tiles show the chosen
bonus target. GSAP slides illustrations and tiles into position, while reduced
motion updates immediately. Portrait phones stack the preview below the
choices. The existing frame uses protected corner and crest slices.

The final standings pair the shared team nameplates with points medallions.
Both victory and defeat use the same responsive rows inside the illustrated
standings panel.

Opening Deal uses a card-hand glyph and a round wooden table in its preview,
with a solid directional arrow. Faded rules flank the preview headings, and
the main heading has a centered oak sprig divider. Rank tiles use lining serif
numerals and a small shadow to lift them from the parchment. The wax selectors
sit inside the shared input frame with clearance around their painted edges.

The approved [waiting seat tokens](waiting-seats-mockup.jpg) replace the occupied
seat check with an illustrated bronze coin stamped with a seated traveller.
Open seats retain their wooden chair glyphs. New arrivals settle into place
with a short GSAP motion, and reduced motion updates immediately. The gallery
includes a join preview to inspect the transition.

## Empty pile artwork

Empty collected and deck piles use shared EmptyCardSlot, a recessed treatment
composed from the approved [input artwork](../text-input/README.md). Card faces,
stack movement, pile labels, and game behavior remain unchanged. The gallery
exposes this decorative recess separately for future reuse.

## Current-turn motion review — GHI #124

The shared portrait ring draws and wipes clockwise behind its orbiting glint;
see the [player identity motion specification](../player-identity/README.md).
The turn arrow springs into place once, then scales/fades away at handoff rather
than disappearing with an unmounted image. It does not bob continuously or move
the seat, nameplate or portrait artwork. Reduced motion keeps immediate active
ring and arrow states. The live MatchSeatMarker gallery preview includes a Pass
turn control to compare both players and interrupt handoffs.

During card-deal playback, including the table/hand deal after dealer selection,
the dealer keeps the active ring and arrow until the deal completes. The next
player's turn begins at the completed frame. Partial ring arcs use soft gradient
edges for both arrival and release rather than a sharp radial cutoff.

## Earned-points treatment — #127

Implementation uses the existing standalone PointsBadge brass artwork: one weighted
token displays the full resolved `+amount`, accompanied by the award reason near
its source, then arcs into the recipient's ivory score tile. This keeps large
awards readable and bounded. A short coin trail was considered; the single token
was selected to avoid crowding the compact landscape scoreboard and to preserve
an exact visible amount. No new illustration, palette, or asset export is needed.

Awards start after their card/capture-count handoff and queue in resolved order.
The destination gives a restrained pulse and the tally counts to its new value.
A match-winning token finishes before the illustrated result. Reduced motion uses
an immediate tally and a static recipient/amount/reason message. The component
gallery includes deterministic controls for sources, simultaneous recipients,
winning amounts and reconnect snapshots in every format. This implementation
awaits manual responsive visual review; it does not change approved art masters.

### Pocket-counting revision

Cards now leave each player's collected pile and enter the
opening of their team's existing leather pocket. Both quota and extra cards take
this route; extras retain the bonus coin/ribbon response. Cards size to the pocket,
approach above its lip, and are progressively hidden behind it as they descend.
This replaces the separate quota-card stack on the table. The animation playground's
Table → Count cards study now uses the live counter artwork and renderer for review.
No artwork master or runtime image changes are required. Visual validation was approved by the user on 2026-11-19.

The earned-points badge now scales down for compact boards and docks inside the
recipient's measured score tile. Its provenance label fades during travel; the
flight pivots around the badge itself and stays inside the board edges. This
addresses clipping at the top scoreboard in mobile landscape without changing
the shared PointsBadge artwork or its appearance elsewhere.

The user approved the responsive points-flight validation on 2026-11-19.

### Table build bonus playground proposal (#136)

Requested on 2026-11-23: prototype the table build bonus before the clean-table
animation, and review both in the animation playground before live-match adoption.
The Table → Table bonus study slows the four table landings, highlights only resolved
qualifying cards and strengthens feedback for consecutive matches. A perfect
four-card pattern gets a large central award before the existing score token;
partial patterns use the ordinary points token after source feedback. No-bonus
patterns receive neither winner highlights nor points. A gap breaks the visual
streak without removing any independently earned points.

The study includes both directions/orders, every format and dealer seat, and
perfect, partial, broken, absent and match-winning awards. Reduced motion keeps
static source and recipient feedback. It reuses existing card and points artwork
with existing semantic tokens; no new images, masters or palette tokens are introduced.
This proposal awaits visual review. Clean-table choreography and adoption in the
live match remain pending under #136.

The 2026-11-23 highlight revision replaces the red focus-like outline with the
existing gold decorative token. Each qualifying landing uses GSAP to lift and
settle the card, sweep light across its face and expand a short glow around it.
Each consecutive success has a brighter, broader halo and stronger lift, sheen
and burst than the previous card. Earlier cards keep their individual intensity;
a gap resets the next card’s streak. Reduced motion keeps the graduated gold
halos without the lift, sweep or burst. This treatment remains a playground
proposal awaiting visual review.

The next 2026-11-23 playground revision follows the requested mixed progression:
one small gold glint, one stronger double pulse, then the existing flame envelope
and heat wave, and finally the existing overhead flame impact plus envelope.
All four retain graduated gold highlights. A nonmatch resets the stages. The
shared Three.js effects track card rectangles, finish before the perfect-table
award/ordinary points handoff and are omitted with reduced motion. This is still
a playground proposal awaiting visual approval, with no new artwork or tokens.

The following 2026-11-23 revision isolates the last two stages as requested:
the third consecutive match uses only the actual shared card heat-transfer shader,
and the fourth uses only the flame envelope. Table waves and flame-impact circles
are removed. Both treatments remain active through the award and points travel
until reset/replay or leaving the preview. Reduced motion retains static halos.
This supersedes the transient mixed effects above and awaits visual review.

The latest 2026-11-23 preview revision softens the card halos with a smaller
footprint, lower background opacity and reduced shadow spread. All source-card
effects now clear after the rewarded points finish their scoreboard arrival,
including persistent heat/flames; the cards remain dealt and visible. This
supersedes persistence until reset. Reduced-motion arrival clears immediately.

### Live opening-table adoption — 2026-11-23

The reviewed playground treatment is now applied to the four cards in each
opening table deal. They land individually over 0.72 seconds each and retain the
same glint, stronger pulse, heat-transfer-only and flame-only progression for
consecutive resolved matches. There is no flame-impact table circle. Perfect
patterns show the shared large award before the ordinary points travel; partial
patterns use only ordinary points. Softer halos, heat and flames clear on the
opening bonus’s scoreboard arrival. Existing hand deals and later plays retain
their movement, sounds and general grid allocation.

The four opening cards form a centred, reading-order 2×2 block in both responsive
grid shapes, retaining their slots when later cards arrive or captures remove
neighbours. Browser checks exercised normal rendered deals at 568×320 and
1440×900, and reduced-motion layouts at 844×390, 1180×820 and 1440×900, across all
formats and both themes. Source effects, perfect award, compound opening/Sing
points and final effect cleanup were observed without page errors. Physical
mobile/native lifecycle verification remains separate. No artwork or palette
tokens were added. Clean-table capture choreography is still pending under #136.

The 2026-11-23 landing refinement removes a brief visibility gap in the opening
deal. Animated cards now hand off to their DOM replacements at one explicit
landing boundary, rather than hiding when eased progress rounds up early.
Timing, source highlights and the 2×2 layout are unchanged.

### Clean-table playground proposal — 2026-11-23

The proposed clean-table treatment is available in Animation playground → Table →
Clean table. The normal capture first removes the table cards. A narrow gold
sweep crosses the cleared space, then “Clean table!” and the existing earned-points
badge pop in and settle with two small brass glints. The resolved recipient is
shown below. The celebration takes one second before the normal points flight
moves the bonus into the scoreboard. All celebration decoration is removed at
handoff; the table remains empty. The shared primary/gold semantic tokens and
existing card, capture-pile and points artwork are retained. No new artwork,
assets or palette tokens are introduced.

Controls expose ordinary capture, cascade, Fall plus clean-table awards, excluded
last-round clear, a capture leaving cards behind and a match-winning clear, across
all formats and capturing seats. Reduced motion skips the sweep/pop and retains
immediate recipient/score feedback. Browser checks at 568×320, 844×390, 1180×820
and 1440×900 covered both themes and completed without page errors. The proposal
awaits visual approval; live-match clean-table celebration integration remains
pending under #136.

The subsequent 2026-11-23 pacing review lengthens the gold sweep from 0.32 to
0.55 seconds and delays the badge reveal to let the sweep read first. The full
celebration now lasts one second before points travel. The subsequent width revision expands the sweep from edge to edge across the
preview board while retaining its central vertical band. The badge stays centred,
and the sweep remains independent of the table-slot grid.

### Live clean-table adoption — 2026-11-23

The user approved the wider, slower gold sweep and requested live adoption. The
actual game now uses the same full-screen-width central sweep, “Clean table!”
badge/recipient reveal and two brass glints as the playground. The sweep lasts
0.55 seconds; the whole source celebration lasts one second before the existing
points flight. It appears after capture/queued deal motion, and clean-table/Fall
awards remain separate flights. Player and bot input waits through feedback and
score settling; winning results appear after arrival. Final-round excluded clears
and non-clearing captures produce no new feedback. Reduced motion retains the
immediate points announcement. Reconnect/leave/unmount cancel decoration.

Live browser checks covered 568×320, 667×375, 844×390, 932×430, 1024×768,
1180×820 and 1440×900 across all formats, both themes, compound Fall points,
excluded clears, winning clears, reduced motion and hand refill with a Sing.
The sweep spanned each tested viewport; effects and input locks cleared after
scoring, with no page errors. No new assets or palette tokens were introduced.

Supplemental verification covered 1280×720, 1366×1024 and 1920×1080, completing
the supported browser viewport targets. An explicit no-WebGL run at 844×390
also preserved capture audio, the gold sweep and exactly one points flight.

### Clean-table contrast artwork — 2026-11-23

The user found that the bare heading and coin did not read clearly against the
wooden table. The initial yellow-gold plaque draft was rejected because its
broad hammered frame differed from Fall's shipped borders. The user approved
the revised dark charcoal plaque with slimmer bronze/brass rails, fine corner
leaves and a small blank-card crest, generated with the existing brass frame,
seat plaque and primary-button artwork as direct image references.

The approved [standalone master](clean-table-plaque.png) is retained at 1536×1024;
the runtime WebP is 768×512 with alpha and is about 30 KB. The game and playground
share the same artwork-backed celebration. Heading and recipient now use the
existing artwork-foreground token; the Cinzel title, PointsBadge and real award
values remain live DOM content. The coin stays anchored at the existing points
flight source. Width and height clamps keep the plaque inside small landscape
boards, and the image preloads before feedback starts. The full-width gold sweep,
its 0.55-second duration, one-second handoff, reduced motion and award queue are
unchanged. No global palette or frame token was added.

Browser checks against the actual wooden table at 568×320, 844×390 dark,
1180×820 and 1440×900 verified readable text, contained content, a decoded image
before reveal, points-source alignment, successful arrival and effect/input-lock
cleanup without page errors. Generation and export details are in
[prompts.json](prompts.json), with a matching credits-inventory record. The
rejected draft is not part of the approved design tree or shipped credits.

The subsequent 2026-11-23 turn-based review removes the bottom recipient name from
the clean-table plaque. The title and earned points remain the visual focus;
accessible score announcements retain award ownership. The two diamonds around
the coin are larger, with ivory cores, soft gold halos, and staggered GSAP motion:
an outward rotating burst, rebound, second bright twinkle and fade. The gold
sweep and one-second points handoff are unchanged. No new artwork was generated.

The diamond revision was checked in the desktop playground: both bright bursts
remain inside the plaque, and no player caption appears under the coin. Focused
timeline tests verify both peaks, outward motion, final fade and interruption
rollback; existing live/preview handoff and reduced-motion tests still pass.
