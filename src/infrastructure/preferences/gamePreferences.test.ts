import {
  defaultGamePreferences,
  readGamePreferences,
  resetGamePreferences,
  subscribeGamePreferences,
  updateGamePreferences,
} from "./gamePreferences";

beforeEach(() => localStorage.clear());

test("loads old and invalid preferences safely and bounds volume", () => {
  expect(readGamePreferences()).toEqual(defaultGamePreferences);
  expect(readGamePreferences("{invalid")).toEqual(defaultGamePreferences);
  expect(readGamePreferences("null")).toEqual(defaultGamePreferences);
  expect(readGamePreferences('{"volume":5,"muted":"yes","motion":"unknown"}')).toEqual({
    ...defaultGamePreferences,
    volume: 1,
  });
});

test("merges independent changes and persists reset without losing player data", () => {
  localStorage.setItem("FALL_USER", '{"id":"traveller"}');
  updateGamePreferences({ muted: true });
  updateGamePreferences({ volume: 0.75, motion: "reduced" });
  expect(readGamePreferences()).toEqual({ volume: 0.75, muted: true, motion: "reduced" });
  resetGamePreferences();
  expect(readGamePreferences()).toEqual(defaultGamePreferences);
  expect(localStorage.getItem("FALL_USER")).toBe('{"id":"traveller"}');
});

test("notifies live and cross-tab subscribers and releases listeners", () => {
  const listener = vi.fn();
  const unsubscribe = subscribeGamePreferences(listener);
  updateGamePreferences({ volume: 0.2 });
  window.dispatchEvent(new StorageEvent("storage", { key: "fall-preferences" }));
  expect(listener).toHaveBeenCalledTimes(2);
  unsubscribe();
  updateGamePreferences({ muted: true });
  window.dispatchEvent(new StorageEvent("storage", { key: null }));
  expect(listener).toHaveBeenCalledTimes(2);
});
