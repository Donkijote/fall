import { useGameStore } from "../store/gameStore";

export const useGameStoreState = () => {
  return useGameStore((s) => s.state);
};
