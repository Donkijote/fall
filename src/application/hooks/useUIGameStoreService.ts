import { useUIGameStore } from "@/application/store/uiGameStore";

export const useUIGameStoreService = () => useUIGameStore((s) => s.service);
