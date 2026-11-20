import { invoke, isTauri } from "@tauri-apps/api/core";

/** UIKit publishes live insets on iOS; other hosts keep CSS env() defaults. */
export async function initializeNativeSafeArea(): Promise<void> {
  if (isTauri()) await invoke("observe_safe_area");
}
