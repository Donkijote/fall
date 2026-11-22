import { invoke, isTauri } from "@tauri-apps/api/core";

/** Browser builds have no native orientation side effects. */
export const hasNativeOrientation = () => isTauri();

export async function setNativeOrientation(allowPortrait: boolean): Promise<void> {
  await invoke("set_orientation", { allowPortrait });
}
