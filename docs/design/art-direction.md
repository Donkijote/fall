# Fall art direction

Card Hall is the reference for the web game's current visual language. The Hub
shifted from an explorable town to illustrated activity cards so players can
recognise a destination and its availability without interpreting the scene.
The environment establishes the world. Live interface elements handle navigation.

Start with the [design library](README.md) and [Card Hall references](home-lobby/README.md).
Use the running Hub for interaction and typography, and the masters for
illustration and composition.

## Visual language

- **World and materials.** Use textured, painterly medieval interiors and
  grounded characters. The hall pairs cool window light, aged slate stone and
  quiet shadows with warm oak, parchment, and restrained oxblood and brass.
  Use Spanish-suit details (coins, cups, swords and clubs) where they belong
  in the world or clarify a control.
- **Type and hierarchy.** Use Cinzel Regular (400) for titles and Spline Sans for reading,
  labels and controls. The shared `artwork-title` utility defines the Hub
  wordmark and mode titles, with regular-weight uppercase display type, warm parchment
  contrast and a soft shadow. Keep readable live text over artwork. Give the
  main action the clearest contrast. Use shared gold for illustrated frames
  and selection cues, and shadcn border and focus tokens for ordinary controls. Reserve the brand red for primary actions where a separate
  button is useful.
- **Controls and surfaces.** Use compact icon groups, engraved or lightly
  framed surfaces, and clear states. Reuse shared components under
  `src/components` and semantic tokens in `src/index.css`. Keep the
  generated primitives under `src/components/ui` as the core.
- **Responsive art and motion.** Compose for the controls in each orientation.
  Let the background extend to the viewport edge and keep controls inside
  safe areas. Use GSAP for DOM motion, Three.js or React Three Fiber for
  3D scenes, and Three Quarks for 3D particle effects. Apply the same rule
  to fades and control feedback. Tailwind and CSS define static styles and
  layouts. Keep static focus cues under reduced motion. Card Hall uses
  depth drift, a moving gold rim, embers and light parallax. See the
  [UI implementation rules](../../AGENTS.md).

## What the approved mockups show

All five pairs use warm ivory type, dark surfaces, brass accents, and materials
from the same medieval world. They differ in how much warmth, texture, and
ornament the generator carried into the UI.

| Feature     | What to carry forward                                                                                                                                                         | Where to normalize future revisions                                                                                                                                                                                                    |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home lobby  | Cool slate and window light balance the brown oak. The simplified image sets the color balance and the detailed image shows where brass engraving and richer painting can go. | Keep the simplified silhouette and spacing. Limit detailed corner ornaments and crests to focal frames.                                                                                                                                |
| Login       | The brass edge, charcoal card and oxblood action carry across both images.                                                                                                    | The detailed study introduces a large portrait and moves the form. Treat it as a material reference. Use the live mountain backdrop and current form layout for revisions.                                                             |
| Settings    | Both studies preserve the recognizable Hall under the scrim and use a restrained preferences panel.                                                                           | Match the live primary token for Done. The saturated red in the captures is brighter than the shared action color.                                                                                                                     |
| How to Play | The pair preserves the same chapter rail, search and article. The detailed study adds tooling around the reading frame.                                                       | Keep lantern warmth local to the archive and parchment inside examples. Keep chapter navigation and utility controls quiet.                                                                                                            |
| Sings       | Cream cards and small score markers make the examples easy to scan.                                                                                                           | Both studies lean heavily into burgundy and gold, especially the ornate tiles in the detailed image. Use the live sorting-table background and open simplified grid as references. Keep card faces and values faithful to the catalog. |

Use the [simplified Card Hall](home-lobby/mockup-simplified.png) as the palette
and UI restraint anchor, the [clean Hall](home-lobby/background.png) for
lighting and materials, and the [simplified](how-to-play/mockup-simplified.png)
and [detailed](how-to-play/mockup-detailed.png) rulebook pair as the example of
how to add ornament while preserving the composition. For each screen, use its
own approved mockup or the running screen for layout.

## Shared generation prompt

Prepend this block to each feature brief. Attach the anchor images relevant
to the output and identify each attachment's role. Add the feature brief and
select one treatment.

```text
Create an image for Fall, a medieval Spanish-deck card game. Use the simplified
Card Hall reference for palette, value balance, and UI restraint. Use the clean
Hall reference for materials and lighting. Use the feature reference for
composition, and preserve the current backdrop when revising an existing screen.

Paint matte, believable materials with broad value groups and selective detail:
cool slate or blue-gray shadows, aged oak, warm ivory and parchment, and muted
aged brass. Keep warm light near its source. Let dark charcoal and slate occupy
most of the frame. Keep red to the primary action and small accents. Preserve the
same color balance across treatments. Avoid a scene-wide orange or burgundy wash,
saturated yellow gold, bloom, and glossy or heavily beveled surfaces.

For UI mockups, use Cinzel Regular (400) for headings and Spline Sans for functional text.
Use warm ivory for text over art, quiet charcoal for dark surfaces, and pale
parchment with dark ink for light surfaces. Follow the live theme for controls:
primary for the main action, gold for selective trim or emphasis, and semantic
surface, text, and border colors for the rest. Preserve the app's 8 px radius
for ordinary controls and framed surfaces. Give typography and card faces
space to read. Use Fall's Spanish suits and supplied card examples.

Simplified treatment: use matte surfaces, fine borders, clear type, and minimal
decoration. Keep material texture in the scenery and illustrations. Reserve
brass for selection, focus of attention, and a few frame edges.

Detailed treatment: keep the approved simplified layout, spacing, copy, assets,
type hierarchy, and palette. Add shallow engraving, a little material grain,
and restrained bevels at the main frame or focal illustration. Keep inputs,
navigation, and supporting panels quiet. Use the two rulebook references to
judge how much ornament to add.

Clean background treatment: preserve the scene's camera, light direction,
material colors, and key landmarks. Compose quiet areas behind live controls
and leave the artwork free of text, UI, and watermarks. For viewport variants,
reframe the same scene to keep landmarks and reading areas visible.
```

Use the current semantic tokens in [src/index.css](../../src/index.css) when
the brief needs color values. Older prompt text records how an image was made.
If it specifies a conflicting color or treatment, follow this guide and the
current tokens for the new generation.

## Artwork and prompts

For a new feature, use the shared prompt with the relevant Card Hall anchors.
For an edit, attach the approved output as the edit input and describe the
change to make. Generate the simplified composition first when both treatments
are needed. Use that result as the detailed edit input. Before approval,
compare the pair side by side for palette, lighting, and layout. Check that
the primary action, text, and illustrations keep their intended emphasis.
For a background variant, compare it with its default master at the intended
aspect ratio.

Follow the [design folder standard](README.md#feature-folder-standard) for masters,
exports and prompts. For third-party artwork, record the source, creator, license
and modifications alongside the asset for the credits inventory. Card Hall's
[artwork inventory](../../src/assets/lobby/card-hall/README.md) and
[icon credits](../../src/assets/lobby/card-hall/icons/README.md) are examples.

## Current interaction baseline

Tavern opens the existing Caída format picker. Mouse and keyboard activate
directly, while touch highlights the card on the first tap and opens it on the
second. Campaign and Arena are coming-soon previews. Progression and balances
shown in development are sample data. The portrait status bar in the installed
iPhone PWA remains a separate follow-up. The app already accounts for the
reported safe areas around its Hub controls.

## Follow-up issues

- [#101 Tavern format picker](https://github.com/Donkijote/fall/issues/101)
- [#102 Login](https://github.com/Donkijote/fall/issues/102)
- [#103 How to Play](https://github.com/Donkijote/fall/issues/103)
- [#104 Settings](https://github.com/Donkijote/fall/issues/104)
- [#105 Credits and Licenses](https://github.com/Donkijote/fall/issues/105)
