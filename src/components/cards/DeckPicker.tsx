import { cardDecks, isCardDeckId, type CardDeckId } from "@/domain/artwork/decks";
import { isCardDeckAvailable } from "@/infrastructure/adapters/cards/cardArtwork";

import { SelectField } from "../controls/SelectField";

export function DeckPicker({
  value,
  onValueChange,
  labelledBy,
}: {
  value: CardDeckId;
  onValueChange: (value: CardDeckId) => void;
  labelledBy?: string;
}) {
  return (
    <SelectField
      value={value}
      options={cardDecks.map(({ id, name }) => ({
        value: id,
        label: name,
        disabled: !isCardDeckAvailable(id),
      }))}
      onValueChange={(next) => {
        if (isCardDeckId(next)) onValueChange(next);
      }}
      triggerProps={{
        "aria-label": labelledBy ? undefined : "Card deck",
        "aria-labelledby": labelledBy,
        className: "min-h-11 min-w-44",
      }}
    />
  );
}
