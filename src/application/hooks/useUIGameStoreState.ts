import { useUIGameStore } from "@/application/store/uiGameStore";

export const useUIGameStoreState = () => useUIGameStore((s) => s.state);
