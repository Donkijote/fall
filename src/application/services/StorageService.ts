export const StorageKeys = {
  FALL_USER: "FALL_USER",
} as const;

export const StorageService = {
  get: <T>(key: keyof typeof StorageKeys): T | null => {
    const raw = localStorage.getItem(key);
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  set: <T>(key: keyof typeof StorageKeys, data: T) =>
    localStorage.setItem(key, JSON.stringify(data)),
  remove: (key: keyof typeof StorageKeys) => localStorage.removeItem(key),
};
