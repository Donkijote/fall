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
