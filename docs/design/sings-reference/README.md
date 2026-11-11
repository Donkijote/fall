# Sings reference design

[Issue #111](https://github.com/Donkijote/fall/issues/111) covers the standalone
reference opened from Hall → Help or the Sings chapter in How to Play.

| Study                                                        | Layout                                                                                          | Tradeoff                                                                                                 |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [Detailed catalog](detailed.jpg) ([HTML](detailed.html))     | A framed tile per combination with an illustration, score, pattern, and visible tags.           | More hands fit above the fold on a wide screen, but patterns wrap and point badges move around the grid. |
| [Simplified folio](simplified.jpg) ([HTML](simplified.html)) | A single brass frame, with one row per combination and aligned cards, descriptions, and points. | Fewer hands fit above the fold, but each row is easier to compare and the archive stays visible.         |

The draft implements the simplified folio. It uses How to Play's archive
paintings, heading type, and shared frame. The Spanish-deck cards sit beside
the description on wider screens and below it on narrow screens. Tags appear
when they explain a search result. Both studies use existing game art; their
HTML and styles are design references only.

[Desktop implementation, dark](implementation-desktop.jpg) ·
[320px portrait implementation, light](implementation-portrait.jpg)

Browser review on the existing port 3000 covered 1600×900, 768×1024, 320×568,
844×390, and 568×320. Both landscape mobile sizes simulated 48px left, 36px
right, and 16px bottom safe areas. The archive filled each viewport and the
content stayed inside the gutters without horizontal overflow. Review also
covered touch and keyboard filters, reset focus, reduced motion, Hall Help
entry and focus restoration, and guide chapter and reading position restoration.
