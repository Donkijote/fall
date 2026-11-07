import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { LoginAtmosphere } from "./LoginAtmosphere";

const sceneState = vi.hoisted(() => ({ crash: false }));

vi.mock("./scene/AtmosphereCanvas", async () => {
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
      useEffect(() => onReady(), [onReady]);
      if (sceneState.crash) throw new Error("Renderer unavailable");
      return (
        <button
          data-testid="scene"
          data-compact={compact}
          data-visible={visible}
          onClick={onFailure}
        >
          Simulate context loss
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
  sceneState.crash = false;
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

it("progressively enhances the hidden static backdrop once the renderer is ready", async () => {
  const { container } = render(<LoginAtmosphere />);
  expect(container.querySelector(".login-landscape")).toHaveAttribute("alt", "");
  await screen.findByTestId("scene");
  await waitFor(() =>
    expect(container.querySelector(".login-webgl")).toHaveAttribute("data-ready", "true"),
  );
  expect(container.querySelector(".login-atmosphere")).toHaveAttribute("aria-hidden", "true");
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
});

it("does not mount the renderer for reduced motion, data saving, or missing WebGL", () => {
  motion.matches = true;
  const reduced = render(<LoginAtmosphere />);
  expect(screen.queryByTestId("scene")).not.toBeInTheDocument();
  reduced.unmount();

  motion.matches = false;
  connection.saveData = true;
  const saving = render(<LoginAtmosphere />);
  expect(screen.queryByTestId("scene")).not.toBeInTheDocument();
  saving.unmount();

  connection.saveData = false;
  vi.stubGlobal("WebGL2RenderingContext", undefined);
  render(<LoginAtmosphere />);
  expect(screen.queryByTestId("scene")).not.toBeInTheDocument();
});

it("reacts to motion and data-saving preference changes without losing the backdrop", async () => {
  const { container } = render(<LoginAtmosphere />);
  await screen.findByTestId("scene");
  act(() => motion.set(true));
  expect(screen.queryByTestId("scene")).not.toBeInTheDocument();
  expect(container.querySelector(".login-landscape")).toBeInTheDocument();
  act(() => motion.set(false));
  await screen.findByTestId("scene");
  act(() => {
    connection.saveData = true;
    connection.dispatchEvent(new Event("change"));
  });
  expect(screen.queryByTestId("scene")).not.toBeInTheDocument();
});

it("lowers quality on compact devices and pauses the render loop when the tab is hidden", async () => {
  render(<LoginAtmosphere />);
  const scene = await screen.findByTestId("scene");
  expect(scene).toHaveAttribute("data-compact", "false");
  act(() => compact.set(true));
  expect(scene).toHaveAttribute("data-compact", "true");
  vi.spyOn(document, "hidden", "get").mockReturnValue(true);
  fireEvent(document, new Event("visibilitychange"));
  expect(scene).toHaveAttribute("data-visible", "false");
});

it("falls back permanently after context loss without removing the static landscape", async () => {
  const { container } = render(<LoginAtmosphere />);
  fireEvent.click(await screen.findByTestId("scene"));
  expect(screen.queryByTestId("scene")).not.toBeInTheDocument();
  expect(container.querySelector(".login-landscape")).toBeInTheDocument();
  act(() => compact.set(true));
  expect(screen.queryByTestId("scene")).not.toBeInTheDocument();
});

it("contains renderer initialization errors and retains the static fallback", async () => {
  sceneState.crash = true;
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  const { container } = render(<LoginAtmosphere />);
  await waitFor(() => expect(container.querySelector(".login-webgl")).not.toBeInTheDocument());
  expect(container.querySelector(".login-landscape")).toBeInTheDocument();
  expect(error).toHaveBeenCalled();
});

it("removes preference subscriptions on unmount", async () => {
  const removeMotion = vi.spyOn(motion, "removeEventListener");
  const removeCompact = vi.spyOn(compact, "removeEventListener");
  const removeConnection = vi.spyOn(connection, "removeEventListener");
  const { unmount } = render(<LoginAtmosphere />);
  await screen.findByTestId("scene");
  unmount();
  expect(removeMotion).toHaveBeenCalledWith("change", expect.any(Function));
  expect(removeCompact).toHaveBeenCalledWith("change", expect.any(Function));
  expect(removeConnection).toHaveBeenCalledWith("change", expect.any(Function));
});
