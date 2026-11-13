# Tavern format picker

The [simplified mockup](mockup-simplified.png) and [detailed mockup](mockup-detailed.png)
show layout and material treatments. The [clean inn painting](background.png)
supplies the background. Generate each mode painting as a standalone 2:3
portrait using the mockups as visual references. Do not crop the mode artwork
from either mockup. Export the full standalone
paintings to [runtime WebP assets](../../../src/assets/lobby/tavern).
[Prompts](prompts.json) records the generation and export instructions.

## Composition

The inn uses a timber ceiling, cool shuttered window, candlelit patrons,
hearth, and oak table. Landscape puts a compact Gwent-inspired ribbon under
each tall brass-framed card. Portrait places the ribbon alongside the
illustration. Short landscape uses a compact header and shorter cards.
Back to Hall uses the shared guide control. Titles, counts, and descriptions
are live text, and the format cards are interactive previews.

| Format       | Count     | Description           | Existing mode |
| ------------ | --------- | --------------------- | ------------- |
| Duel         | 2 players | Face one opponent.    | `1vs1`        |
| Free-for-All | 3 players | Everyone plays solo.  | `1vs2`        |
| Team Match   | 4 players | Play two against two. | `2vs2`        |

Each player holds three cards. Dark backs conceal hands facing away from the
viewer and identify face-down cards on the table. Team Match seats one player
on each side, alternating red and blue clockwise so partners face each other.

## Motion

Opening Tavern pushes into the activated Card Hall card, then brings the inn
into focus before the three formats and ribbons settle. The same inn painting
persists through the reveal and resting view. The sequence draws on the
camera continuity of _Anno 1800_, the scenery-first reveal of _Armello_, and
the distinct card silhouettes and focus of _Gwent_. The shared Hall border effect follows hover, keyboard focus, and touch selection.
The first tap selects a format and the second activates its preview. The ribbon
moves with the card. Each card
expands slightly as its idle reflection passes, then rests until the next pass.
Small embers rise from the hearth in short bursts alongside the candle and hearth glow. Dismissal reverses the entrance and restores focus to Tavern.
Reduced motion skips the animation.

Keep design decisions in this README and temporary review material outside
the repository. The [Tavern module](../../../src/modules/tavern/README.md)
documents implementation and verification. [Issue #101](https://github.com/Donkijote/fall/issues/101)

The format cards layer standalone brass frames over the format illustrations.
Duel uses crossed blades and shields, Free-for-All uses triads of rivets and
stars, and Team Match uses paired shields and pennants. The stitched leather
ribbon sits behind the live player count and description. The picker and
Component Gallery use the same format data.

Idle breathing and the slower hover lift move the illustrated card above the
ribbon. The ribbon and its text stay anchored while the brass brightens.
