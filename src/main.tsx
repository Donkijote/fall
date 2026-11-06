import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

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
      <AppRouter />
    </ThemeProvider>
  </StrictMode>,
);
