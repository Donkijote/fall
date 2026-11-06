import { ThemeProvider } from "next-themes";

import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeToggle } from "./ThemeToggle";

let systemThemeListener: ((event: { matches: boolean }) => void) | undefined;
let systemIsDark = false;

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.style.removeProperty("color-scheme");
  systemThemeListener = undefined;
  systemIsDark = false;
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation(() => ({
      get matches() {
        return systemIsDark;
      },
      addListener: (listener: typeof systemThemeListener) => {
        systemThemeListener = listener;
      },
      removeListener: vi.fn(),
    })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.style.removeProperty("color-scheme");
});

const renderToggle = () =>
  render(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="fall-theme">
      <ThemeToggle />
    </ThemeProvider>,
  );

test("toggles the document theme and persists the preference", async () => {
  const user = userEvent.setup();
  renderToggle();
  const toggle = screen.getByRole("button", { name: "Dark mode" });
  expect(toggle).toHaveAttribute("aria-pressed", "false");
  await user.click(toggle);
  expect(document.documentElement).toHaveClass("dark");
  expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(localStorage.getItem("fall-theme")).toBe("dark");
  await user.click(toggle);
  expect(document.documentElement).not.toHaveClass("dark");
  expect(localStorage.getItem("fall-theme")).toBe("light");
});

test("restores a saved theme after remounting", async () => {
  localStorage.setItem("fall-theme", "dark");
  const { unmount } = renderToggle();
  expect(document.documentElement).toHaveClass("dark");
  unmount();
  renderToggle();
  expect(screen.getByRole("button", { name: "Dark mode" })).toHaveAttribute("aria-pressed", "true");
  expect(document.documentElement).toHaveClass("dark");
});

test("follows system changes until the user chooses a theme", async () => {
  renderToggle();
  act(() => {
    systemIsDark = true;
    systemThemeListener?.({ matches: true });
  });
  await waitFor(() => expect(document.documentElement).toHaveClass("dark"));
  await userEvent.click(screen.getByRole("button", { name: "Dark mode" }));
  act(() => systemThemeListener?.({ matches: true }));
  expect(document.documentElement).not.toHaveClass("dark");
  expect(localStorage.getItem("fall-theme")).toBe("light");
});
