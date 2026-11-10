# Game-styled components

This is Fall's reusable presentation layer. It is deliberately **outside**
`src/components/ui`, which remains the generated shadcn/Base UI core.

## Ownership boundary

- `ui/`: upstream primitives, accessibility infrastructure and generated defaults.
  Do not add Fall's bronze frames or Card Hall styles there.
- `game/`: Fall's reusable styled components. They use Tailwind utilities and
  consume the shared semantic tokens in `src/index.css`.
- Feature modules: activity data, state transitions, routing and page composition.

`GameButton` and `GameDialogContent` wrap public core components without changing
their implementation. Other elements compose semantic HTML and Lucide icons.
No styled-components dependency, game store, router or Home asset is required.

## Components

| Component            | Responsibility                                                                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `GameButton`         | Quiet/primary action and icon-button presentation over the core Button; preserves its refs, disabled state and interaction behaviour.     |
| `GameActivityCard`   | Controlled activity selection with real title/description/caption, native keyboard activation, image fallback and a forwarded native ref. |
| `GamePlayerIdentity` | Name, optional real level and avatar/theme-portrait/icon fallback. Missing levels render Local profile, never invented progression.       |
| `GameNavigation`     | Icon-and-label destinations supplied by the caller; explicit unavailable labels, no fake feature behaviour.                               |
| `GameContextStrip`   | Compact icon/label/detail context, independent of a quest implementation.                                                                 |
| `GameDialogContent`  | Themed content wrapper over core DialogContent, retaining its portal, dismissal and focus handling.                                       |

## Theme and sizing

Components follow the application appearance through shared surface, text, border,
gold and primary tokens. Labels over illustrations use the global artwork contrast
tokens. Components retain 44px action targets and visible keyboard focus.

GSAP gives each activity card independent randomized position, depth, tilt and
timing. Selection, keyboard focus and pointer hover reveal a pulsing gold rim,
fourteen drifting embers and sparks, a light sweep and gentle movement of the painting.
Unavailable artwork retains its greyscale filter. Decorative effects are hidden
from assistive technology and never intercept input. Reduced motion leaves the
static active rim and size emphasis. The GSAP context reverts when the card
unmounts or the motion preference changes.

## Example

```tsx
import { GameButton, GameActivityCard } from "@/components/game";

<section>
  <GameActivityCard
    title="Activity"
    description="A real destination"
    imageUrl={artwork}
    imageWidth={400}
    imageHeight={400}
    selected={selected}
    onClick={onSelect}
  />
  <GameButton tone="primary" disabled={!available} onClick={onEnter}>
    Enter activity
  </GameButton>
</section>;
```
