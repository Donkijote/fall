# Sings reference

`index.ts` exports `SingsReferenceScreen`. The one-line infrastructure adapter
`src/infrastructure/ui/screens/SingsSheet.tsx` exposes it at `/sings`.

- `application/singsCatalog.ts` projects the existing domain hands and metadata
  into a sorted reference catalog. It filters by name, pattern, and tags,
  minimum points, and mandatory status, and reports matching tags. It does not
  depend on React, browser APIs, routing, or the in-match UI.
- `adapters/useGuideReturn.ts` reads the guide's explicit return URL and reading
  position key. The guide owns saving and restoring the position. Other
  visitors get the shared Hall return link, which restores focus to Help.
- `adapters/useSingsFilterMotion.ts` measures entries before and after a filter
  change. GSAP animates entries in and out and moves the remaining entries into
  place. The adapter honors the existing reduced-motion preference.
- `ui/SingsReferenceScreen.tsx` owns the local filter state and composes the
  sorting-table scene and open gallery. Its supporting components are grouped under
  `ui/components/{layout,filters,catalog}`. Each combination shows a
  read-only Spanish-deck example, its pattern, points, and declaration status.
  Resetting the filters returns focus to search.

The approved [simplified PNG](../../../docs/design/sings-reference/mockup-simplified.png)
is the implementation reference. The [detailed PNG](../../../docs/design/sings-reference/mockup-detailed.png)
records the more ornamental design. The [default sorting-table master](../../../docs/design/sings-reference/background.png)
is the source reference. The page selects one of five [runtime WebPs](../../assets/sings-reference/README.md)
based on viewport shape and height.

The in-match Sings modal still uses its existing list and adapter. Scoring and
eligibility stay in the domain; related discrepancies are tracked in #109.

`ui/SingsReferenceScreen.test.tsx` checks catalog completeness, search matches,
keyboard filter composition, and the reset flow. The rulebook's integration test
covers chapter and position restoration. Run `pnpm check`,
`pnpm exec vitest run`, and `pnpm build`. For manual verification, reuse port
3000 and check Hall and guide entry/return, both themes, touch and keyboard,
reduced motion, narrow portrait, and notched landscape.

The module entry point also exports `singsGallery` for the development-only
Component gallery. Preview fixtures live under `ui/components/previews` and
render this module’s styled components with sample props.
