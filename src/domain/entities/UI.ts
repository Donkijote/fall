import type { Card, CardKey } from "@/domain/entities/Card";

export type UICaptureOverride = {
  fromKey: CardKey;
  toKey: CardKey;
};

export type UIState = {
  playingCard: Card | null;
  captureOverride: UICaptureOverride | null;
  cascadeFollowers: CardKey[];
};

export type UIGameStoreService = {
  setPlayingCard(card: Card | null): void;
  setCaptureOverride(override: UICaptureOverride | null): void;
  addCascadeFollower(key: CardKey): void;
  clearUI(): void;
};

export type UIGameStore = {
  state: UIState;
  service: UIGameStoreService;
};
