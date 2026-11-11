# Tavern format picker design review

[Issue #101](https://github.com/Donkijote/fall/issues/101) · [Card Hall references](../design/home-lobby/README.md) · [Shared art direction](../design/art-direction.md)

## Composition

Move from the Card Hall lobby toward its worn oak table. Keep the cool window
light and slate arches recognizable at the closer angle. Use the tabletop as
the shared setting for all three choices. Show each format through a distinct
arrangement of face-down Spanish-deck cards: two opposing seats, three seats
in a triangle, and two facing pairs.

Use Cinzel for the Tavern heading and Spline Sans for the controls. Give the
illustrations restrained brass frames, keep text on readable semantic
surfaces in both themes, and use the shared primary token for action and
value colors. Each format card launches its match directly.

| Format | Count | Description | Existing mode |
| --- | --- | --- | --- |
| Duel | 2 players | Face one opponent. | `1vs1` |
| Free-for-All | 3 players | Every player plays for themselves. | `1vs2` |
| Team Match | 4 players | Play two against two. | `2vs2` |

On desktop, use three compact cards with the tabletop visible around them.
On phones in portrait, use full-width rows with compact artwork thumbnails
so labels and counts can be scanned together. In short landscape, use a
compact header and three shorter cards. Keep Back to Hall and the format
actions inside the safe areas, with vertical scrolling if space runs out.

## Entrance and return

| Time | What the player sees |
| --- | --- |
| 0–120 ms | The activated Tavern card holds its brass highlight while the rest of the lobby chrome recedes. |
| 80–330 ms | A short push toward the Hall table blends into the closer painting, using the window light and wood grain as visual anchors. |
| 240–550 ms | Three cards slide a short distance into their resting positions, with a small stagger. The heading and Back to Hall settle with them. |

Borrow the camera continuity and separated UI layers from the two *Anno
1800* clips, the scenery-first reveal and clean return from *Armello*, and
the distinct card silhouettes and focus emphasis from the two *Gwent* clips.
Use a short return to Card Hall and restore focus to Tavern when dismissing.
With reduced motion, show the destination immediately and keep a static focus
cue. The timings are proposed for review.

## After design approval

Save the approved simplified and detailed treatments and clean painting under
`docs/design/tavern`. Record generation prompts and references in
`prompts.json` and place optimized artwork variants in `src/assets`.
Keep the UI live and animate it with GSAP.

Preserve player gating, bot defaults, deep links, and game navigation.
Verify the three mappings, keyboard activation and dismissal, return focus,
touch targets, safe areas, short landscape, and reduced motion.
