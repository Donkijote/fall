import { createContext, useContext } from "react";
export type MotionSettings = { speed: number; ease: string };
export const MotionContext = createContext<MotionSettings>({ speed: 1, ease: "original" });
export const useMotionSettings = () => useContext(MotionContext);
