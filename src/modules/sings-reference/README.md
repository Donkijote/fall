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
- `ui/SingsReferenceScreen.tsx` owns the local filter state and composes the
  archive scene and framed folio. Its supporting components are grouped under
  `ui/components/{layout,filters,catalog}`. Each combination shows a
  read-only Spanish-deck example, its pattern, points, and declaration status.
  Resetting the filters returns focus to search. The static UI adds no motion.

The in-match Sings modal still uses its existing list and adapter. Scoring and
eligibility stay in the domain; related discrepancies are tracked in #109.

`ui/SingsReferenceScreen.test.tsx` checks catalog completeness, search matches,
keyboard filter composition, and the reset flow. The rulebook's integration test
covers chapter and position restoration. Run `pnpm check`,
`pnpm exec vitest run`, and `pnpm build`. For manual verification, reuse port
3000 and check Hall and guide entry/return, both themes, touch and keyboard,
reduced motion, narrow portrait, and notched landscape.
