import { Link } from "react-router";

import { ActionButton } from "@/components";
import { DeckPicker } from "@/components/cards/DeckPicker";
import { useDeckArtwork } from "@/components/cards/useDeckArtwork";
import { cardDecks } from "@/domain/artwork/decks";
import { updateGamePreferences } from "@/infrastructure/preferences/gamePreferences";
import { HOME_PATH } from "@/routes/Routes";

import { DeckCards } from "./components/DeckCards";

export function CardCollection() {
  const { deck, back } = useDeckArtwork();
  const selected = cardDecks.find(({ id }) => id === deck)!;
  return (
    <main className="h-dvh overflow-y-auto bg-background px-4 pt-[max(1.5rem,var(--safe-area-top))] pb-[max(1.5rem,var(--safe-area-bottom))] text-foreground lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8">
        <header className="grid gap-4">
          <ActionButton
            nativeButton={false}
            role="link"
            render={<Link to={HOME_PATH} />}
            className="justify-self-start"
          >
            Hall
          </ActionButton>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl">Card collection</h1>
            <DeckPicker
              value={deck}
              onValueChange={(cardDeck) => updateGamePreferences({ cardDeck })}
            />
          </div>
          <div className="flex items-center gap-4">
            <img
              src={back}
              alt={`${selected.name} shared card back`}
              className="aspect-[63/88] w-16 drop-shadow-sm"
              draggable={false}
            />
            <div className="grid gap-1">
              <h2 className="text-xl">{selected.name}</h2>
              <p className="text-sm text-muted-foreground">{selected.description}</p>
              <p className="text-sm text-muted-foreground">
                40 faces · one shared back. Your choice applies throughout Fall.
              </p>
            </div>
          </div>
        </header>
        <DeckCards />
      </div>
    </main>
  );
}
