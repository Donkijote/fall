# Login

The [simplified mockup](mockup-simplified.png) and [detailed mockup](mockup-detailed.png)
show how the Card Hall materials carry into the login card. The live layout uses
restrained brass trim, recessed fields and the shared primary action. On narrow
screens the introduction stacks with the card. The mockup copy is illustrative;
the current screen is a preview, and **Take your seat** opens the Hall.

The backdrop is the supplied [mountain and castle original](../../../src/assets/login/mountain-castle.png),
which the app uses directly. It is separate from the scenes painted into the
mockups. The [prompt manifest](prompts.json) preserves the two mockup prompts.
The [login implementation notes](../../../src/modules/login/README.md) document the source
image, foreground mask, fog and ember effects.

The shared TextInput follows the detailed mockup's cut corners, fine brass
edge, and recessed charcoal face. Login passes its mail and lock icons into
the same field that Rulebook and Sings use for search. Editable text uses the
body font, and focus brightens the brass frame with a slow traveling highlight.
