import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { WindowDragRegion } from "@/components";
import { hasMacOsWindowChrome } from "@/infrastructure/adapters/platform/nativeWindowChrome";
import { AppRouter } from "@/routes/Router";

import "./index.css";

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
