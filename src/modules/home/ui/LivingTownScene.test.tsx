import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { LivingTownScene } from "./LivingTownScene";
import { townArtwork } from "./scene/townArtwork";

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
      if (renderer.crash) throw new Error("Mist renderer unavailable");
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

test("keeps ordered decorative artwork independently of the lazily enhanced mist", async () => {
  const { container } = render(<LivingTownScene />);
  expect(container.querySelector('[data-slot="living-town-scene"]')).not.toHaveAttribute(
    "aria-hidden",
  );
  expect(container.querySelector(".living-town-frame")).toHaveAttribute("aria-hidden", "true");
  const mountains = container.querySelector('[data-slot="living-town-mountains"]');
  expect(mountains?.querySelectorAll("img")).toHaveLength(2);
  const images = [...container.querySelectorAll("img")];
  expect(
    [...container.querySelectorAll<HTMLElement>("[data-artwork]")].map(
      (layer) => layer.dataset.artwork,
    ),
  ).toEqual(townArtwork.map((artwork) => artwork.id));
  const imageArtwork = townArtwork.filter((artwork) => artwork.id !== "plaza");
  images.forEach((image, index) => {
    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveAttribute("draggable", "false");
    expect(image).toHaveAttribute("width", String(imageArtwork[index].width));
    expect(image).toHaveAttribute("height", String(imageArtwork[index].height));
    expect(image).toHaveAttribute("src", imageArtwork[index].source);
    fireEvent.load(image);
    expect(image).toHaveAttribute("data-status", "ready");
  });
  await screen.findByTestId("mountain-renderer");
  await waitFor(() =>
    expect(container.querySelector(".living-town-webgl")).toHaveAttribute("data-ready", "true"),
  );
  expect(mountains).toBeInTheDocument();
  expect(container.querySelector('[data-slot="living-town-tavern"]')).toBeInTheDocument();
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
    expect(container.querySelectorAll("img")).toHaveLength(7);
    expect(container.querySelector('[data-slot="living-town-tavern"]')).toBeInTheDocument();
    expect(container.querySelector(".living-town-embers")).not.toBeInTheDocument();
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
  expect(container.querySelectorAll("img")).toHaveLength(7);
  expect(container.querySelector('[data-slot="living-town-tavern"]')).toBeInTheDocument();
  act(() => compact.set(true));
  expect(screen.queryByTestId("mountain-renderer")).not.toBeInTheDocument();
});

test("contains renderer initialization errors without removing the artwork", async () => {
  renderer.crash = true;
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  const { container } = render(<LivingTownScene />);
  await waitFor(() =>
    expect(container.querySelector(".living-town-webgl")).not.toBeInTheDocument(),
  );
  expect(container.querySelectorAll("img")).toHaveLength(7);
  expect(error).toHaveBeenCalled();
});

test("isolates image failures and keeps a CSS backdrop when all artwork fails", () => {
  motion.matches = true;
  const { container } = render(<LivingTownScene />);
  const images = [...container.querySelectorAll("img")];
  images.forEach((image) => fireEvent.load(image));
  fireEvent.error(images[3]);
  expect(images[3]).toHaveAttribute("data-status", "failed");
  expect(images[0]).toHaveAttribute("data-status", "ready");
  for (const image of images) {
    fireEvent.error(image);
    expect(image).toHaveAttribute("data-status", "failed");
  }
  expect(container.querySelector(".living-town-ground")).toBeInTheDocument();
  expect(container.querySelector('[data-slot="living-town-scene"]')).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Play at the tavern" })).toBeDisabled();
  expect(container.querySelector("a, [tabindex]")).toBeNull();
});

test("places the inward-facing tavern and single plaza outside the cover-cropped backdrop", () => {
  motion.matches = true;
  const { container } = render(<LivingTownScene />);
  const world = container.querySelector('[data-slot="living-town-world"]');
  const tavern = container.querySelector('[data-slot="living-town-tavern"]');
  const plaza = container.querySelector('[data-slot="living-town-plaza"]');
  expect(world).toContainElement(tavern as HTMLElement);
  expect(tavern?.closest("[data-facing]")).toHaveAttribute("data-facing", "inward");
  expect(container.querySelector(".living-town-frame")).not.toContainElement(world as HTMLElement);
  expect(container.querySelector(".living-town-frame")).not.toContainElement(plaza as HTMLElement);
  expect((plaza as HTMLElement).style.backgroundImage).toContain(townArtwork[3].source);
  expect(townArtwork[3]).toMatchObject({ width: 1672, height: 941 });
});

test("keeps the tavern action available when images fail without adding a second Play entry", () => {
  motion.matches = true;
  const onPlay = vi.fn();
  const { container } = render(<LivingTownScene canPlay onPlay={onPlay} />);
  for (const image of container.querySelectorAll("img")) fireEvent.error(image);
  const tavern = screen.getByRole("button", { name: "Play at the tavern" });
  expect(tavern).toBeEnabled();
  expect(tavern).toHaveTextContent("The Tavern");
  expect(screen.getAllByRole("button")).toHaveLength(4);
  fireEvent.click(tavern);
  expect(onPlay).toHaveBeenCalledOnce();
});

test("always shows the tavern nameplate without a hover tooltip", () => {
  motion.matches = true;
  const { container } = render(<LivingTownScene canPlay onPlay={vi.fn()} />);
  fireEvent.load(container.querySelector('[data-slot="living-town-tavern"]')!);
  expect(container.querySelector(".living-town-tavern-nameplate")).toHaveTextContent("The Tavern");
  expect(
    container.querySelector('[role="tooltip"], [title], .living-town-tavern-label'),
  ).toBeNull();
  expect(screen.getByRole("button", { name: "Play at the tavern" })).toBeEnabled();
});

test("places named planned landmarks without exposing unfinished actions", () => {
  motion.matches = true;
  const onPlay = vi.fn();
  const { container } = render(<LivingTownScene canPlay onPlay={onPlay} />);
  for (const label of ["Arena", "Merchant", "Quests"]) {
    const landmark = screen.getByRole("button", { name: `${label} (coming soon)` });
    expect(landmark).toBeDisabled();
    expect(landmark.querySelector(".living-town-nameplate")).toHaveTextContent(label);
    fireEvent.click(landmark);
    fireEvent.error(landmark.querySelector("img")!);
    expect(landmark).toHaveTextContent(label);
  }
  expect(container.querySelectorAll(".living-town-landmark")).toHaveLength(3);
  expect(onPlay).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Play at the tavern" }));
  expect(onPlay).toHaveBeenCalledOnce();
});

test("keeps revised artwork dimensions and arena depth without detached ground shadows", () => {
  motion.matches = true;
  const { container } = render(<LivingTownScene />);
  const world = container.querySelector('[data-slot="living-town-world"]');
  expect(world?.firstElementChild).toHaveClass("living-town-arena-anchor");
  expect(world?.firstElementChild?.nextElementSibling).toHaveClass("living-town-tavern-anchor");
  expect(container.querySelector(".living-town-contact")).toBeNull();
  expect(townArtwork.find(({ id }) => id === "quest-board")).toMatchObject({
    width: 1246,
    height: 1262,
  });
  expect(townArtwork.find(({ id }) => id === "arena")).toMatchObject({ width: 1525, height: 1031 });
});

test("limits embers on compact devices, pauses hidden tabs and removes them for reduced motion", async () => {
  const { container } = render(<LivingTownScene canPlay onPlay={vi.fn()} />);
  await screen.findByTestId("mountain-renderer");
  expect(container.querySelectorAll(".living-town-ember")).toHaveLength(6);
  act(() => compact.set(true));
  expect(container.querySelectorAll(".living-town-ember")).toHaveLength(4);
  vi.spyOn(document, "hidden", "get").mockReturnValue(true);
  fireEvent(document, new Event("visibilitychange"));
  expect(container.querySelector(".living-town-embers")).toHaveAttribute("data-visible", "false");
  act(() => motion.set(true));
  expect(container.querySelector(".living-town-embers")).not.toBeInTheDocument();
  expect(container.querySelector(".living-town-tavern-nameplate")).toHaveTextContent("The Tavern");
});
