import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { WindowDragRegion } from "@/components";
import { initializeNativeSafeArea } from "@/infrastructure/adapters/platform/nativeSafeArea";
import { hasMacOsWindowChrome } from "@/infrastructure/adapters/platform/nativeWindowChrome";
import { AppRouter } from "@/routes/Router";

import "./index.css";

void initializeNativeSafeArea().catch((error: unknown) => {
  console.error("Could not initialize native safe areas", error);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="fall-theme"
      enableColorScheme
    >
      <WindowDragRegion enabled={hasMacOsWindowChrome()} />
      <AppRouter />
    </ThemeProvider>
  </StrictMode>,
);
