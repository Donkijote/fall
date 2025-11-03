import type { Card } from "@/domain/entities/Card";
import type {
  DealerSelection,
  GameState,
  Player,
} from "@/domain/entities/GameState";
import { createDeck, shuffle } from "@/domain/rules/deck";

export const setUpDealerSelection = (state: GameState): GameState => {
  const poolSize = 16;
  const deck = shuffle(createDeck());
  const table = deck.slice(0, poolSize);

  const randIdx = Math.floor(Math.random() * state.players.length);
  const startId = state.players[randIdx].id;
  const order = seatingOrderFrom(startId, state.players);

  const pickedByKey: Record<string, string | null> = {};
  for (const pid of order) pickedByKey[pid] = null;

  return {
    ...state,
    currentPlayer: order[0],
    table,
    dealerSelection: {
      order,
      turnIndex: 0,
      pickedByKey,
      pickedKeys: new Set<string>(),
      tieOnlyPlayers: null,
      poolSize,
    },
  };
};

export const dealerCardSelection = (
  state: GameState,
  cardKey: string,
): GameState => {
  const sel = state.dealerSelection!;
  const pid = state.currentPlayer;

  const isEligible = !sel.tieOnlyPlayers || sel.tieOnlyPlayers.includes(pid);
  if (!isEligible) return state;
  if (sel.pickedByKey[pid]) return state;

  const existsInTable = state.table.some(
    (c) => `${c.suit}-${c.rank}` === cardKey,
  );
  if (!existsInTable) return state;
  if (sel.pickedKeys.has(cardKey)) return state;

  const newPickedBy = { ...sel.pickedByKey, [pid]: cardKey };
  const newPickedKeys = new Set(sel.pickedKeys);
  newPickedKeys.add(cardKey);

  let next: GameState = {
    ...state,
    dealerSelection: {
      ...sel,
      pickedByKey: newPickedBy,
      pickedKeys: newPickedKeys,
    },
  };

  if (isSubroundComplete(next)) {
    const { winnerId, ties } = chooseDealer(newPickedBy);

    if (winnerId) {
      next = finalizeDealerSelection(next, winnerId);
      return next;
    }

    const tieSet = new Set<string>(ties);
    const resetPickedBy = { ...newPickedBy };
    for (const id of Object.keys(resetPickedBy)) {
      if (tieSet.has(id)) resetPickedBy[id] = null;
    }

    const order = sel.order;
    const firstTie = order.find((id) => tieSet.has(id))!;
    const nextOrder = seatingOrderFrom(firstTie, state.players);

    next = {
      ...next,
      dealerSelection: {
        ...sel,
        pickedByKey: resetPickedBy,
        tieOnlyPlayers: [...tieSet],
      },
      currentPlayer: nextOrder[0],
    };

    return next;
  }

  const idx = sel.turnIndex;
  const order = sel.order;
  const tmpState: GameState = {
    ...next,
    dealerSelection: { ...next.dealerSelection!, turnIndex: idx },
  };
  let nextIdx = nextEligibleIndex(tmpState);
  if (nextIdx === -1) {
    nextIdx = idx;
  }

  next = {
    ...next,
    dealerSelection: {
      ...next.dealerSelection!,
      turnIndex: nextIdx,
    },
    currentPlayer: order[nextIdx],
  };
  return next;
};

const chooseDealer = (
  pickedByKey: DealerSelection["pickedByKey"],
): { winnerId?: string; ties: string[] } => {
  const entries = Object.entries(pickedByKey).filter(
    ([, key]) => key && key.length > 0,
  ) as Array<[string, string]>;

  if (entries.length === 0) return { winnerId: undefined, ties: [] };

  const max = maxRank(entries.map(([, key]) => key));
  const top = entries.filter(([, key]) => parseCardKey(key).rank === max);

  if (top.length === 1) {
    return { winnerId: top[0][0], ties: [] };
  }
  return { winnerId: undefined, ties: top.map(([playerId]) => playerId) };
};

const finalizeDealerSelection = (
  state: GameState,
  winnerId: string,
): GameState => {
  const players = state.players;

  const dealerIdx = players.findIndex((p) => p.id === winnerId);
  const rightIdx = (dealerIdx + 1) % players.length;
  const rightId = players[rightIdx].id;

  const freshDeck = shuffle(createDeck());

  return {
    ...state,
    dealer: winnerId,
    currentPlayer: rightId,
    deck: freshDeck,
    table: [],
    dealerSelection: undefined,
    phase: "dealerChoice",
  };
};

const isSubroundComplete = (state: GameState): boolean => {
  const sel = state.dealerSelection!;
  const eligible = sel.tieOnlyPlayers ?? sel.order;
  return eligible.every((pid) => !!sel.pickedByKey[pid]);
};

const nextEligibleIndex = (state: GameState): number => {
  const sel = state.dealerSelection!;
  const order = sel.order;
  const tieOnly = sel.tieOnlyPlayers;
  let i = sel.turnIndex + 1;

  while (true) {
    if (i >= order.length) i = 0;
    if (i === sel.turnIndex) break;

    const pid = order[i];
    const isEligible = !tieOnly || tieOnly.includes(pid);
    const hasPicked = !!sel.pickedByKey[pid];
    if (isEligible && !hasPicked) return i;
    i++;
  }
  return -1;
};

const seatingOrderFrom = (startId: string, players: Player[]): string[] => {
  const idx = players.findIndex((p) => p.id === startId);
  const arr = [...players.slice(idx), ...players.slice(0, idx)];
  return arr.map((p) => p.id);
};

const parseCardKey = (key: string): Card => {
  const [suit, rankStr] = key.split("-");
  return { suit, rank: Number(rankStr) } as Card;
};

const maxRank = (keys: string[]): number => {
  return keys.reduce((mx, k) => {
    const { rank } = parseCardKey(k);
    return Math.max(rank, mx);
  }, -Infinity);
};