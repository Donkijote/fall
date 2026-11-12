# Tavern match lobby and board

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
input on your turn. The shared cards wrap in the middle as the table fills.
Deck and collector labels report the number of cards, including empty piles.
The score panel sits above the board, with the active turn shown both in text
and by the seat pointer. The dealer's opening choices, the round count, and
the result use the shared framed surface in the middle of the table.

The local table runs the Playground's 3D card sequences and sounds with the
active dealer, real card artwork and the positions of the hand, table cards,
and collector. Reduced motion uses immediate board updates and keeps sound
available through the same game preferences.
The same composition supports desktop and phone portrait and landscape.
