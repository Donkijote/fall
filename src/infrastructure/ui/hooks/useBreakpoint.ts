import { useEffect, useState } from "react";

import tailwindConfig from "../../../../tailwind.config";

type Breakpoint = keyof typeof tailwindConfig.theme.screens;

export function useBreakpoint() {
  const screens = tailwindConfig.theme?.screens as Record<string, string>;

  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    window.innerWidth > window.innerHeight ? "landscape" : "portrait",
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerHeight < 500);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!screens) return;

    const queries = Object.entries(screens).map(([key, minWidth]) => ({
      key,
      query: window.matchMedia(`(min-width: ${minWidth})`),
    }));

    const update = () => {
      let active: Breakpoint | null = null;
      for (const { key, query } of queries) {
        if (query.matches) active = key as Breakpoint;
      }
      setBreakpoint(active);

      setOrientation(
        window.innerWidth > window.innerHeight ? "landscape" : "portrait",
      );
    };

    update();

    window.addEventListener("resize", update);
    queries.forEach(({ query }) => query.addEventListener("change", update));

    return () => {
      window.removeEventListener("resize", update);
      queries.forEach(({ query }) =>
        query.removeEventListener("change", update),
      );
    };
  }, [screens]);

  return { breakpoint, orientation, isMobile };
}
