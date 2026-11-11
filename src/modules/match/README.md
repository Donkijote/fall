# Match preview

`index.ts` exports `MatchScreen`, the screen registered at `/game/:matchId`.
The local preview uses `tavern-7f3a` and carries the selected format in the
`mode` query. Opening the URL directly or refreshing starts a fresh mock
waiting session. Cancel, Close table, and Escape return to the Tavern picker
and focus the selected format.

The application model maps the shared `GameMode` to seat positions and
provides mock guests. The UI owns the arrival timers and reads the local
profile through the existing storage service. The Three Quarks adapter
renders hearth ash. The [shared domain](../../domain) remains the source of
game rules.

The route is ready to receive server-assigned IDs when match state and player
membership move to the server. See the
[table design notes](../../../docs/design/tavern-match/README.md).
Home and legacy navigation tests exercise the route through both entry points.
