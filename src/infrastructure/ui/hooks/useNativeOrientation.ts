import { useEffect } from "react";
import type { DataRouter } from "react-router";

import {
  hasNativeOrientation,
  setNativeOrientation,
} from "@/infrastructure/adapters/platform/nativeOrientation";
import { LOGIN_PATH } from "@/routes/Routes";

/** Keep native orientation in sync with committed routes and foregrounding. */
export function useNativeOrientation(router: DataRouter) {
  useEffect(() => {
    if (!hasNativeOrientation()) return;

    let active = true;
    let revision = 0;
    let pathname = router.state.location.pathname;
    let pending = Promise.resolve();

    const sync = () => {
      const requested = ++revision;
      const allowPortrait = pathname.replace(/\/+$/, "") === LOGIN_PATH;
      // Serialize IPC and skip superseded requests during rapid navigation.
      pending = pending
        .then(() => {
          if (active && requested === revision) {
            return setNativeOrientation(allowPortrait);
          }
        })
        .catch((error: unknown) => {
          if (active) console.error("Native orientation update failed", error);
        });
    };
    const unsubscribe = router.subscribe((state) => {
      if (state.location.pathname !== pathname) {
        pathname = state.location.pathname;
        sync();
      }
    });
    const resume = () => {
      if (document.visibilityState === "visible") sync();
    };
    document.addEventListener("visibilitychange", resume);
    sync();

    return () => {
      active = false;
      revision++;
      unsubscribe();
      document.removeEventListener("visibilitychange", resume);
    };
  }, [router]);
}
