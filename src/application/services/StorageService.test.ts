import { StorageKeys, StorageService } from "./StorageService";

describe("StorageService", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("set() stringifies and stores, get<T>() returns parsed value", () => {
    const user = { id: 1, name: "Ana" };
    StorageService.set(StorageKeys.FALL_USER, user);

    const value = StorageService.get<typeof user>(StorageKeys.FALL_USER);
    expect(value).toEqual(user);
  });

  it("get<T>() returns null when the key does not exist", () => {
    const value = StorageService.get<{ id: number }>(StorageKeys.FALL_USER);
    expect(value).toBeNull();
  });

  it("remove() deletes the stored item; subsequent get() is null", () => {
    const payload = { ok: true };
    StorageService.set(StorageKeys.FALL_USER, payload);

    StorageService.remove(StorageKeys.FALL_USER);
    expect(
      StorageService.get<typeof payload>(StorageKeys.FALL_USER),
    ).toBeNull();
  });

  it("get<T>() works for primitive values too (strings, numbers, booleans)", () => {
    StorageService.set(StorageKeys.FALL_USER, "hello");
    expect(StorageService.get<string>(StorageKeys.FALL_USER)).toBe("hello");

    StorageService.set(StorageKeys.FALL_USER, 42);
    expect(StorageService.get<number>(StorageKeys.FALL_USER)).toBe(42);

    StorageService.set(StorageKeys.FALL_USER, true);
    expect(StorageService.get<boolean>(StorageKeys.FALL_USER)).toBe(true);
  });

  it("gracefully returns null if stored data is not valid JSON", () => {
    // Simulate foreign/non-JSON write into localStorage
    localStorage.setItem(StorageKeys.FALL_USER, "not-json");
    expect(StorageService.get<unknown>(StorageKeys.FALL_USER)).toBeNull();
  });

  it("integration: set() then get() yields deep-equal data", () => {
    const data = { id: 3, roles: ["admin", "player"] as const };
    StorageService.set(StorageKeys.FALL_USER, data);
    const got = StorageService.get<typeof data>(StorageKeys.FALL_USER);
    expect(got).toEqual(data);
  });
});
