import { useGameStore } from "../store/gameStore";

export const useGameStoreService = () => {
  return useGameStore((s) => s.service);
};
