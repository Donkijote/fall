# Player identity

The [Card Hall detailed mockup](../home-lobby/mockup-detailed.png) guided the
[standalone brass portrait ring](../../../src/assets/ui/player-identity/brass-ring.webp).
The solid brass ring has a smooth rounded profile and casts a small shadow
over the inset portrait.
GSAP adds a brief moving glint, and reduced motion shows the artwork on its own.

The backdrop uses a single shadow color. It begins behind the portrait and
fades softly at the top and bottom and past the end of the experience bar.

Card Hall and occupied Tavern match seats both render the shared
[PlayerPortrait](../../../src/components/hud/PlayerPortrait.tsx).

## Interaction review — GHI #124

The orbit now leads a 650ms clockwise draw of the bright brass ring. The full
ring then retains the existing 1.9s orbit. At handoff, a 650ms clockwise wipe
starts at that live orbital position and removes the bright ring behind it;
the next player's draw can begin immediately. The portrait artwork stays still.
An interrupted first draw retraces its lit arc, and a reactivated wipe retraces
its removed arc, preserving both edges and the glint position. A completed wipe
starts its next draw from the current quiet reflection rather than an old angle.
Reduced motion shows a complete active ring immediately and removes it immediately.
`usePortraitTurnMotion` owns the mask, head, release and idle reflection together.

The match turn arrow uses a bounded 380ms scale/fade with a small spring on
arrival and a 200ms scale/fade on departure. It stays mounted through departure
and reads the actual motion preference independently of seat-arrival suppression
in the playable board. Reduced motion changes visibility immediately.

The gallery's portrait toggle and MatchSeatMarker's Pass turn control render the
real components, including two occupied seats for repeated handoffs. Focused
checks cover draw/head alignment, orbital release, interrupted draw/wipe reversal,
reactivation after a completed exit, reduced motion and cleanup.

The draw/wipe mask feathers both ends of its partial arc over up to 18 degrees,
and the orbiting glint fades across its leading edge. Feather width collapses at
zero and 360 degrees so inactive rings disappear cleanly and complete active
rings have no dim seam. These static gradients follow the existing GSAP angles.
