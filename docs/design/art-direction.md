# Fall art direction

Card Hall is the reference for the web game's current visual language. The Hub
shifted from an explorable town to illustrated activity cards so players can
recognise a destination and its availability without interpreting the scene.
The environment establishes the world. Live interface elements handle navigation.

Start with the [Card Hall implementation](home-lobby/card-hall.md), the
[illustrated concept and clean hall master](main-menu-research/image-concepts/README.md),
and the [exact ImageGen prompts and refinements](main-menu-research/image-concepts/prompts.json).
The concept predates the final UI. Use the running Hub for interaction and
typography, and the masters for illustration and composition.

## Visual language

- **World and materials.** Use textured, painterly medieval interiors and
  grounded characters. The hall pairs cool window light, aged slate stone and
  quiet shadows with warm oak, parchment, and restrained oxblood and brass.
  Use Spanish-suit details (coins, cups, swords and clubs) where they belong
  in the world or clarify a control.
- **Type and hierarchy.** Use Cinzel for titles and Spline Sans for reading,
  labels and controls. The shared `artwork-title` utility defines the Hub
  wordmark and mode titles, with bold uppercase display type, warm parchment
  contrast and a soft shadow. Keep readable live text over artwork. Give the
  main action the clearest contrast. Use shared gold for illustrated frames
  and selection cues, and shadcn border and focus tokens for ordinary controls. Reserve the brand red for primary actions where a separate
  button is useful.
- **Controls and surfaces.** Use compact icon groups, engraved or lightly
  framed surfaces, and clear states. Reuse shared components under
  `src/components/game` and semantic tokens in `src/index.css`. Keep the
  generated primitives under `src/components/ui` as the core.
- **Responsive art and motion.** Compose for the controls in each orientation.
  Let the background extend to the viewport edge and keep controls inside
  safe areas. Use GSAP for DOM motion, Three.js or React Three Fiber for
  3D scenes, and Three Quarks for 3D particle effects. Apply the same rule
  to fades and control feedback. Tailwind and CSS define static styles and
  layouts. Keep static focus cues under reduced motion. Card Hall uses
  depth drift, a moving gold rim, embers and light parallax. See the
  [UI implementation rules](../../AGENTS.md).

The original reference review drew on GWENT for illustrated mode cards,
selection and compact utilities, Armello for a grounded medieval atmosphere,
Runeterra for stable navigation, TFT for action hierarchy, and Faeria for
extensible activity groups. The GWENT mode-hover clip informed the motion.
Use these as interaction and composition references. Fall's own art and tokens
set the visual identity.

## Artwork and prompts

| Asset                                              | Source and provenance                                                                                                                                                                                     |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Card Hall concept and clean hall                   | [Design masters and prompt history](main-menu-research/image-concepts/README.md)                                                                                                                          |
| Phone, tablet and landscape hall paintings         | [Exact ImageGen prompts and banner refinements](main-menu-research/image-concepts/prompts.json), entries `card_hall_background_phone`, `card_hall_background_tablet` and `card_hall_background_landscape` |
| Tavern, Campaign, Arena and the Traveller portrait | [Runtime artwork inventory and crop coordinates](../../src/assets/lobby/card-hall/README.md). The paintings are crops of the Card Hall master.                                                            |
| Hub shortcuts, currencies and rank crest           | [Icon sources, authors, and license](../../src/assets/lobby/card-hall/icons/README.md). The SVGs are used as theme-colored masks.                                                                         |
| Login studies                                      | `login_simple` and `login_detailed` in the [prompt archive](main-menu-research/image-concepts/prompts.json). These are explorations for the login follow-up.                                              |
| Earlier Living Town                                | [Archived design](home-lobby/living-town.md) and [asset generation prompts](../../src/assets/lobby/living-town/README.md).                                                                                |

For new background prompts, name the accepted Fall image and describe which
properties carry across. Specify the camera, lighting, materials, quiet areas
for controls, and landmarks that must remain readable after cropping. Ask for
an artwork-only plate without UI, typography or watermarks. When one crop
cannot keep the landmarks and controls in balance, generate portrait and
landscape compositions of the same scene.

Keep exact prompts, edit prompts, reference filenames, and the resulting asset
paths in the prompt archive. Keep reference masters in `docs/design` and
optimized runtime exports in `src/assets`. For third-party assets, record the
source, creator, license, and any changes alongside the asset so they can be
included in the credits inventory.

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
