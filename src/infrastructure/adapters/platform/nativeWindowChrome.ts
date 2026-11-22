import { isTauri } from "@tauri-apps/api/core";

declare global {
  interface Window {
    /** Injected by the macOS native host before the document loads. */
    readonly __FALL_MACOS_TITLEBAR__?: boolean;
  }
}

export function hasMacOsWindowChrome(): boolean {
  return isTauri() && window.__FALL_MACOS_TITLEBAR__ === true;
}
