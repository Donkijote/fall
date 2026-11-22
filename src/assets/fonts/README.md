# Bundled typography

Cinzel and Spline Sans are the same families already used by Fall. Their official,
unmodified variable TTF files are now bundled so packaged and web clients can use
the intended typography without reaching Google Fonts. CSS declares Cinzel
400–900 and Spline Sans 300–700, matching the previous stylesheet request.

`sources.json` records exact official google/fonts commits, download URLs, binary
SHA-256 hashes and sizes, retrieved 2026-11-21. Both are SIL Open Font License 1.1.
Their upstream OFL.txt files were compared byte-for-text with the existing notices;
the text is unchanged. The game includes those complete notices through the font
records in `src/modules/credits/domain/inventory.ts`:

- Cinzel: Natanael Gama / The Cinzel Project Authors;
  `src/modules/credits/domain/notices/cinzel.txt`.
- Spline Sans: Eben Sorkin, Mirko Velimirović / The Spline Sans Project Authors;
  `src/modules/credits/domain/notices/spline-sans.txt`.

Do not remove these font-specific notices or apply the game's proprietary license
to the font binaries. No font source was edited, redrawn, or generated for Fall.
