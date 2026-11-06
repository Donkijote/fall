import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      aria-label="Dark mode"
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-auto flex-col gap-1 px-2 py-2 sm:px-4"
    >
      {isDark ? <Sun /> : <Moon />}
      <span className="hidden text-xs sm:block">Theme</span>
    </Button>
  );
};
