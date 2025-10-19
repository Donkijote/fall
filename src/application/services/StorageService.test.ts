import { StorageKeys, StorageService } from "./StorageService";

describe("StorageService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("set() stringifies the value and stores it under the given key", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem");

    const user = { id: 1, name: "Ana" };
    StorageService.set(StorageKeys.FALL_USER, user);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      StorageKeys.FALL_USER,
      JSON.stringify(user),
    );
    expect(localStorage.getItem(StorageKeys.FALL_USER)).toBe(
      JSON.stringify(user),
    );
  });

  it("get() returns the stored JSON string (caller is responsible for JSON.parse)", () => {
    const payload = { id: 2, name: "Ben" };
    localStorage.setItem(StorageKeys.FALL_USER, JSON.stringify(payload));

    const raw = StorageService.get(StorageKeys.FALL_USER);
    expect(raw).toBeTypeOf("string");
    expect(raw).toBe(JSON.stringify(payload));

    // Typical consumer usage:
    const parsed = JSON.parse(raw!);
    expect(parsed).toEqual(payload);
  });

  it("get() returns null when the key does not exist", () => {
    expect(StorageService.get(StorageKeys.FALL_USER)).toBeNull();
  });

  it("remove() deletes the stored item", () => {
    const spy = vi.spyOn(Storage.prototype, "removeItem");

    localStorage.setItem(StorageKeys.FALL_USER, '{"ok":true}');
    expect(localStorage.getItem(StorageKeys.FALL_USER)).not.toBeNull();

    StorageService.remove(StorageKeys.FALL_USER);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(StorageKeys.FALL_USER);
    expect(localStorage.getItem(StorageKeys.FALL_USER)).toBeNull();
  });

  it("integration: set() then get() yields the same data after JSON.parse", () => {
    const data = { id: 3, roles: ["admin", "player"] };
    StorageService.set(StorageKeys.FALL_USER, data);

    const stored = StorageService.get(StorageKeys.FALL_USER);
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed).toEqual(data);
  });
});
