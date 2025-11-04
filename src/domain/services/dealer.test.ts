import {
  mockedState,
  mockedStateWithPlayers,
} from "@/application/store/gameStore";
import type { Card } from "@/domain/entities/Card";
import type { GameState } from "@/domain/entities/GameState";

import { dealerCardSelection, setUpDealerSelection } from "./dealer";

const cardKey = (card: Card) => `${card.suit}-${card.rank}`;

let mathRandomSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  mathRandomSpy = vi.spyOn(Math, "random").mockReturnValue(0);
});

afterEach(() => {
  mathRandomSpy.mockRestore();
});

describe("setUpDealerSelection", () => {
  it("initializes a 16-card pool and dealer selection state", () => {
    const initialState: GameState = { ...mockedStateWithPlayers };
    const selectionState = setUpDealerSelection(initialState);

    expect(selectionState.table.length).toBe(16);
    expect(selectionState.dealerSelection).toBeTruthy();
    expect(selectionState.dealerSelection!.poolSize).toBe(16);
    expect(selectionState.dealerSelection!.order.length).toBe(
      selectionState.players.length,
    );
    expect(selectionState.currentPlayer).toBe(
      selectionState.dealerSelection!.order[0],
    );

    for (const playerId of selectionState.dealerSelection!.order) {
      expect(selectionState.dealerSelection!.pickedByKey[playerId]).toBeNull();
    }
    expect(selectionState.dealerSelection!.pickedKeys.size).toBe(0);
  });
});

describe("dealerCardSelection without ties", () => {
  it("records a pick and advances to the next player", () => {
    const selectionState = setUpDealerSelection({ ...mockedStateWithPlayers });
    const currentPlayerId = selectionState.currentPlayer;
    const selectedCardKey = cardKey(selectionState.table[0]);

    const nextState = dealerCardSelection(selectionState, selectedCardKey);

    expect(nextState.dealerSelection!.pickedByKey[currentPlayerId]).toBe(
      selectedCardKey,
    );
    expect(nextState.dealerSelection!.pickedKeys.has(selectedCardKey)).toBe(
      true,
    );

    const turnOrder = nextState.dealerSelection!.order;
    expect(nextState.currentPlayer).toBe(turnOrder[1 % turnOrder.length]);
  });

  it("finalizes with a unique highest rank and moves to dealerChoice", () => {
    const selectionState = setUpDealerSelection({ ...mockedStateWithPlayers });

    const firstPickKey = cardKey(selectionState.table[0]);
    const firstPickRank = selectionState.table[0].rank;

    let higherRankIndex = 1;
    while (
      higherRankIndex < selectionState.table.length &&
      selectionState.table[higherRankIndex].rank <= firstPickRank
    ) {
      higherRankIndex++;
    }
    if (higherRankIndex >= selectionState.table.length) higherRankIndex = 1;

    const secondPickKey = cardKey(selectionState.table[higherRankIndex]);
    const secondPickRank = selectionState.table[higherRankIndex].rank;

    const afterFirstPick = dealerCardSelection(selectionState, firstPickKey);
    const afterSecondPick = dealerCardSelection(afterFirstPick, secondPickKey);

    expect(afterSecondPick.phase).toBe("dealerChoice");

    const expectedDealerId =
      secondPickRank > firstPickRank
        ? selectionState.dealerSelection!.order[1]
        : selectionState.dealerSelection!.order[0];

    expect(afterSecondPick.dealer).toBe(expectedDealerId);

    const playerIds = afterSecondPick.players.map((p) => p.id);
    const dealerIndex = playerIds.indexOf(afterSecondPick.dealer);
    const rightNeighborIndex = (dealerIndex + 1) % playerIds.length;
    expect(afterSecondPick.currentPlayer).toBe(playerIds[rightNeighborIndex]);

    expect(afterSecondPick.deck.length).toBe(40);
    expect(afterSecondPick.table.length).toBe(0);
    expect(afterSecondPick.dealerSelection).toBeUndefined();
  });
});

describe("dealerCardSelection with ties", () => {
  it("limits to tied players, resets their picks, and resolves on redraw", () => {
    const baseState: GameState = {
      ...mockedState,
      players: [
        { id: "player-1", hand: [], collected: [], score: 0, team: 1 },
        { id: "player-2", hand: [], collected: [], score: 0, team: 2 },
        { id: "player-3", hand: [], collected: [], score: 0, team: 3 },
      ],
      mainPlayer: "player-1",
      phase: "chooseDealer",
    };

    const selectionState = setUpDealerSelection(baseState);

    const cardsGroupedByRank = new Map<number, Card[]>();
    for (const card of selectionState.table) {
      const group = cardsGroupedByRank.get(card.rank) ?? [];
      group.push(card);
      cardsGroupedByRank.set(card.rank, group);
    }

    let tieRank: number | undefined;
    for (const [rank, group] of cardsGroupedByRank.entries()) {
      if (group.length >= 2) {
        tieRank = rank;
        break;
      }
    }
    if (tieRank === undefined) tieRank = selectionState.table[0].rank;

    const tieRankCards = selectionState.table
      .filter((c) => c.rank === tieRank!)
      .slice(0, 2);
    const firstTiePickKey = cardKey(tieRankCards[0]);
    const secondTiePickKey = cardKey(tieRankCards[1]);

    const afterFirstPick = dealerCardSelection(selectionState, firstTiePickKey);
    const afterSecondPick = dealerCardSelection(
      afterFirstPick,
      secondTiePickKey,
    );

    const remainingCardsBeforeThirdPick = afterSecondPick.table.filter(
      (card) => !afterSecondPick.dealerSelection!.pickedKeys.has(cardKey(card)),
    );
    const thirdPickCard =
      remainingCardsBeforeThirdPick.find((card) => card.rank < tieRank!) ??
      remainingCardsBeforeThirdPick[0];

    const afterThirdPick = dealerCardSelection(
      afterSecondPick,
      cardKey(thirdPickCard),
    );

    expect(afterThirdPick.phase).toBe("chooseDealer");

    const restrictedPlayers = new Set(
      afterThirdPick.dealerSelection!.tieOnlyPlayers!,
    );
    const turnOrder = afterThirdPick.dealerSelection!.order;
    const firstTurnPlayerId = turnOrder[0];
    const secondTurnPlayerId = turnOrder[1];

    expect(restrictedPlayers).toEqual(
      new Set([firstTurnPlayerId, secondTurnPlayerId]),
    );
    expect(
      afterThirdPick.dealerSelection!.pickedByKey[firstTurnPlayerId],
    ).toBeNull();
    expect(
      afterThirdPick.dealerSelection!.pickedByKey[secondTurnPlayerId],
    ).toBeNull();

    const pickedKeysAfterRestriction =
      afterThirdPick.dealerSelection!.pickedKeys;
    const availableRedrawCards = afterThirdPick.table.filter(
      (card) => !pickedKeysAfterRestriction.has(cardKey(card)),
    );
    const firstRedrawCard = availableRedrawCards[0];
    const secondRedrawCard =
      availableRedrawCards.find((card) => card.rank !== firstRedrawCard.rank) ??
      availableRedrawCards[1];

    const afterFourthPick = dealerCardSelection(
      afterThirdPick,
      cardKey(firstRedrawCard),
    );

    const secondTiedPlayerId =
      afterThirdPick.currentPlayer === firstTurnPlayerId
        ? secondTurnPlayerId
        : firstTurnPlayerId;

    const stateWithSecondTiedTurn = {
      ...afterFourthPick,
      currentPlayer: secondTiedPlayerId,
    };
    const afterFifthPick = dealerCardSelection(
      stateWithSecondTiedTurn,
      cardKey(secondRedrawCard),
    );

    expect(afterFifthPick.phase).toBe("dealerChoice");

    const higherCardChosenByFirst =
      firstRedrawCard.rank > secondRedrawCard.rank;

    const expectedDealerId = higherCardChosenByFirst
      ? (afterThirdPick.currentPlayer as string)
      : secondTiedPlayerId;

    expect(afterFifthPick.dealer).toBe(expectedDealerId);
  });
});

describe("guard conditions", () => {
  it("ignores selecting an already picked card", () => {
    const selectionState = setUpDealerSelection({ ...mockedStateWithPlayers });
    const duplicateKey = cardKey(selectionState.table[0]);

    const afterFirstPick = dealerCardSelection(selectionState, duplicateKey);
    const afterDuplicatePick = dealerCardSelection(
      afterFirstPick,
      duplicateKey,
    );

    expect(afterDuplicatePick).toBe(afterFirstPick);
  });

  it("ignores selecting a non-existent card", () => {
    const selectionState = setUpDealerSelection({ ...mockedStateWithPlayers });
    const invalidKey = "coins-999";

    const afterInvalidPick = dealerCardSelection(selectionState, invalidKey);

    expect(afterInvalidPick).toBe(selectionState);
  });

  it("keeps the turn index when no other eligible unpicked players exist", () => {
    const threePlayerState: GameState = {
      ...mockedState,
      players: [
        { id: "player-1", hand: [], collected: [], score: 0, team: 1 },
        { id: "player-2", hand: [], collected: [], score: 0, team: 2 },
        { id: "player-3", hand: [], collected: [], score: 0, team: 3 },
      ],
      mainPlayer: "player-1",
      phase: "chooseDealer",
    };

    const selectionStart = setUpDealerSelection(threePlayerState);
    const order = selectionStart.dealerSelection!.order;
    const currentPlayerId = order[0];
    const playerAtTurnIndexId = order[1];
    const alreadyPickedPlayerId = order[2];

    const alreadyPickedCardKey = `${selectionStart.table[1].suit}-${selectionStart.table[1].rank}`;
    const unsyncedState: GameState = {
      ...selectionStart,
      dealerSelection: {
        ...selectionStart.dealerSelection!,
        turnIndex: 1,
        pickedByKey: {
          ...selectionStart.dealerSelection!.pickedByKey,
          [alreadyPickedPlayerId]: alreadyPickedCardKey,
        },
        pickedKeys: new Set<string>([alreadyPickedCardKey]),
        tieOnlyPlayers: null,
      },
      currentPlayer: currentPlayerId,
    };

    const currentPlayerPickKey = `${selectionStart.table[0].suit}-${selectionStart.table[0].rank}`;
    const afterPick = dealerCardSelection(unsyncedState, currentPlayerPickKey);

    expect(afterPick.dealerSelection!.turnIndex).toBe(1);
    expect(afterPick.currentPlayer).toBe(playerAtTurnIndexId);
  });
});
