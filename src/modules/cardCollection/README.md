# Card collection

`CardCollection` is the public screen for `/dev/cards`. It is registered only in development under the shared `/dev` parent, alongside the component gallery and animation playground. Its supporting `DeckCards`
renders the authoritative domain deck grouped by suit. The screen composes the
shared `DeckPicker`, existing persisted preferences, and shared artwork adapter;
it owns no game rules. The visual-pack catalog is framework-independent under
`src/domain/artwork/decks.ts`. Asset URLs and browser persistence remain adapters.
There is no empty application layer or repository abstraction.

Selection applies to gameplay, guide examples, collection and 3D textures.
Artwork identities and generation/export instructions live in
`docs/design/card-deck`. The adapter tests verify all 120 faces and three backs;
the screen test verifies selection and all 40 accessible faces.

`src/routes/Router.test.tsx` verifies the development route and production exclusion. The HomeLobby integration tests verify the grouped Settings links and that production Settings retains deck selection without developer links.
