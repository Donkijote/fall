import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { LivingTownScene } from "./LivingTownScene";

const renderer = vi.hoisted(() => ({ crash: false }));

vi.mock("./scene/LivingTownCanvas", async () => {
  const { useEffect } = await import("react");
  return {
    default: ({
      compact,
      visible,
      onReady,
      onFailure,
    }: {
      compact: boolean;
      visible: boolean;
      onReady: () => void;
      onFailure: () => void;
    }) => {
      useEffect(onReady, [onReady]);
      if (renderer.crash) throw new Error("Mountain renderer unavailable");
      return (
        <button
          data-testid="mountain-renderer"
          data-compact={compact}
          data-visible={visible}
          onClick={onFailure}
        >
          Simulate renderer failure
        </button>
      );
    },
  };
});

class Preference extends EventTarget {
  matches = false;
  set(matches: boolean) {
    this.matches = matches;
    this.dispatchEvent(new Event("change"));
  }
}

let motion: Preference;
let compact: Preference;
let connection: EventTarget & { saveData: boolean };
const originalConnection = Object.getOwnPropertyDescriptor(navigator, "connection");

beforeEach(() => {
  renderer.crash = false;
  motion = new Preference();
  compact = new Preference();
  connection = Object.assign(new EventTarget(), { saveData: false });
  Object.defineProperty(navigator, "connection", { configurable: true, value: connection });
  vi.stubGlobal("WebGL2RenderingContext", class {});
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => (query.includes("reduced-motion") ? motion : compact)),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (originalConnection) Object.defineProperty(navigator, "connection", originalConnection);
  else Reflect.deleteProperty(navigator, "connection");
});

test("keeps decorative SVG mountains behind the lazily enhanced scene", async () => {
  const { container } = render(<LivingTownScene />);
  expect(container.querySelector('[data-slot="living-town-scene"]')).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  const mountains = container.querySelector('[data-slot="living-town-mountains"]');
  expect(mountains).toHaveAttribute("viewBox", "0 0 1600 900");
  expect(mountains).toHaveAttribute("preserveAspectRatio", "xMidYMid slice");
  expect(mountains?.querySelectorAll("[data-mountain-layer]")).toHaveLength(3);
  await screen.findByTestId("mountain-renderer");
  await waitFor(() =>
    expect(container.querySelector(".living-town-webgl")).toHaveAttribute("data-ready", "true"),
  );
  expect(mountains).toBeInTheDocument();
  expect(container.querySelector('[data-slot="living-town-tavern"]')).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
});

test.each(["reduced motion", "data saving", "missing WebGL"])(
  "retains the whole static composition for %s",
  (preference) => {
    if (preference === "reduced motion") motion.matches = true;
    if (preference === "data saving") connection.saveData = true;
    if (preference === "missing WebGL") vi.stubGlobal("WebGL2RenderingContext", undefined);
    const { container } = render(<LivingTownScene />);
    expect(screen.queryByTestId("mountain-renderer")).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="living-town-sky"]')).toBeInTheDocument();
    expect(container.querySelectorAll("[data-mountain-layer]")).toHaveLength(3);
    expect(container.querySelector('[data-slot="living-town-tavern"]')).toBeInTheDocument();
  },
);

test("adapts quality and tab visibility and unmounts the renderer when motion is reduced", async () => {
  render(<LivingTownScene />);
  const scene = await screen.findByTestId("mountain-renderer");
  expect(scene).toHaveAttribute("data-compact", "false");
  act(() => compact.set(true));
  expect(scene).toHaveAttribute("data-compact", "true");
  vi.spyOn(document, "hidden", "get").mockReturnValue(true);
  fireEvent(document, new Event("visibilitychange"));
  expect(scene).toHaveAttribute("data-visible", "false");
  act(() => motion.set(true));
  expect(screen.queryByTestId("mountain-renderer")).not.toBeInTheDocument();
  act(() => motion.set(false));
  await screen.findByTestId("mountain-renderer");
  act(() => {
    connection.saveData = true;
    connection.dispatchEvent(new Event("change"));
  });
  expect(screen.queryByTestId("mountain-renderer")).not.toBeInTheDocument();
});

test("retains the fallback permanently after a renderer or context failure", async () => {
  const { container } = render(<LivingTownScene />);
  fireEvent.click(await screen.findByTestId("mountain-renderer"));
  expect(container.querySelector(".living-town-webgl")).not.toBeInTheDocument();
  expect(container.querySelectorAll("[data-mountain-layer]")).toHaveLength(3);
  expect(container.querySelector('[data-slot="living-town-tavern"]')).toBeInTheDocument();
  act(() => compact.set(true));
  expect(screen.queryByTestId("mountain-renderer")).not.toBeInTheDocument();
});

test("contains renderer initialization errors without removing the mountains", async () => {
  renderer.crash = true;
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  const { container } = render(<LivingTownScene />);
  await waitFor(() =>
    expect(container.querySelector(".living-town-webgl")).not.toBeInTheDocument(),
  );
  expect(container.querySelectorAll("[data-mountain-layer]")).toHaveLength(3);
  expect(error).toHaveBeenCalled();
});

test("uses independent gradient IDs when two static backdrops are mounted", () => {
  motion.matches = true;
  const { container } = render(
    <>
      <LivingTownScene />
      <LivingTownScene />
    </>,
  );
  const ids = [...container.querySelectorAll("svg [id]")].map((definition) => definition.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(container.querySelectorAll('[data-slot="living-town-tavern"]')).toHaveLength(2);
  for (const polygon of container.querySelectorAll('polygon[fill^="url"]')) {
    const id = polygon.getAttribute("fill")!.slice(5, -1);
    expect(document.getElementById(id)).toBeInTheDocument();
  }
});
